'use client'
import { clearSignupState, signupThunk } from '@/redux/auth/signupSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import FormButton from '@/utils/FormButton'
// import FormCheckBox from '@/utils/FormCheckBox'
import FormInput from '@/utils/FormInput'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

function SignUp() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { message, error, loading } = useAppSelector(state => state.signup)

    const [form, setForm] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: ''
    })
    // const [termsAccepted, setTermsAccepted] = useState(false)
    const [clientError, setClientError] = useState<string | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (clientError) setClientError(null)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // if (!termsAccepted) {
        //     setClientError('Please accept the Terms and Conditions')
        //     return
        // }

        dispatch(signupThunk(form))
    }

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined

        if (message) {
            setForm({
                fullname: '',
                email: '',
                phone: '',
                password: ''
            })
            timer = setTimeout(() => {
                dispatch(clearSignupState())
                router.push('/signin')
            }, 1000)
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [message, router, dispatch])

    useEffect(() => {
        return () => {
            dispatch(clearSignupState())
        }
    }, [dispatch])

    return (
        <div className='fixed inset-0 w-full h-full bg-slate-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 z-50'>
            <Link href='/'>
                <span className='w-9 h-9 sm:w-10 sm:h-10 border border-gray-200 rounded-full bg-white shadow-sm flex items-center justify-center fixed top-4 right-4 cursor-pointer hover:bg-gray-100 transition-colors z-10'>
                    <X size={18} className='text-gray-600' />
                </span>
            </Link>

            <div className="w-full max-w-lg my-auto flex flex-col p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600">Doctris</span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">Sign Up</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="flex flex-col gap-4">
                        <FormInput
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            name="fullname"
                            value={form.fullname}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Phone Number"
                            type="tel"
                            placeholder="Enter your phone number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* <div className="pt-1">
                        <FormCheckBox
                            label="Terms And Condition"
                            name="term"
                            checked={termsAccepted}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setTermsAccepted(e.target.checked)
                                if (clientError) setClientError(null)
                            }}
                        />
                    </div> */}

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

                    <FormButton btnName="Register" loading={loading} />
                </form>

                <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-blue-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp