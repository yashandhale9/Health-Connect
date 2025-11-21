const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface LoginResponse {
  token: string;
  redirect_url?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'patient' | 'doctor';
  profile_picture?: string | null;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'patient' | 'doctor';
  profile_picture?: File;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

class ApiService {
  private getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Token ${token}` } : {};
  }

  async login(username: string, password: string): Promise<{ token: string; user: User; user_type: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.detail || 
        (typeof error === 'object' && error !== null 
          ? Object.values(error).flat().join(', ') 
          : 'Login failed');
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async signup(data: SignupData, confirmPassword: string): Promise<{ token: string; user: User; user_type: string }> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirm_password', confirmPassword);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('user_type', data.user_type);

    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    // Only send address if at least one field has a value
    if (data.address) {
      const hasAddressData = data.address.line1 || data.address.city || 
                            data.address.state || data.address.pincode;
      if (hasAddressData) {
        // Send address as nested fields
        formData.append('address[line1]', data.address.line1 || '');
        formData.append('address[city]', data.address.city || '');
        formData.append('address[state]', data.address.state || '');
        formData.append('address[pincode]', data.address.pincode || '');
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/signup/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        throw new Error(`Signup failed: ${response.statusText}`);
      }
      
      // Handle field-specific validation errors from DRF
      if (typeof error === 'object' && error !== null) {
        const errorMessages: string[] = [];
        
        // Check for simple error message
        if (error.detail && typeof error.detail === 'string') {
          errorMessages.push(error.detail);
        } else if (error.error && typeof error.error === 'string') {
          errorMessages.push(error.error);
        } else {
          // Handle field-specific errors (DRF format)
          for (const [field, messages] of Object.entries(error)) {
            if (field === 'detail' || field === 'error') continue;
            
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            } else if (typeof messages === 'object' && messages !== null) {
              // Handle nested errors
              for (const [subField, subMessages] of Object.entries(messages as any)) {
                if (Array.isArray(subMessages)) {
                  errorMessages.push(`${field}.${subField}: ${subMessages.join(', ')}`);
                } else if (typeof subMessages === 'string') {
                  errorMessages.push(`${field}.${subField}: ${subMessages}`);
                }
              }
            }
          }
        }
        
        const errorMessage = errorMessages.length > 0 
          ? errorMessages.join('; ') 
          : JSON.stringify(error);
        throw new Error(errorMessage);
      }
      
      throw new Error('Signup failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getUsers(params?: {
    user_type?: string;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<{ results: User[]; count: number; next: string | null; previous: string | null }> {
    const queryParams = new URLSearchParams();
    if (params?.user_type) queryParams.append('user_type', params.user_type);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await fetch(`${API_BASE_URL}/api/users/?${queryParams}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async getPatientDashboard(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/patient/dashboard/`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient dashboard');
    }

    return response.json();
  }

  async getDoctorDashboard(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard/`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctor dashboard');
    }

    return response.json();
  }
}

export const api = new ApiService();
