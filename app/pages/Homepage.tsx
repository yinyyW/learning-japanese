import React from 'react'
import ReadingCardGrid from '@/app/dashboard/components/ReadingCardGrid'
import ReadingCard from '@/app/dashboard/components/ReadingCard'

function Homepage() {
  return (
    <div className='max-w-screen-lg mx-auto'>
      <div className='py-12 w-full'>
        <h3 className='font-bold text-lg'>继续学习</h3>
        <div>

        </div>
      </div>

      <div className='py-12 w-full'>
        <h3 className='font-bold text-lg mb-5'>最新文章</h3>
        <ReadingCardGrid>
          <ReadingCard />
          <ReadingCard />
          <ReadingCard />
          <ReadingCard />
          <ReadingCard />
          <ReadingCard />
        </ReadingCardGrid>
      </div>
    </div>
  )
}

export default Homepage