'use client';

import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../store/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const phone = watch('phone');
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ token: result.token, user: null }));
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="container safe-area bg-white dark:bg-black">
      <div className="h-12"></div>
      
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Welcome Back</h1>
        <p className="text-secondary text-lg">Sign in to continue</p>
      </div>

      <div className="px-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error.data?.message || error.message || 'Login failed'}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                {...register('phone', { required: 'Phone number is required' })}
                type="tel"
                placeholder="Phone Number"
                className="input"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="Password"
                className="input"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <Link href="/forgot-password" className="text-primary text-sm font-semibold">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !phone || !password}
            className="btn btn-primary w-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-secondary">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}