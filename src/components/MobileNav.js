'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../store/authSlice';

export default function MobileNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !token || pathname === '/login' || pathname === '/register' || pathname === '/otp') return null;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 safe-area px-4 py-2">
      <div className="flex justify-around items-center">
        <Link href="/" className={`nav-item ${
          pathname === '/' ? 'active' : ''
        }`}>
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="text-xs font-medium">Home</span>
        </Link>
        
        <Link href="/tickets" className={`nav-item ${
          pathname === '/tickets' || pathname.startsWith('/ticket/') ? 'active' : ''
        }`}>
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <span className="text-xs font-medium">Tickets</span>
        </Link>
        
        <Link href="/alerts" className={`nav-item ${
          pathname === '/alerts' ? 'active' : ''
        }`}>
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
            </svg>
          </div>
          <span className="text-xs font-medium">Alerts</span>
        </Link>
        
        <Link href="/profile" className={`nav-item ${
          pathname === '/profile' ? 'active' : ''
        }`}>
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
          </div>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}