import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Heart, Shield, Users, ArrowRight, Sparkles, Zap, Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Header */}
      <header className="relative container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-primary">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-display font-bold gradient-text">HealthConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth/login">
            <Button variant="ghost" className="hover:bg-primary/10">Login</Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="gradient-primary text-white border-0 hover:opacity-90 glow-purple">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Modern Healthcare Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight">
            <span className="gradient-text">Secure Healthcare</span>
            <br />
            Connections
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Signup as Patient or Doctor
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with healthcare professionals and manage your medical journey
            with our modern, secure platform built for patients and doctors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/auth/signup">
              <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 hover-lift glow-purple text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="hover-lift border-2 border-primary/20 hover:border-primary/40 text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card-healthcare p-8 text-center space-y-4 hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your health data is encrypted and protected with industry-leading security standards.
            </p>
          </div>

          <div className="card-healthcare p-8 text-center space-y-4 hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-display font-semibold">Easy Collaboration</h3>
            <p className="text-muted-foreground">
              Connect patients and doctors seamlessly for better healthcare outcomes.
            </p>
          </div>

          <div className="card-healthcare p-8 text-center space-y-4 hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-healthcare-pink/20 to-healthcare-pink/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="h-8 w-8 text-healthcare-pink" />
            </div>
            <h3 className="text-xl font-display font-semibold">Patient-Centered</h3>
            <p className="text-muted-foreground">
              Designed with both patients and healthcare providers in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="card-healthcare p-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          <div className="relative grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-primary" />
                <p className="text-4xl font-display font-bold gradient-text">100%</p>
              </div>
              <p className="text-muted-foreground">Secure Platform</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-accent" />
                <p className="text-4xl font-display font-bold gradient-text">24/7</p>
              </div>
              <p className="text-muted-foreground">Support Available</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6 text-healthcare-pink" />
                <p className="text-4xl font-display font-bold gradient-text">∞</p>
              </div>
              <p className="text-muted-foreground">Connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            &copy; 2024 <span className="font-semibold gradient-text">HealthConnect</span>. Built with care for better healthcare.
          </p>
        </div>
      </footer>
    </div>
  );
}
