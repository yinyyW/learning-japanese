import React from 'react'

function ReadingCardGrid({className, children}: {className?: string, children?: React.ReactNode}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {children}
    </div>
  )
}

export default ReadingCardGrid;