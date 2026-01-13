'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const phone = watch('phone');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // API call for forgot password
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container safe-area bg-white dark:bg-black">
        <div className="h-12"></div>
        
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Check Your Phone</h1>
          <p className="text-secondary text-lg mb-8">
            We've sent a password reset link to your phone number
          </p>
          <div className="space-y-4">
            <Link href="/login" className="btn btn-primary w-full">
              Back to Login
            </Link>
            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full text-primary font-semibold"
            >
              Didn't receive? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container safe-area bg-white dark:bg-black">
      <div className="h-12"></div>
      
      <div className="px-6 py-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-secondary"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Forgot Password?</h1>
        <p className="text-secondary text-lg mb-8">
          Enter your phone number and we'll send you a reset link
        </p>
      </div>

      <div className="px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              type="tel"
              placeholder="Phone Number"
              className="input"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !phone}
            className="btn btn-primary w-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-secondary">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-500 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}