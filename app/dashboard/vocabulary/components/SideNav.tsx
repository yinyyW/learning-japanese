'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ProgressBar from '@/app/components/ProgressBar'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { WordStatus } from '@/app/lib/types/vocabulary'

function SideNav() {
  const navItems = [
    { label: '我的' },
    { label: 'N1词汇', level: 'N1' },
    { label: 'N2词汇', level: 'N2' },
    { label: 'N3词汇', level: 'N3' },
    { label: 'N4词汇', level: 'N4' },
    { label: 'N5词汇', level: 'N5' },
  ]
  const [menuExpandIdx, setMenuExpandIdx] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState<WordStatus | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  return (
    <ul className="flex flex-col bg-white rounded-2xl shadow-md space-y-2 list-none">
      {navItems.map((item, idx) => (
        <li key={idx}>
          <button
            className="w-full font-medium text-xl p-3 text-left cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setMenuExpandIdx(menuExpandIdx === idx ? -1 : idx)
            }}
          >
            <div className="flex flex-row justify-between mb-1">
              <span>{item.label}</span>
              <KeyboardArrowDownIcon
                className={
                  idx === menuExpandIdx ? 'rotate-180 duration-300' : undefined
                }
              />
            </div>
            <ProgressBar />
          </button>
          <ul
            className={`list-none overflow-hidden duration-300 grid ${
              idx === menuExpandIdx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <li>
                <Link
                  href={`/dashboard/vocabulary?level=${item.level}&status=not_learned`}
                  className="p-3 pl-6 hover:bg-gray-100 flex"
                  style={{
                    backgroundColor:
                      selectedStatus === WordStatus.not_learned &&
                      idx === selectedIdx
                        ? '#e2e8f0'
                        : undefined,
                  }}
                  onClick={() => {
                    setSelectedStatus(WordStatus.not_learned);
                    setSelectedIdx(idx);
                  }}
                >
                  学习
                </Link>
              </li>
              <li>
                <Link
                  href={`/dashboard/vocabulary?level=${item.level}&status=learned`}
                  className="p-3 pl-6 hover:bg-gray-100 flex"
                  style={{
                    backgroundColor:
                      selectedStatus === WordStatus.learned &&
                      idx === selectedIdx
                        ? '#e2e8f0'
                        : undefined,
                  }}
                  onClick={() => {
                    setSelectedStatus(WordStatus.learned);
                    setSelectedIdx(idx);
                  }}
                >
                  复习
                </Link>
              </li>
            </div>
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default SideNav
