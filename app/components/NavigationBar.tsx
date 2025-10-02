'use client';

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@mui/material';

function NavigationBar() {
  const navItems = [
    { name: '首页', href: '/' },
    { name: '单词', href: '/dashboard/vocabulary' },
    { name: '语法', href: '#' },
    { name: '阅读', href: '#' },
  ];
  const pathName = usePathname();

  return (
    <div className='bg-white shadow-md'>
      <nav className='flex flex-row py-3 items-center max-w-screen-lg mx-auto'>
        <div>
          <Button variant="text">Text</Button>
        </div>

        <div className='flex items-center gap-4 ml-3'>
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className={`${pathName === item.href ? 'text-2xl font-bold' : 'text-lg'}`}>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default NavigationBar