from django.contrib import admin
from .models import Users, Patient, Doctor

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'user_type', 'date_joined', 'is_active']
    list_filter = ['user_type', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account Type', {'fields': ('user_type',)}),
        ('Important Dates', {'fields': ('date_joined', 'last_login')}),
    )


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['get_username', 'phone_number', 'date_of_birth', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email', 'phone_number']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'specialization', 'license_number', 'is_verified', 'created_at']
    list_filter = ['specialization', 'is_verified', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'license_number']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return f"Dr. {obj.user.first_name} {obj.user.last_name}"
    get_full_name.short_description = 'Full Name'