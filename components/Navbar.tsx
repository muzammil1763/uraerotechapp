'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/logo.jpeg" 
                alt="UR Aerotech Logo" 
                className="h-12 w-auto"
              />
              <div className="text-primary-500 font-bold text-xl">UR AEROTECH</div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-500 transition">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary-500 transition">
              Services
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-500 transition">
              Products
            </Link>
            <Link href="/quote" className="text-gray-700 hover:text-primary-500 transition">
              Get Quote
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-500 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-500 transition">
              Contact
            </Link>
            
            {session ? (
              <>
                {session.user.role !== 'ADMIN' && (
                  <Link href="/cart" className="text-gray-700 hover:text-primary-500 transition flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                  </Link>
                )}
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
                  className="text-gray-700 hover:text-primary-500 transition">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} 
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" 
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              Home
            </Link>
            <Link href="/services" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              Services
            </Link>
            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              Products
            </Link>
            <Link href="/quote" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              Get Quote
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
              Contact
            </Link>
            {session ? (
              <>
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} 
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
