import { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { useLoginMutation, useRegisterMutation } from '../../generated/graphql';

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 400,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" textAlign="center">
        {isRegister ? 'Create Account' : 'Login'}
      </Typography>

      {error && (
        <Alert severity="error">
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      {isRegister && (
        <>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading
          ? 'Please wait...'
          : isRegister
            ? 'Create Account'
            : 'Login'}
      </Button>

      <Button
        variant="text"
        onClick={() => setIsRegister(!isRegister)}
        disabled={loading}
      >
        {isRegister
          ? 'Already have an account? Login'
          : "Don't have an account? Register"}
      </Button>
    </Box>
  );
};
