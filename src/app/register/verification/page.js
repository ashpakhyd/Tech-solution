'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Verification() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [photoUploadController, setPhotoUploadController] = useState(null);
  const [photoInputRef, setPhotoInputRef] = useState(null);
  const [docInputRef, setDocInputRef] = useState(null);
  const [docUploadController, setDocUploadController] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      router.push('/register');
      return;
    }
    setFormData(JSON.parse(savedData));
  }, [router]);

  const uploadToCloudinary = async (file, controller) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ticket_uploads');

    const response = await fetch('https://api.cloudinary.com/v1_1/dsrmkwxbm/image/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    const data = await response.json();
    return data.secure_url;
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const controller = new AbortController();
    setPhotoUploadController(controller);
    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadToCloudinary(file, controller);
      setFormData(prev => ({ ...prev, profilePhoto: photoUrl }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Photo upload failed:', error);
        alert('Photo upload failed. Please try again.');
      }
    } finally {
      setUploadingPhoto(false);
      setPhotoUploadController(null);
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const controller = new AbortController();
    setDocUploadController(controller);
    setUploadingDoc(true);
    try {
      const docUrl = await uploadToCloudinary(file, controller);
      setFormData(prev => ({ ...prev, idDocument: docUrl }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Document upload failed:', error);
        alert('Document upload failed. Please try again.');
      }
    } finally {
      setUploadingDoc(false);
      setDocUploadController(null);
    }
  };

  const cancelPhotoUpload = () => {
    if (photoUploadController) {
      photoUploadController.abort();
    }
  };

  const cancelDocUpload = () => {
    if (docUploadController) {
      docUploadController.abort();
    }
  };

  const clearPhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }));
    if (photoInputRef) {
      photoInputRef.value = '';
    }
  };

  const clearDocument = () => {
    setFormData(prev => ({ ...prev, idDocument: null }));
    if (docInputRef) {
      docInputRef.value = '';
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const finalData = { ...formData, ...data };
      
      // API call for registration
      console.log('Final registration data:', finalData);
      
      // Clear localStorage
      localStorage.removeItem('registrationData');
      
      // Redirect to OTP
      router.push('/otp');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Verification</h1>
        <p className="text-secondary text-lg mb-8">Step 3 of 3 - Complete your profile</p>
      </div>

      <div className="px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register('address', { required: 'Address is required' })}
              type="text"
              placeholder="Current Address"
              className="input"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Government ID Type</label>
            <select
              {...register('idType', { required: 'ID type is required' })}
              className="input"
            >
              <option value="">Select ID Type</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="driving">Driving License</option>
              <option value="voter">Voter ID</option>
            </select>
            {errors.idType && (
              <p className="text-red-500 text-sm mt-1">{errors.idType.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('idNumber', { required: 'ID number is required' })}
              type="text"
              placeholder="Government ID Number"
              className="input"
            />
            {errors.idNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.idNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Profile Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="input"
              ref={(ref) => setPhotoInputRef(ref)}
            />
            {uploadingPhoto && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-secondary">Uploading photo...</span>
                </div>
                <button
                  type="button"
                  onClick={cancelPhotoUpload}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
                >
                  <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
            )}
            {formData.profilePhoto && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-green-600">✓ Photo uploaded successfully</p>
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
                >
                  <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
            )}
            <p className="text-xs text-secondary mt-1">Upload a clear photo for verification</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ID Document (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleDocUpload}
              disabled={uploadingDoc}
              className="input"
              ref={(ref) => setDocInputRef(ref)}
            />
            {uploadingDoc && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-secondary">Uploading document...</span>
                </div>
                <button
                  type="button"
                  onClick={cancelDocUpload}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
                >
                  <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
            )}
            {formData.idDocument && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-green-600">✓ Document uploaded successfully</p>
                <button
                  type="button"
                  onClick={clearDocument}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
                >
                  <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
            )}
            <p className="text-xs text-secondary mt-1">Upload your government ID document</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Registration Summary</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-secondary">Name:</span> {formData.name}</p>
              <p><span className="text-secondary">Phone:</span> {formData.phone}</p>
              <p><span className="text-secondary">Email:</span> {formData.email}</p>
              <p><span className="text-secondary">Experience:</span> {formData.experience}</p>
              <p><span className="text-secondary">Service Areas:</span> {formData.serviceAreas}</p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || uploadingPhoto || uploadingDoc}
            className="btn btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}