'use client'

import { fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { clearSigninState, signinThunk } from '@/redux/auth/signinSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import FormButton from '@/utils/FormButton'
import FormInput from '@/utils/FormInput'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

function SignIn() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { message, error, loading } = useAppSelector(state => state.signin)

    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [checked, setChecked] = useState<boolean>(false)
    const [clientError, setClientError] = useState<string | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (clientError) setClientError(null)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!form.email || !form.password) {
            setClientError('Please enter both email and password.')
            return
        }

        dispatch(signinThunk({
            email: form.email,
            password: form.password,
        }))
    }

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined

        if (message) {
            dispatch(fetchProfileThunk())

            setForm({
                email: '',
                password: '',
            })
            timer = setTimeout(() => {
                dispatch(clearSigninState())
                router.push('/')
            }, 500)
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [message, router, dispatch])

    useEffect(() => {
        return () => {
            dispatch(clearSigninState())
        }
    }, [dispatch])

    return (
        <div className='fixed inset-0 w-full h-full bg-slate-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 z-50'>
            <Link href='/'>
                <span className='w-9 h-9 sm:w-10 sm:h-10 border border-gray-200 rounded-full bg-white shadow-sm flex items-center justify-center fixed top-4 right-4 cursor-pointer hover:bg-gray-100 transition-colors z-10'>
                    <X size={18} className='text-gray-600' />
                </span>
            </Link>

            <div className="w-full max-w-md my-auto flex flex-col p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600">Doctris</span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">Login</h2>
                </div>

                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <FormInput
                            onChange={handleChange}
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            label="Email"
                            value={form.email}
                            required
                        />
                        <FormInput
                            onChange={handleChange}
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            label="Password"
                            value={form.password}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                onChange={(e) => setChecked(e.target.checked)}
                                checked={checked}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {(clientError || error) && (
                        <p className='text-xs sm:text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded-md border border-red-200'>
                            {clientError || error}
                        </p>
                    )}
                    {message && (
                        <p className='text-xs sm:text-sm font-medium text-green-600 bg-green-50 p-2.5 rounded-md border border-green-200'>
                            {message}
                        </p>
                    )}

                    <FormButton btnName="Login" loading={loading} />

                    <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
                        Don’t have an account?{' '}
                        <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignIn