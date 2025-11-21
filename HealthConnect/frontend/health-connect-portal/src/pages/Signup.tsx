import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';
import { AddressForm } from '@/components/AddressForm';
import { toast } from '@/hooks/use-toast';
import { api, SignupData } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, UserCircle, Stethoscope } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'patient',
    address: {
      line1: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    
    if (formData.address?.pincode && !/^\d{6}$/.test(formData.address.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.signup({ ...formData, user_type: userType }, confirmPassword);
      // Store token and user data
      localStorage.setItem('auth_token', response.token);
      
      // Refresh user data in context
      await refreshUser();
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
      });
      
      // Navigate to appropriate dashboard - ensure user_type exists
      const dashboardUserType = response.user_type || response.user?.user_type || userType;
      if (dashboardUserType) {
        navigate(`/dashboard/${dashboardUserType}`);
      } else {
        navigate('/auth/login');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-healthcare">
        <CardHeader>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Join as a patient or healthcare provider</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={userType === 'patient' ? 'default' : 'outline'}
                className="h-20"
                onClick={() => setUserType('patient')}
              >
                <div className="flex flex-col items-center gap-2">
                  <UserCircle className="h-6 w-6" />
                  <span>Patient</span>
                </div>
              </Button>
              <Button
                type="button"
                variant={userType === 'doctor' ? 'default' : 'outline'}
                className="h-20"
                onClick={() => setUserType('doctor')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Stethoscope className="h-6 w-6" />
                  <span>Doctor</span>
                </div>
              </Button>
            </div>

            {/* Profile Picture */}
            <div>
              <Label>Profile Picture (Optional)</Label>
              <FileUploader onFileSelect={(file) => setFormData({ ...formData, profile_picture: file || undefined })} />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Address */}
            <div>
              <Label className="text-base mb-2 block">Address (Optional)</Label>
              <AddressForm
                address={formData.address!}
                onChange={(address) => setFormData({ ...formData, address })}
                errors={errors}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-accent hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
