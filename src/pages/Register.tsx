// React hook for managing component state
import { useState } from 'react';

// React Router hooks for navigation and linking
import { useNavigate, Link } from 'react-router-dom';

// Framer Motion for animations
import { motion } from 'framer-motion';

// Global state (Zustand store)
import { useStore } from '@/store/useStore';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

// Toast notification hook
import { useToast } from '@/hooks/use-toast';

// Icons
import { LayoutDashboard, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  // Form state values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading state for submit button
  const [isLoading, setIsLoading] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Register function from global store
  const register = useStore((state) => state.register);

  // Toast notification handler
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call register function from store
      const success = await register(name, email, password);

      if (success) {
        // Show success message
        toast({
          title: 'Account created!',
          description: 'Welcome to your project dashboard.',
        });

        // Redirect user to dashboard
        navigate('/dashboard');
      } else {
        // Registration failed (validation or server error)
        toast({
          title: 'Registration failed',
          description: 'Please check your information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Catch unexpected errors
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Stop loading state
      setIsLoading(false);
    }
  };

  return (
    // Full page background layout
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      {/* Animated container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Page header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg"
          >
            <LayoutDashboard className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Start managing your projects today
          </p>
        </div>

        {/* Registration card */}
        <Card className="p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full name field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Redirect to login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
