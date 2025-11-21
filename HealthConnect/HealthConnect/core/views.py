from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from .models import Patient, Doctor
from .serializers import (
    UserSerializer, PatientSerializer, PatientCreateSerializer,
    DoctorSerializer, DoctorCreateSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        """List all users"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Only allow doctors to see all users for security reasons
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Permission denied. Only doctors can view all users.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Apply filters based on query parameters
        user_type = request.query_params.get('user_type', None)
        search = request.query_params.get('search', None)

        users = User.objects.all()

        if user_type:
            users = users.filter(user_type=user_type)

        if search:
            users = users.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        # Pagination
        page = request.query_params.get('page', 1)
        page_size = 10  # Default page size
        start = (int(page) - 1) * page_size
        end = start + page_size

        total_count = users.count()
        users = users[start:end]

        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response({
            'results': serializer.data,
            'count': total_count,
            'next': f'?page={int(page) + 1}' if end < total_count else None,
            'previous': f'?page={int(page) - 1}' if int(page) > 1 else None,
        })

    @action(detail=False, methods=['get'])
    def current_user(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Unified signup endpoint for both patients and doctors"""
    user_type = request.data.get('user_type', 'patient')
    
    # Handle address fields - convert from nested format to flat format
    data = request.data.copy()
    
    # Handle address[line1] format from FormData (most common case)
    if 'address[line1]' in data or 'address[city]' in data or 'address[state]' in data or 'address[pincode]' in data:
        # Extract address fields and ensure they're strings (empty string if not provided)
        data['address_line1'] = str(data.pop('address[line1]', '') or '')
        data['city'] = str(data.pop('address[city]', '') or '')
        data['state'] = str(data.pop('address[state]', '') or '')
        data['pincode'] = str(data.pop('address[pincode]', '') or '')
    # Handle nested address dict format
    elif 'address' in data:
        address = data.pop('address')
        if isinstance(address, dict):
            data['address_line1'] = str(address.get('line1', '') or '')
            data['city'] = str(address.get('city', '') or '')
            data['state'] = str(address.get('state', '') or '')
            data['pincode'] = str(address.get('pincode', '') or '')
    
    # Handle optional fields
    # For CharField with allow_blank=True, empty strings are valid
    # For fields that can be None (DateField, ImageField), convert empty strings to None
    optional_none_fields = ['date_of_birth', 'profile_picture']
    for field in optional_none_fields:
        if field in data and (data[field] == '' or data[field] is None):
            data[field] = None
    
    # For optional string fields with allow_blank=True, ensure they're strings, not None
    optional_string_fields = ['address_line1', 'city', 'state', 'pincode', 'phone_number', 
                              'medical_history', 'allergies', 'emergency_contact']
    for field in optional_string_fields:
        # Convert None or non-string values to empty string for CharField fields
        if field in data:
            if data[field] is None:
                data[field] = ''
            elif not isinstance(data[field], str):
                data[field] = str(data[field]) if data[field] else ''
    
    # Ensure required fields are present and not empty
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return Response(
            {field: ['This field is required.'] for field in missing_fields},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        if user_type == 'patient':
            serializer = PatientCreateSerializer(data=data)
        elif user_type == 'doctor':
            serializer = DoctorCreateSerializer(data=data)
        else:
            return Response(
                {'error': 'Invalid user_type. Must be "patient" or "doctor".'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not serializer.is_valid():
            # Return validation errors in a format the frontend can understand
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user_type == 'patient':
            patient = serializer.save()
            user = patient.user
        else:
            doctor = serializer.save()
            user = doctor.user
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Return response with token and user data
        user_serializer = UserSerializer(user, context={'request': request})
        return Response({
            'token': token.key,
            'user': user_serializer.data,
            'user_type': user.user_type
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Handle DRF ValidationError
        if hasattr(e, 'detail'):
            # This is a DRF ValidationError with field-specific errors
            return Response(
                e.detail,
                status=status.HTTP_400_BAD_REQUEST
            )
        # Handle Django ValidationError
        elif hasattr(e, 'message_dict'):
            return Response(
                e.message_dict,
                status=status.HTTP_400_BAD_REQUEST
            )
        # Handle other exceptions
        else:
            error_message = str(e)
            return Response(
                {'error': error_message, 'detail': error_message},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint that accepts both email and username"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username/email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Try authenticating with email first (since email is USERNAME_FIELD)
    user = authenticate(request, username=username, password=password)

    if user is None:
        # If email authentication fails, try looking up by username
        try:
            user_by_username = User.objects.get(username=username)
            # Authenticate using the found user's email
            user = authenticate(request, username=user_by_username.email, password=password)
        except User.DoesNotExist:
            user = None

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Create or get token
    token, created = Token.objects.get_or_create(user=user)

    # Return response with token and user data
    user_serializer = UserSerializer(user, context={'request': request})
    return Response({
        'token': token.key,
        'user': user_serializer.data,
        'user_type': user.user_type,
        'message': 'Login successful'
    })


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save()
        return Response(
            PatientSerializer(patient, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientSerializer(patient, context={'request': request})
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response(
                {'error': 'Patient profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
        except Patient.DoesNotExist:
            return Response(
                {'error': 'Patient profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PatientSerializer(patient, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DoctorCreateSerializer
        return DoctorSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save()
        return Response(
            DoctorSerializer(doctor, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
            serializer = DoctorSerializer(doctor, context={'request': request})
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DoctorSerializer(doctor, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def verified_doctors(self, request):
        doctors = Doctor.objects.filter(is_verified=True)
        serializer = DoctorSerializer(doctors, many=True, context={'request': request})
        return Response(serializer.data)