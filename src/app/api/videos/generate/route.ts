import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { findUserById, updateUser, addTransaction } from '@/lib/data-store'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    // Find user
    const user = findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { prompt, duration, creditsToUse } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      )
    }

    // Check if user has enough credits
    if (user.credits < creditsToUse) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Deduct credits immediately
    updateUser(user.id, { credits: user.credits - creditsToUse })

    // Add usage transaction
    addTransaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: 'usage',
      amount: -creditsToUse,
      description: `Video generation: ${prompt.substring(0, 50)}...`,
      createdAt: new Date().toISOString()
    })

    // System prompt for video generation
    const systemPrompt = `Generate high-quality, cinematic videos based on user descriptions. Focus on visual storytelling, smooth transitions, and professional production quality. Duration: ${duration} seconds.`
    
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`

    // Call the video generation API using custom endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_T0raOD4NwV9Rnt',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('AI API Error:', response.status, errorData)
      
      // Refund credits on API failure
      updateUser(user.id, { credits: user.credits + creditsToUse })
      addTransaction({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        type: 'refund',
        amount: creditsToUse,
        description: `Refund for failed generation: ${prompt.substring(0, 50)}...`,
        createdAt: new Date().toISOString()
      })
      
      return NextResponse.json(
        { 
          error: 'Video generation service unavailable',
          details: errorData.error || 'AI service error'
        },
        { status: 503 }
      )
    }

    const data = await response.json()
    
    // Extract video URL from the response
    let videoUrl = null
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content
      
      // Try to extract URL from content
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+\.(mp4|mov|avi)/i
      const match = content.match(urlRegex)
      
      if (match) {
        videoUrl = match[0]
      } else if (content.includes('http')) {
        videoUrl = content.trim()
      }
    }
    
    if (!videoUrl) {
      console.error('No video URL found in response:', data)
      
      // Refund credits if no video URL
      updateUser(user.id, { credits: user.credits + creditsToUse })
      addTransaction({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        type: 'refund',
        amount: creditsToUse,
        description: `Refund for incomplete generation: ${prompt.substring(0, 50)}...`,
        createdAt: new Date().toISOString()
      })
      
      return NextResponse.json(
        { 
          error: 'Video generation incomplete',
          details: 'No video URL received from AI service'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      prompt: prompt,
      duration: duration,
      creditsUsed: creditsToUse,
      remainingCredits: findUserById(user.id)?.credits || 0,
      timestamp: Date.now(),
      model: 'replicate/google/veo-3'
    })

  } catch (error) {
    console.error('Error in video generation:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}