import React, { Suspense } from 'react'
import SideNav from '@/app/dashboard/vocabulary/components/SideNav'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-full max-w-screen-lg mx-auto py-10">
      <div className="flex-1">
        <SideNav />
      </div>
      <Suspense fallback={<div className="flex-3">Loading...</div>}>
        <div className="flex-3">{children}</div>
      </Suspense>
    </div>
  )
}

export default layout
