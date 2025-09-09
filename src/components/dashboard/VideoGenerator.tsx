'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Video } from '@/types/auth'

interface VideoGeneratorProps {
  user: {
    id: string
    credits: number
  }
  onVideoAdd: (video: Video) => void
  onVideoUpdate: (id: string, updates: Partial<Video>) => void
}

const videoDurations = [
  { label: 'Short (30s)', value: '30', credits: 1 },
  { label: 'Standard (60s)', value: '60', credits: 2 },
  { label: 'Extended (120s)', value: '120', credits: 4 },
]

export default function VideoGenerator({ user, onVideoAdd, onVideoUpdate }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState('30')
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedDuration = videoDurations.find(d => d.value === duration)
  const creditsRequired = selectedDuration?.credits || 1

  const canGenerate = user.credits >= creditsRequired && prompt.length >= 10

  const generateVideo = async () => {
    if (!canGenerate) {
      if (user.credits < creditsRequired) {
        toast.error('Insufficient credits. Please purchase more credits.')
        return
      }
      toast.error('Please provide a more detailed description (at least 10 characters)')
      return
    }

    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setIsGenerating(true)

    // Create initial video entry
    const newVideo: Video = {
      id: videoId,
      userId: user.id,
      prompt: prompt.trim(),
      status: 'generating',
      creditsUsed: creditsRequired,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onVideoAdd(newVideo)
    toast.success(`Video generation started! Using ${creditsRequired} credits.`)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          duration: parseInt(duration),
          creditsToUse: creditsRequired
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Video generation failed')
      }

      if (data.success && data.videoUrl) {
        onVideoUpdate(videoId, {
          videoUrl: data.videoUrl,
          status: 'completed',
          duration: data.duration
        })
        toast.success('Video generated successfully!')
        setPrompt('')
      } else {
        throw new Error(data.error || 'No video URL received')
      }

    } catch (error) {
      console.error('Video generation error:', error)
      onVideoUpdate(videoId, {
        status: 'failed'
      })
      toast.error(error instanceof Error ? error.message : 'Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create AI Video</CardTitle>
          <CardDescription className="text-gray-400">
            Generate professional videos using advanced AI models. Credits will be deducted based on video duration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Duration Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Video Duration</Label>
            <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {videoDurations.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <span className="ml-4 text-purple-400">{option.credits} credits</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-gray-300">
              Video Description
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe your video in detail... For example: 'A cinematic shot of a sunrise over mountains, with golden light reflecting off a pristine lake. Camera slowly pans across the landscape as morning mist rolls over the water.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.substring(0, 500))}
              className="min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 resize-none"
              disabled={isGenerating}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {prompt.length < 10 ? 'Minimum 10 characters required' : 'Good description length'}
              </span>
              <span className={`${prompt.length > 450 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {prompt.length}/500
              </span>
            </div>
          </div>

          {/* Credit Cost Display */}
          <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-purple-300 font-semibold">Generation Cost</p>
                <p className="text-gray-400 text-sm">
                  {selectedDuration?.label} video will use {creditsRequired} credits
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{creditsRequired}</div>
                <div className="text-xs text-gray-400">Credits</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-purple-700/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Your Credits:</span>
                <span className="text-white font-semibold">{user.credits}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">After Generation:</span>
                <span className={`font-semibold ${user.credits - creditsRequired >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {user.credits - creditsRequired}
                </span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col space-y-4">
            <Button
              onClick={generateVideo}
              disabled={isGenerating || !canGenerate}
              className={`w-full font-semibold py-4 text-lg ${
                canGenerate 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              } text-white`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Video... ({creditsRequired} credits)
                </>
              ) : !canGenerate && user.credits < creditsRequired ? (
                `Insufficient Credits (Need ${creditsRequired})`
              ) : !canGenerate && prompt.length < 10 ? (
                'Enter Video Description'
              ) : (
                `Generate Video (${creditsRequired} credits)`
              )}
            </Button>
            
            {!canGenerate && user.credits < creditsRequired && (
              <Button
                onClick={() => {/* Navigate to billing */}}
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                Buy More Credits
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips for Better Results */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Pro Tips for Better Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Include specific details about lighting, mood, and atmosphere</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Describe camera movements (pan, zoom, tracking shots)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Specify time of day and weather conditions</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Mention colors, textures, and visual style preferences</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Be specific about subjects and their actions</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400">Longer videos require more credits but offer better storytelling</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}