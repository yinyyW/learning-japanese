'use client'

import React, { useState } from 'react'
import { Suspense } from 'react'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/components/Button'
import Client from '@/app/api'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { ApiError, defaultErrorMsg } from '@/app/lib/types/common'

function VerifyEmailPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleVerifyError = (error: ApiError) => {
    console.error('Verification error');
    setError(error.message || defaultErrorMsg);
    setLoading(false);
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleVerify');
    setLoading(true);
    setError(null)
    // Basic validation
    if (!code) {
      setError('Please enter the verification code.')
      return
    }
    try {
      const client = new Client();
      await client.register(code);
      router.push('/auth/login');
    } catch (err) {
      handleVerifyError(err as ApiError);
    }
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Suspense>
          <form className="space-y-3" onSubmit={handleVerify}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className="mb-3 text-xl">
                Verification Code has been sent to your email address.
              </h1>
              <div className="w-full">
                <div>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-1 text-sm outline-2 placeholder:text-gray-500"
                      id="verificationCode"
                      name="verificationCode"
                      placeholder="Enter your email verification code"
                      required
                      onChange={(e) => {
                        setCode(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <div className='mt-2 mb-1 text-sm'>
                    {error && (
                      <span className="text-red-500">
                        {error}
                      </span>
                    )}
                  </div>
              </div>
              <Button className="mt-7 w-full">
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <span className="w-full flex items-center">
                    Confirm{' '}
                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Suspense>
      </div>
    </main>
  )
}

export default VerifyEmailPage
