from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Patient, Doctor

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_picture', 
                  'profile_picture_url', 'user_type', 'address_line1', 'city', 'state', 
                  'pincode', 'date_joined']
        read_only_fields = ['date_joined', 'profile_picture_url']
        extra_kwargs = {'profile_picture': {'required': False, 'allow_null': True}}
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'user', 'medical_history', 'allergies', 'emergency_contact', 
                  'phone_number', 'date_of_birth', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PatientCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=False)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    address_line1 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=15, required=False)
    date_of_birth = serializers.DateField(required=False)
    medical_history = serializers.CharField(required=False, allow_blank=True)
    allergies = serializers.CharField(required=False, allow_blank=True)
    emergency_contact = serializers.CharField(max_length=150, required=False)
    
    def validate(self, attrs):
        if 'confirm_password' in attrs and attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        # Remove confirm_password from validated_data as it's not stored
        validated_data.pop('confirm_password', None)
        profile_picture = validated_data.pop('profile_picture', None)
        address_line1 = validated_data.pop('address_line1', None)
        city = validated_data.pop('city', None)
        state = validated_data.pop('state', None)
        pincode = validated_data.pop('pincode', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type='patient',
            profile_picture=profile_picture,
            address_line1=address_line1,
            city=city,
            state=state,
            pincode=pincode
        )
        patient = Patient.objects.create(
            user=user,
            phone_number=validated_data.get('phone_number', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            medical_history=validated_data.get('medical_history', ''),
            allergies=validated_data.get('allergies', ''),
            emergency_contact=validated_data.get('emergency_contact', '')
        )
        return patient


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'license_number', 'specialization', 'clinic_name',
                  'clinic_address', 'phone_number', 'experience_years', 'bio', 
                  'is_verified', 'created_at', 'updated_at']
        read_only_fields = ['is_verified', 'created_at', 'updated_at']


class DoctorCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=False)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    address_line1 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True)
    license_number = serializers.CharField(max_length=50)
    specialization = serializers.ChoiceField(choices=Doctor.SPECIALIZATION_CHOICES)
    phone_number = serializers.CharField(max_length=15, required=False)
    clinic_name = serializers.CharField(max_length=200, required=False)
    clinic_address = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(default=0)
    bio = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if 'confirm_password' in attrs and attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        # Remove confirm_password from validated_data as it's not stored
        validated_data.pop('confirm_password', None)
        profile_picture = validated_data.pop('profile_picture', None)
        address_line1 = validated_data.pop('address_line1', None)
        city = validated_data.pop('city', None)
        state = validated_data.pop('state', None)
        pincode = validated_data.pop('pincode', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type='doctor',
            profile_picture=profile_picture,
            address_line1=address_line1,
            city=city,
            state=state,
            pincode=pincode
        )
        doctor = Doctor.objects.create(
            user=user,
            license_number=validated_data['license_number'],
            specialization=validated_data['specialization'],
            phone_number=validated_data.get('phone_number', ''),
            clinic_name=validated_data.get('clinic_name', ''),
            clinic_address=validated_data.get('clinic_address', ''),
            experience_years=validated_data.get('experience_years', 0),
            bio=validated_data.get('bio', '')
        )
        return doctor