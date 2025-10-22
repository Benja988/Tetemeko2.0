'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { AxiosError } from 'axios'

export default function AdminRegisterPage() {
  const router = useRouter()
  const { registerAdmin } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    adminSecret: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    adminSecret: '',
  })

  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation functions
  const validateName = (name: string) => {
    if (name.trim().length < 3) return 'Name must be at least 3 characters'
    return ''
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Invalid email address'
    return ''
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Must include an uppercase letter'
    if (!/[a-z]/.test(password)) return 'Must include a lowercase letter'
    if (!/[0-9]/.test(password)) return 'Must include a number'
    return ''
  }

  const validateAdminSecret = (secret: string) => {
    if (secret.trim().length !== 6) return 'Admin secret must be exactly 6 characters'
    return ''
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    const trimmedValue = value.trimStart()
    setForm((prev) => ({ ...prev, [field]: trimmedValue }))

    let errorMsg = ''
    switch (field) {
      case 'name':
        errorMsg = validateName(trimmedValue)
        break
      case 'email':
        errorMsg = validateEmail(trimmedValue)
        break
      case 'password':
        errorMsg = validatePassword(trimmedValue)
        break
      case 'adminSecret':
        errorMsg = validateAdminSecret(trimmedValue)
        break
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }))
  }

  const validateAll = () => {
    const nameErr = validateName(form.name)
    const emailErr = validateEmail(form.email)
    const passwordErr = validatePassword(form.password)
    const secretErr = validateAdminSecret(form.adminSecret)

    setErrors({ name: nameErr, email: emailErr, password: passwordErr, adminSecret: secretErr })
    return !(nameErr || emailErr || passwordErr || secretErr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError('');
  if (!validateAll()) return;

  setLoading(true);
  try {
    await registerAdmin(form.name, form.email, form.password, form.adminSecret);
    router.push('/admin/login');
  } catch (err: unknown) {
  let message = 'Registration failed. Please try again.'

  if ((err as AxiosError)?.response?.data && typeof (err as AxiosError).response?.data === 'object') {
    const data = (err as AxiosError).response?.data as { message?: string }
    if (data.message) {
      message = data.message
    }
  } else if (err instanceof Error) {
    message = err.message
  }

  setSubmitError(message)
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              type="text"
              required
              className={`w-full bg-white mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              type="email"
              required
              className={`w-full bg-white mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
                className={`w-full bg-white mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Admin Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Secret</label>
            <input
              value={form.adminSecret}
              onChange={(e) => handleChange('adminSecret', e.target.value)}
              type="text"
              required
              maxLength={6}
              className={`w-full bg-white mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.adminSecret ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter admin secret"
            />
            {errors.adminSecret && <p className="text-red-600 text-sm mt-1">{errors.adminSecret}</p>}
          </div>

          {/* Submit Error */}
          {submitError && <p className="text-red-600 text-sm text-center">{submitError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Object.values(errors).some((e) => e)}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}
