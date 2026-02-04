'use client';

import Link from 'next/link';

export default function VerificationPending() {
  return (
    <div className="container safe-area bg-white dark:bg-black">
      <div className="h-12"></div>
      
      <div className="px-6 py-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M12,20C10.5,20 9.13,19.5 8,18.65C8.84,17.32 10.32,16.5 12,16.5C13.68,16.5 15.16,17.32 16,18.65C14.87,19.5 13.5,20 12,20Z"/>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-black dark:text-white mb-3">Profile Under Verification</h1>
        <p className="text-secondary text-lg mb-8 leading-relaxed">
          Thank you for registering! Your profile is currently being reviewed by our team. 
          We'll notify you once the verification is complete.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-600 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
            </svg>
            <div className="text-left">
              <h3 className="font-semibold text-orange-800 mb-1">What happens next?</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Our team will verify your documents and information</li>
                <li>• You'll receive an email/SMS once approved</li>
                <li>• Verification typically takes 24-48 hours</li>
                <li>• You can then start receiving service requests</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link href="/login" className="btn btn-primary w-full">
            Back to Login
          </Link>
          
          <div className="text-center">
            <p className="text-secondary text-sm">
              Need help? Contact our support team
            </p>
            <a href="tel:+911234567890" className="text-primary font-semibold text-sm">
              +91 123-456-7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}