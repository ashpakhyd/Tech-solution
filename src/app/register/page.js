'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatch = password === confirmPassword;

  const onSubmit = async (data) => {
    if (!isPasswordMatch) {
      alert('Passwords do not match');
      return;
    }
    
    // Store basic info and move to next step
    setFormData(data);
    localStorage.setItem('registrationData', JSON.stringify(data));
    router.push('/register/professional');
  };

  return (
    <div className="container safe-area bg-white dark:bg-black">
      <div className="h-12"></div>
      
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Create Account</h1>
            <p className="text-secondary text-lg">Step 1 of 3 - Basic Information</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-secondary">Progress</div>
            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('name', { required: 'Full name is required' })}
              type="text"
              placeholder="Full Name"
              className="input"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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

          <div>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              type="email"
              placeholder="Email Address"
              className="input"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              placeholder="Create Password"
              className="input"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              type="password"
              placeholder="Confirm Password"
              className={`input ${
                confirmPassword && !isPasswordMatch ? 'border-red-500' : ''
              }`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
            {confirmPassword && !isPasswordMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isPasswordMatch || !password}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            Next Step
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}