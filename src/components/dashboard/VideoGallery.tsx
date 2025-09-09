'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video } from '@/types/auth'
import { toast } from 'sonner'

interface VideoGalleryProps {
  videos: Video[]
  onVideoUpdate: (id: string, updates: Partial<Video>) => void
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'generating' | 'failed'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true
    return video.status === filter
  })

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  const downloadVideo = async (video: Video) => {
    if (!video.videoUrl || video.status !== 'completed') {
      toast.error('Video not ready for download')
      return
    }

    try {
      const response = await fetch(video.videoUrl)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `skv-global-video-${video.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Video downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download video')
    }
  }

  const completedCount = videos.filter(v => v.status === 'completed').length
  const generatingCount = videos.filter(v => v.status === 'generating').length
  const failedCount = videos.filter(v => v.status === 'failed').length

  if (videos.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
              <div className="w-8 h-6 bg-gray-600 rounded"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">No Videos Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Start creating amazing AI videos with SKV Global. Your generated videos will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-white">My Video Gallery</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage all your AI-generated videos
              </CardDescription>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{completedCount}</div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{generatingCount}</div>
                <div className="text-gray-400 text-sm">Generating</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{failedCount}</div>
                <div className="text-gray-400 text-sm">Failed</div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all' as const, label: 'All Videos', count: videos.length },
                { key: 'completed' as const, label: 'Completed', count: completedCount },
                { key: 'generating' as const, label: 'Generating', count: generatingCount },
                { key: 'failed' as const, label: 'Failed', count: failedCount },
              ].map(({ key, label, count }) => (
                <Button
                  key={key}
                  onClick={() => setFilter(key)}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  className={`${
                    filter === key 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {label} ({count})
                </Button>
              ))}
            </div>
            
            <Button
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {sortBy === 'newest' ? '↓ Newest First' : '↑ Oldest First'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      {sortedVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <Card key={video.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                {video.status === 'completed' && video.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    poster="https://placehold.co/640x360?text=SKV+Global+AI+Video"
                    controls
                    preload="metadata"
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {video.status === 'generating' ? (
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <div className="text-sm text-gray-400">Generating...</div>
                      </div>
                    ) : video.status === 'failed' ? (
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-xl">
                          ✗
                        </div>
                        <div className="text-sm text-red-400">Generation Failed</div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="text-gray-500 text-sm">Processing...</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge 
                    className={`${
                      video.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      video.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {video.status}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {video.prompt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <span>{video.creditsUsed} credits</span>
                    {video.duration && <span>• {Math.round(video.duration)}s</span>}
                  </div>
                </div>
                
                {video.status === 'completed' && video.videoUrl && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadVideo(video)}
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Preview
                    </Button>
                  </div>
                )}
                
                {video.status === 'generating' && (
                  <div className="text-center py-2 text-sm text-yellow-400">
                    Processing... Estimated: 5-15 minutes
                  </div>
                )}
                
                {video.status === 'failed' && (
                  <div className="text-center py-2 text-sm text-red-400">
                    Generation failed. Credits have been refunded.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-8">
            <div className="text-center text-gray-400">
              <p>No videos match the current filter.</p>
              <Button
                onClick={() => setFilter('all')}
                variant="link"
                className="text-purple-400 hover:text-purple-300 mt-2"
              >
                Show all videos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}