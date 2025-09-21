'use client'

import { userService } from '@/app/common/services/user.service'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const RegisterForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    try {
      const registerUserResult = await userService.registerUser(email, password)

      if (registerUserResult.ok) router.push('/dashboard' )
      else setError('Invalid email or password')
    } 
    catch (error) { setError('Something went wrong') } 
    finally { setLoading(false) }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
    >
      {/* <TextField
        label="First name"
        name="first_name"
        type="text"
        autoComplete="given-name"
        required
      />
      <TextField
        label="Last name"
        name="last_name"
        type="text"
        autoComplete="family-name"
        required
      /> */}
      <TextField
        className="col-span-full"
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <TextField
        className="col-span-full"
        label="Password (8 characters minimum)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />

      <div className="col-span-full">
        <Button type="submit" variant="solid" color="blue" className="w-full" disabled={loading}>
          <span>
            {loading ? 'Signing up...' : <>Sign up <span aria-hidden="true">&rarr;</span></>}
          </span>
        </Button>
      </div>
      
      {error && (
        <div className="col-span-full text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  )
}

export default RegisterForm