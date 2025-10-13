import React from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/20/solid';
import { Word } from '@/app/lib/types/vocabulary';

function WordCard(props: { word: Word }) {
  const { word } = props;

  return (
    <div className='flex flex-col bg-white rounded-2xl py-5 px-3 my-2'>
      <div className='flex w-full justify-between'>
        <div>
          <h4 className='text-4xl'>{word.word}</h4>
          <p className='ms-1'>{word.furigana}</p>
        </div>
        <span className='me-2'>
          <SpeakerWaveIcon className='h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer' />
        </span>
      </div>
      
      <div className='mt-5 ms-1'>
        <p>意味：物の言い方、言葉づかい</p>
        <div className='flex flex-col md:flex-row justify-between mt-2'>
          <div>
            <p>中：语言，话语，言辞，说法</p>
            <p>English: {word.meaning}</p>
          </div>
          <div className='self-end'>
            <span>认识</span>
            <span className='ms-1'>收藏</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordCard;