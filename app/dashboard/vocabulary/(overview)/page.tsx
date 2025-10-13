'use client'

import React, { useEffect, useState } from 'react'
import WordList from '@/app/dashboard/vocabulary/components/WordList'
import Pagination from '@/app/dashboard/vocabulary/components/Pagination'
import { useSearchParams } from 'next/navigation'
import Client from '@/app/api'
import { WordStatus, Word } from '@/app/lib/types/vocabulary'
import { WordListSkeleton } from '@/app/dashboard/vocabulary/components/skeletons'

const PAGE_SIZE = 10;

function Page() {
  const params = useSearchParams()
  const [words, setWords] = useState<Word[]>([])
  const [currPage, setCurrPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const queryWords = async (newPage?: number) => {
    const level = params.get('level')
    const status = params.get('status')
    setLoading(true)
    console.log('Fetch data for level:', level, 'status:', status, 'page:', currPage)
    const client = new Client()
    try {
      const wordsRes = await client.queryWords(
        level || undefined,
        status as WordStatus,
        newPage || currPage,
        PAGE_SIZE
      )
      const words = wordsRes.words || []
      const total = wordsRes.total || 0
      console.log('Total words:', total)
      setTotalPages(Math.ceil(total / PAGE_SIZE))
      setWords(words)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching words:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('use effect - reset curr page');
    setCurrPage(1);
    queryWords(1);
  }, [params]);

  return (
    <main className="ms-10">
      <h1 className="font-black mb-4 text-2xl md:text-3xl">词汇</h1>
      {loading ? (
        <WordListSkeleton />
      ) : (
        <div>
          <WordList words={words} />
          <Pagination
            currentPage={currPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              console.log(`page change to ${page}`);
              setCurrPage(page);
              queryWords(page);
            }}
          />
        </div>
      )}
    </main>
  )
}

export default Page
