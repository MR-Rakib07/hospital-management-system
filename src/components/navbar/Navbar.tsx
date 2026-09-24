'use client'

import { logoutThunk } from '@/redux/auth/logoutSlice'
import { clearProfile, fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { clearSigninState } from '@/redux/auth/signinSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Container from '@/utils/Container'
import { Heart, LogOut, Menu, Settings, ShoppingCart, User as UserIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import ProfileNav from '../Profile/ProfileNav'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Shop', href: '/shop' },
  { name: 'Appointment', href: '/appointment' },
  { name: 'About us', href: '/about' },
]

function Navbar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.profile)

  const [mobile, setMobile] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setToken(storedToken)

    if (storedToken) {
      dispatch(fetchProfileThunk())
        .unwrap()
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
          dispatch(clearProfile())
          dispatch(clearSigninState())
        })
    } else {
      setToken(null)
      if (user) {
        dispatch(clearProfile())
        dispatch(clearSigninState())
      }
    }
  }, [dispatch, pathname, user])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobile(false)
    setProfileDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobile])

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    dispatch(clearProfile())
    dispatch(clearSigninState())
    setToken(null)
    setMobile(false)
    setProfileDropdownOpen(false)
    router.push('/signin')
  }

  const isLoggedIn = mounted && Boolean(token && user)

  return (
    <>
      <nav
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="relative z-10 flex items-center">
              <Image
                src="/logo-dark.png"
                width={100}
                height={28}
                alt="Doctris Logo"
                priority
                className="h-6 sm:h-7 w-auto max-w-[110px] object-contain"
              />
            </Link>

            <ul className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-700">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative py-1 transition-colors hover:text-blue-600 ${
                        isActive ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                type="button"
                aria-label="Wishlist"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors border border-gray-100 cursor-pointer"
              >
                <Heart size={18} />
              </button>

              <button
                type="button"
                aria-label="Cart"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors border border-gray-100 cursor-pointer"
              >
                <ShoppingCart size={18} />
              </button>

              {isLoggedIn ? (
                <div ref={profileRef} className="relative group">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    aria-label="User Profile"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-600 focus:border-blue-600 transition-all flex items-center justify-center bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src="/profile.jpg"
                      width={40}
                      height={40}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div
                    className={`transition-all duration-200 absolute top-full right-0 pt-1 z-50 ${
                      profileDropdownOpen
                        ? 'visible opacity-100'
                        : 'invisible opacity-0 lg:group-hover:visible lg:group-hover:opacity-100'
                    }`}
                  >
                    <ProfileNav />
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <UserIcon size={16} />
                  <span>Sign In</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMobile(true)}
                aria-label="Open Menu"
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 lg:hidden ${
          mobile ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <div
          onClick={() => setMobile(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobile ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`relative w-[290px] sm:w-[320px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out overflow-y-auto ${
            mobile ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <Image
                src="/logo-dark.png"
                width={110}
                height={32}
                alt="Doctris Logo"
                className="w-auto h-7 object-contain"
              />
              <button
                onClick={() => setMobile(false)}
                aria-label="Close Menu"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {isLoggedIn && (
              <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100">
                  <Image
                    src="/profile.jpg"
                    width={44}
                    height={44}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate capitalize">
                    {user?.fullname || 'User'}
                  </h4>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {user?.role || 'PATIENT'}
                  </span>
                </div>
              </div>
            )}

            <ul className="flex flex-col py-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-6 py-3.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="p-5 border-t border-gray-100 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
                >
                  <Settings size={16} />
                  <span>Profile Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center justify-center w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar