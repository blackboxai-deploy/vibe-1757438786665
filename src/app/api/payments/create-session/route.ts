import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import { findUserById, updateUser, addTransaction } from '@/lib/data-store'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2025-08-27.basil'
})

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    
    // Find user
    const user = findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { packageId, credits, amount } = await request.json()

    if (!packageId || !credits || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SKV Global Credits - ${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package`,
              description: `${credits} credits for AI video generation`,
              images: ['https://placehold.co/400x400?text=SKV+Global+Credits+Package+Logo'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        packageId: packageId,
        credits: credits.toString(),
        userEmail: user.email
      }
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Payment session creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle Stripe webhook to complete payment
export async function PATCH(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
      const userId = session.metadata?.userId
      const credits = parseInt(session.metadata?.credits || '0')
      
       if (userId && credits) {
        // Find user and add credits
        const user = findUserById(userId)
        if (user) {
          updateUser(user.id, { credits: user.credits + credits })
          
          // Add purchase transaction
          addTransaction({
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            type: 'purchase',
            amount: credits,
            description: `Credit purchase - ${session.metadata?.packageId} package`,
            createdAt: new Date().toISOString()
          })
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully'
      })
    }
    
    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}