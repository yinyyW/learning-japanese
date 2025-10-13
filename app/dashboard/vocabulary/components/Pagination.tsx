'use client'
import { generatePagination } from '@/app/lib/util'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { useEffect } from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationNumber({
  page,
  isActive,
  position,
  onPageChange,
}: {
  page: number | string
  position?: 'first' | 'last' | 'middle' | 'single'
  isActive: boolean
  onPageChange: (page: number) => void
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm rounded-md',
    {
      'z-10 bg-blue-600 border-blue-600 text-white border border-gray-300':
        isActive,
      'hover:bg-gray-300 hover:cursor-pointer':
        !isActive && position !== 'middle',
      'text-black': position === 'middle',
    }
  )

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <button className={className} onClick={() => onPageChange(Number(page))}>
      {page}
    </button>
  )
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages
  const [allPages, setAllPages] = React.useState<(number | string)[]>([])

  useEffect(() => {
    setAllPages(generatePagination(currentPage, totalPages))
  }, [currentPage, totalPages])

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {totalPages === 0 ? null : (
        <button
          disabled={prevDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center px-3 py-1 border rounded ${
            prevDisabled
              ? 'opacity-50'
              : 'hover:bg-gray-300 hover:cursor-pointer'
          }`}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          上一页
        </button>
      )}

      <div className="flex -space-x-px gap-1">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined

          if (index === 0) position = 'first'
          if (index === allPages.length - 1) position = 'last'
          if (allPages.length === 1) position = 'single'
          if (page === '...') position = 'middle'

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              page={page}
              position={position}
              isActive={currentPage === page}
              onPageChange={onPageChange}
            />
          )
        })}
      </div>

      {totalPages === 0 ? null : (
        <button
          disabled={nextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center px-3 py-1 border rounded ${
            nextDisabled
              ? 'opacity-50'
              : 'hover:bg-gray-300 hover:cursor-pointer'
          }`}
        >
          下一页 <ArrowRightIcon className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  )
}
