import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-full max-w-screen-lg mx-auto py-10">
      <div className="flex-3">{children}</div>
    </div>
  )
}

export default layout