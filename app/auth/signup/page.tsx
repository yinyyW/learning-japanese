'use client'

import { Suspense, useState, useEffect } from 'react'
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/components/Button'
import Client from '@/app/api'
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/navigation'
import { FormField, Validator } from '../types/FormFieldItem'
import { ApiError, defaultErrorMsg } from '@/app/lib/types/common'
import { CircularProgress } from '@mui/material'

export default function LoginPage() {
  // State for error messages
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Form fields with validation
  const [emailField, setEmailField] = useState<FormField | null>(null)
  const [passwordField, setPasswordField] = useState<FormField | null>(null)
  const [confirmPasswordField, setConfirmPasswordField] =
    useState<FormField | null>(null)

  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    if (!confirmPasswordField) {
      setConfirmPasswordField(
        new FormField({
          name: 'confirmPassword',
          value: '',
          validator: Validator.confirmPasswordValidate,
          setErrorFunc: setConfirmPasswordError,
          setValueFunc: setConfirmPasswordField,
        })
      )
    }
  }, [emailField, passwordField, confirmPasswordField])

  const clearMessages = () => {
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setApiError(null);
  }

  const handleSendCodeError = (error: ApiError) => {
    console.error('Signup error:', error)
    setLoading(false);
    setApiError(error.message || defaultErrorMsg)
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('handleSignup');
    setLoading(true);

    // validate inputs
    clearMessages()
    const email = emailField?.value || ''
    const pwd = passwordField?.value || ''
    const confirmPwd = confirmPasswordField?.value || ''

    const validEmail = emailField?.validate() ?? false
    const validPassword = passwordField?.validate() ?? false
    const validConfirmPwd = confirmPasswordField?.validate() ?? false

    if (!validEmail || !validPassword || !validConfirmPwd) {
      setLoading(false);
      console.log('validation failed')
      return
    }

    if (pwd !== confirmPwd) {
      console.log('passwords do not match');
      setConfirmPasswordError('Please make sure the passwords match');
      setLoading(false);
      return;
    }

    try {
      const hashPwd = await bcrypt.hash(pwd!, 10)
      const client = new Client()
      await client.preRegister(email, hashPwd)
      router.push('/auth/verifyEmail')
    } catch (err) {
      handleSendCodeError(err as ApiError)
    }
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <Suspense>
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className="mb-3 text-2xl">Please sign up to continue.</h1>
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
                        emailField?.setValue(e.target.value)
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
                        passwordField?.setValue(e.target.value)
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

                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Confirm password"
                      onChange={(e) => {
                        confirmPasswordField?.setValue(e.target.value)
                        if (
                          confirmPasswordField?.value !== passwordField?.value
                        ) {
                          setConfirmPasswordError(
                            'Please make sure the passwords match'
                          )
                        } else {
                          setConfirmPasswordError(null)
                        }
                      }}
                    />
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                  <div>
                    {confirmPasswordError && (
                      <span className="text-red-500">
                        {confirmPasswordError}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button className="mt-7 w-full">
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <span className="w-full flex items-center">
                    Sign Up{' '}
                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                  </span>
                )}
              </Button>
              <div className="flex justify-center mt-3">
                {apiError && <span className="text-red-500">{apiError}</span>}
              </div>
            </div>
          </form>
        </Suspense>
      </div>
    </main>
  )
}
