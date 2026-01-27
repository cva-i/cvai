import { useState } from 'react';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { Typography } from '../atoms/Typography';
import { cn } from '@ui/lib/utils';
import { useLoginMutation, useRegisterMutation } from '../../generated/graphql';

interface AlertProps {
  severity: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const Alert = ({ severity, children, className }: AlertProps) => {
  const severityClasses: Record<AlertProps['severity'], string> = {
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-md border text-sm',
        severityClasses[severity],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
};

export const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useLoginMutation();
  const [
    registerMutation,
    { loading: registerLoading, error: registerError },
  ] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await registerMutation({
          variables: {
            input: {
              email,
              password,
              firstName,
              lastName,
            },
          },
        });
      } else {
        await loginMutation({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
      }
      // Reload to trigger the GetCurrentUser query
      window.location.reload();
    } catch (err) {
      // Error is handled by the error state
      console.error('Authentication error:', err);
    }
  };

  const loading = loginLoading || registerLoading;
  const error = loginError ?? registerError;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-[400px] p-6 shadow-lg rounded-lg bg-background"
    >
      <Typography variant="h5" className="text-center">
        {isRegister ? 'Create Account' : 'Login'}
      </Typography>

      {error && (
        <Alert severity="error">
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </div>

      {isRegister && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? 'Please wait...'
          : isRegister
            ? 'Create Account'
            : 'Login'}
      </Button>

      <Button
        type="button"
        variant="link"
        onClick={() => setIsRegister(!isRegister)}
        disabled={loading}
      >
        {isRegister
          ? 'Already have an account? Login'
          : "Don't have an account? Register"}
      </Button>
    </form>
  );
};
