'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const { register, handleSubmit, watch, setValue, getValue } = useForm();
  const router = useRouter();

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatch = password === confirmPassword;

  const onSubmit = async (data) => {
    if (!isPasswordMatch) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      // API call for registration
      router.push('/otp');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="pt-12 pb-6 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join as a technician</p>
        </div>
      </div>

      <div className="flex-1 px-6">
        <div className="card p-6 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                {...register('name', { required: true })}
                type="text"
                placeholder="Enter your full name"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                {...register('phone', { required: true })}
                type="tel"
                placeholder="Enter your phone number"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                {...register('email', { required: true, type: 'email' })}
                type="email"
                placeholder="Enter your email"
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                placeholder="Create a password"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', { required: true })}
                type="password"
                placeholder="Confirm your password"
                className={`input-field w-full ${
                  confirmPassword && !isPasswordMatch ? 'border-red-500' : ''
                }`}
              />
              {confirmPassword && !isPasswordMatch && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!isPasswordMatch || !password}
              className="btn-primary touch-friendly w-full py-4 disabled:opacity-50"
            >
              Create Account
            </button>
          </form>
        </div>

        <div className="text-center pb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}