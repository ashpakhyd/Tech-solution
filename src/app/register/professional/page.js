'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProfessionalDetails() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const selectedSkills = watch('skills') || [];

  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      router.push('/register');
      return;
    }
    setFormData(JSON.parse(savedData));
  }, [router]);

  const onSubmit = async (data) => {
    const updatedData = { ...formData, ...data };
    localStorage.setItem('registrationData', JSON.stringify(updatedData));
    router.push('/register/verification');
  };

  const skillOptions = [
    'Electrician - Wiring & Installation',
    'Electrician - Electrical Repair', 
    'Electrician - Lighting Solutions',
    'Electrician - Fan Installation',
    'Appliances - Washing Machine',
    'Appliances - Refrigerator',
    'Appliances - Microwave',
    'Appliances - Dishwasher',
    'Appliances - Air Conditioner',
    'Appliances - Television'
  ];

  return (
    <div className="container safe-area bg-white dark:bg-black">
      <div className="h-12"></div>
      
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
          </button>
          <div className="text-right">
            <div className="text-sm text-secondary">Progress</div>
            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Professional Details</h1>
        <p className="text-secondary text-lg mb-8">Step 2 of 3 - Tell us about your expertise</p>
      </div>

      <div className="px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Experience (Years)</label>
            <select
              {...register('experience', { required: 'Experience is required' })}
              className="input"
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5-10">5-10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills & Services (Select multiple)</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center gap-2">
                  <input
                    {...register('skills', { required: 'Please select at least one skill' })}
                    type="checkbox"
                    value={skill}
                    className="rounded"
                  />
                  <span className="text-sm">{skill}</span>
                </label>
              ))}
            </div>
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('serviceAreas', { required: 'Service areas are required' })}
              type="text"
              placeholder="Service Areas (e.g., Delhi, Gurgaon, Noida)"
              className="input"
            />
            {errors.serviceAreas && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceAreas.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Certification (Optional)</label>
            <select
              {...register('certification')}
              className="input"
            >
              <option value="">Select Certification</option>
              <option value="ITI">ITI Certified</option>
              <option value="Diploma">Diploma in Electrical/Mechanical</option>
              <option value="Trade">Trade Certificate</option>
              <option value="Other">Other Professional Certificate</option>
              <option value="None">No Certification</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Next Step
          </button>
        </form>
      </div>
    </div>
  );
}