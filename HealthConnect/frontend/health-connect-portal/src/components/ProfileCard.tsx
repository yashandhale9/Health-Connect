import { User } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, User as UserIcon } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <Card className="card-healthcare">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_picture || undefined} alt={user.first_name} />
            <AvatarFallback className="bg-accent text-accent-foreground text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {user.first_name} {user.last_name}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              {user.user_type === 'patient' ? 'Patient' : 'Doctor'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <UserIcon className="h-4 w-4" />
          <span className="text-sm">@{user.username}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{user.email}</span>
        </div>
        {user.address && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span className="text-sm">
              {user.address.line1}, {user.address.city}, {user.address.state} -{' '}
              {user.address.pincode}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
