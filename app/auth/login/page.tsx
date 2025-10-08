'use client'

import { Suspense, useEffect } from 'react'
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/components/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { CircularProgress } from '@mui/material'
import { FormField, Validator } from '../types/FormFieldItem'
import { ApiError, defaultErrorMsg } from '@/app/lib/types/common'

export default function LoginPage() {
  // State for error messages
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Form fields with validation
  const [emailField, setEmailField] = useState<FormField | null>(null)
  const [passwordField, setPasswordField] = useState<FormField | null>(null)

  useEffect(() => {
    if (!emailField) {
      setEmailField(
        new FormField({
          name: 'email',
          value: '',
          setErrorFunc: setEmailError,
          validator: Validator.emailValidate,
          setValueFunc: setEmailField,
        })
      )
    }
    if (!passwordField) {
      setPasswordField(
        new FormField({
          name: 'password',
          value: '',
          setErrorFunc: setPasswordError,
          validator: Validator.passwordValidate,
          setValueFunc: setPasswordField,
        })
      )
    }
  }, [emailField, passwordField])

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLoginError = (error: ApiError) => {
    console.error('Login error:', error);
    setPasswordError(error.message || defaultErrorMsg);
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = emailField?.value || ''
    const password = passwordField?.value || ''
    console.log(`Logging in with email: ${email}, ${password}`);
    setLoading(true)
    const validEmail = emailField?.validate() ?? false
    const validPassword = passwordField?.validate() ?? false
    if (!validEmail || !validPassword) {
      setLoading(false)
      return
    }
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      handleLoginError(error as ApiError)
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Suspense>
          <form className="space-y-3" onSubmit={handleLogin}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className="mb-3 text-2xl">Please log in to continue.</h1>
              <div className="w-full">
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      onChange={(e) => {
                        const currEmail = e.target.value
                        emailField?.setValue(currEmail)
                      }}
                    />
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  <div>
                    {emailError && (
                      <span className="text-red-500">{emailError}</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      onChange={(e) => {
                        const currPassword = e.target.value
                        passwordField?.setValue(currPassword)
                      }}
                    />
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  <div>
                    {passwordError && (
                      <span className="text-red-500">{passwordError}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button className="mt-4 w-full">
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <span className="w-full flex items-center">
                    Log in{' '}
                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                  </span>
                )}
              </Button>
              <div className="flex w-full justify-center text-blue-400 mt-3 font-bold text-lg">
                <Link href="/auth/signup">Create a new account</Link>
              </div>
            </div>
          </form>
        </Suspense>
      </div>
    </main>
  )
}
