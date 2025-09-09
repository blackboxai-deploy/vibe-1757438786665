export interface User {
  id: string
  email: string
  name: string
  credits: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface CreditTransaction {
  id: string
  userId: string
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  amount: number
  description: string
  stripePaymentId?: string
  createdAt: string
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  originalPrice?: number
  discount?: number
  description: string
  popular?: boolean
}

export interface Video {
  id: string
  userId: string
  prompt: string
  videoUrl?: string
  thumbnailUrl?: string
  status: 'generating' | 'completed' | 'failed'
  creditsUsed: number
  duration?: number
  createdAt: string
  updatedAt: string
}

export interface PaymentSession {
  id: string
  userId: string
  packageId: string
  stripeSessionId: string
  status: 'pending' | 'completed' | 'failed'
  amount: number
  credits: number
  createdAt: string
}