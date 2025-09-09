'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditTransaction } from '@/types/auth'

interface BillingHistoryProps {
  user: {
    id: string
  }
}

export default function BillingHistory({}: BillingHistoryProps) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/billing/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '💳'
      case 'usage': return '🎬'
      case 'refund': return '↩️'
      case 'bonus': return '🎁'
      default: return '📝'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-400'
      case 'usage': return 'text-blue-400'
      case 'refund': return 'text-yellow-400'
      case 'bonus': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Billing History</CardTitle>
        <CardDescription className="text-gray-400">
          View your credit purchases and usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-700 rounded"></div>
                      <div className="w-20 h-3 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${getTransactionColor(transaction.type)} border-current`}
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'purchase' || transaction.type === 'bonus' || transaction.type === 'refund'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {transaction.type === 'purchase' || transaction.type === 'bonus' || transaction.type === 'refund' ? '+' : '-'}
                    {Math.abs(transaction.amount)}
                  </div>
                  <div className="text-gray-400 text-xs">credits</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">No transactions yet</div>
            <p className="text-gray-500 text-sm">
              Your credit purchases and usage will appear here
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">
                {transactions.filter(t => t.type === 'purchase' || t.type === 'bonus').reduce((sum, t) => sum + t.amount, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Purchased</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {transactions.filter(t => t.type === 'usage').reduce((sum, t) => sum + Math.abs(t.amount), 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Used</div>
            </div>
          </div>
        </div>

        {/* Download Invoice Button */}
        {transactions.some(t => t.stripePaymentId) && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Download Invoice History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}