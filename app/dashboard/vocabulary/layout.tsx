import React from 'react'
import SideNav from '@/app/dashboard/vocabulary/components/SideNav';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-full max-w-screen-lg mx-auto py-10">
      <div className="flex-1">
        <SideNav />
      </div>
      <div className="flex-3">{children}</div>
    </div>
  )
}

export default layout