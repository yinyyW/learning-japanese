import React from 'react'
import ReadingCardTag from './ReadingCardTag';

function ReadingCard() {
  return (
    <div className='flex flex-col bg-[#fffffe] rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1'>
      <div className='relative'>
        <img src="https://media.marsjpclass.com/images%2Farticle%2Fne2025072512049.jpg?Expires=3518233238&OSSAccessKeyId=LTAI5tGoxTxVJkmUbEiKcj71&Signature=rNZxVIB4j1%2FJqJATZCiCoGQTC20%3D" alt="reading card" />
        <ReadingCardTag />
      </div>

      <div className='p-4'>
        <div>
          <h3 className='font-semibold text-[#232323] text-lg line-clamp-2'>
            スイカが有名な尾花沢市　子どもたちが給食でスイカを食べた
          </h3>
          <p className='mt-2'>发布日期 2025/08/01</p>
        </div>
      </div>
      
    </div>
  )
}

export default ReadingCard;