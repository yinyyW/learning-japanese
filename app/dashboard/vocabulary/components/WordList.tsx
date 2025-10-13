import React from 'react'
import WordCard from './WordCard'

function WordList(props: { words: Word[] }) {

  return (
    <div className='flex flex-col mt-4'>
      {props.words.map((word, idx) => (
        <WordCard key={idx} word={word} />
      ))}
    </div>
  )
}

export default WordList