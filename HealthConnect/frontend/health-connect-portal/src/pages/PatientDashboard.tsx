import { useAuth } from '@/contexts/AuthContext';
import { ProfileCard } from '@/components/ProfileCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PatientDashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileCard user={user} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="card-healthcare hover-lift cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Appointments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">View and manage your upcoming appointments</p>
                  <Button variant="link" className="px-0 mt-2">
                    View all →
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-healthcare hover-lift cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Medical Records</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access your medical history and documents</p>
                  <Button variant="link" className="px-0 mt-2">
                    View records →
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-healthcare hover-lift cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <MessageSquare className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>Messages</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Communicate with your healthcare providers</p>
                  <Button variant="link" className="px-0 mt-2">
                    Open messages →
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="card-healthcare">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming appointments</p>
                  <Button variant="outline" className="mt-4">
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
