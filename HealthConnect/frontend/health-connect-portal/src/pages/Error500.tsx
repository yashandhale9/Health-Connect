import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';

export default function Error500() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <ServerCrash className="h-24 w-24 mx-auto text-destructive" />
        <h1 className="text-6xl font-bold">500</h1>
        <h2 className="text-2xl font-semibold">Server Error</h2>
        <p className="text-muted-foreground">
          Something went wrong on our end. We're working to fix it.
        </p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
