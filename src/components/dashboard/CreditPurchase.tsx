'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CreditPackage } from '@/types/auth'

interface CreditPurchaseProps {
  user: {
    id: string
    credits: number
  }
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 9.99,
    description: 'Perfect for testing and small projects',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    description: 'Great for content creators',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    credits: 100,
    price: 69.99,
    originalPrice: 99.99,
    discount: 30,
    description: 'Ideal for businesses',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 500,
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    description: 'For large scale operations',
  },
]

export default function CreditPurchase({ user }: CreditPurchaseProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const handlePurchase = async (packageData: CreditPackage) => {
    setIsProcessing(true)
    setSelectedPackage(packageData.id)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: packageData.id,
          credits: packageData.credits,
          amount: packageData.price
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session')
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (error) {
      console.error('Purchase error:', error)
      toast.error(error instanceof Error ? error.message : 'Purchase failed')
    } finally {
      setIsProcessing(false)
      setSelectedPackage(null)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Purchase Credits</CardTitle>
        <CardDescription className="text-gray-400">
          Choose a credit package to continue generating videos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Credits */}
        <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 font-semibold">Current Balance</p>
              <p className="text-gray-400 text-sm">Available for video generation</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{user.credits}</div>
              <div className="text-xs text-gray-400">Credits</div>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="space-y-3">
          {creditPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative border rounded-lg p-4 transition-all cursor-pointer ${
                pkg.popular 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : 'border-gray-600 bg-gray-900 hover:border-purple-500/50'
              }`}
              onClick={() => !isProcessing && handlePurchase(pkg)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-4 bg-purple-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{pkg.name}</h3>
                    {pkg.discount && (
                      <span className="text-green-400 text-sm font-semibold">
                        -{pkg.discount}%
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{pkg.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400 font-semibold">{pkg.credits} Credits</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">${(pkg.price / pkg.credits).toFixed(2)} per credit</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-white">${pkg.price}</div>
                    {pkg.originalPrice && (
                      <div className="text-lg text-gray-500 line-through">${pkg.originalPrice}</div>
                    )}
                  </div>
                  
                  {isProcessing && selectedPackage === pkg.id ? (
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className={`mt-2 ${
                        pkg.popular
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      Purchase
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Security */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-semibold text-sm">Secure Payment</span>
            </div>
            <p className="text-gray-400 text-xs">
              Powered by Stripe • PCI DSS Compliant • SSL Encrypted
            </p>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 1 Credit = 30 second video</p>
          <p>• 2 Credits = 60 second video</p>
          <p>• 4 Credits = 120 second video</p>
          <p>• Credits never expire</p>
        </div>
      </CardContent>
    </Card>
  )
}