'use client';

import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OTP() {
  const { register, handleSubmit, watch, setValue, getValue } = useForm({
    defaultValues: { otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' }
  });
  const inputRefs = useRef([]);
  const router = useRouter();

  const otpValues = watch(['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6']);
  const isComplete = otpValues.every(val => val !== '');

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    setValue(`otp${index + 1}`, value);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !getValue(`otp${index + 1}`) && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data) => {
    const otpCode = Object.values(data).join('');
    if (otpCode.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }

    try {
      // API call for OTP verification
      router.push('/login');
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleResend = () => {
    // Clear all OTP fields
    for (let i = 1; i <= 6; i++) {
      setValue(`otp${i}`, '');
    }
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="pt-12 pb-8 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Verify Phone</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your phone
          </p>
        </div>
      </div>

      <div className="flex-1 px-6">
        <div className="card p-6 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <input
                  key={num}
                  {...register(`otp${num}`)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              ))}
            </div>
            
            <button
              type="submit"
              disabled={!isComplete}
              className="btn-primary touch-friendly w-full py-4 disabled:opacity-50"
            >
              Verify OTP
            </button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={handleResend}
            className="text-red-600 font-semibold"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}