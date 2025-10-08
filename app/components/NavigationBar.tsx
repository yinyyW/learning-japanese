'use client';

import React from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { useAuth } from '@/app/providers/AuthProvider';

function NavigationBar() {
  const navItems = [
    { name: '首页', href: '/' },
    { name: '单词', href: '/dashboard/vocabulary' },
    { name: '语法', href: '#' },
    { name: '阅读', href: '#' },
  ];
  const pathName = usePathname();
  const router = useRouter();
  const { user, loggedIn, logout } = useAuth();

  return (
    <div className='bg-white shadow-md'>
      <nav className='flex flex-row justify-between py-3 items-center max-w-screen-lg mx-auto'>
        <div className='flex items-center gap-4 ml-3'>
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className={`${pathName === item.href ? 'text-2xl font-bold' : 'text-lg'}`}>
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          {/* {loggedIn && user && <span>Welcome, {user.email}!</span>} */}
          <Button variant="text" onClick={async () => {
            if (loggedIn && logout) {
              await logout();
            }
            router.replace('/auth/login');
          }}>{loggedIn ? 'Logout' : 'Login'}</Button>
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar