'use client'

import { use, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/components/Loading'
import Notification from '@/components/Notification'
import { useNotification } from '@/hooks/useNotification'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const resolvedParams = use(params)
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { notification, showSuccess, showError, hideNotification } = useNotification()

  // B2B discount rate (10%)
  const B2B_DISCOUNT = 0.10
  const isB2B = session?.user?.role === 'B2B'
  
  const getPrice = () => {
    if (!product) return 0
    return isB2B ? product.price * (1 - B2B_DISCOUNT) : product.price
  }

  const getSavings = () => {
    if (!product || !isB2B) return 0
    return product.price * B2B_DISCOUNT
  }

  useEffect(() => {
    fetchProduct()
  }, [resolvedParams.slug])

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const products = await res.json()
        const found = products.find((p: any) => p.slug === resolvedParams.slug)
        setProduct(found)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity
        })
      })

      if (res.ok) {
        showSuccess('Added to cart!')
        setTimeout(() => router.push('/cart'), 1500)
      } else {
        showError('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      showError('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-primary-600 hover:text-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : '/products/default.jpg'} 
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/products/default.jpg'
              }}
            />
          </div>

          {/* Product Info */}
          <div>
            {isB2B && (
              <div className="mb-4 inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                🏢 Business Customer - 10% Discount Applied
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              {isB2B ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-purple-600">${getPrice().toFixed(2)}</p>
                    <p className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-green-600 mt-1">You save ${getSavings().toFixed(2)} per unit</p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-primary-600">${product.price.toFixed(2)}</p>
              )}
            </div>
            
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full text-sm ${
                product.stock > 10 ? 'bg-green-100 text-green-700' :
                product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {product.stock > 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity {isB2B && '(Bulk orders available)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {isB2B && quantity >= 10 && (
                    <p className="text-sm text-purple-600 mt-2">
                      💼 Bulk order: Total savings ${(getSavings() * quantity).toFixed(2)}
                    </p>
                  )}
                </div>

                <button
                  onClick={addToCart}
                  disabled={adding}
                  className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>

                {!session && (
                  <p className="text-sm text-gray-600 text-center">
                    Please <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700">sign in</Link> to purchase
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
    </div>
  )
}
