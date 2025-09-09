'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoGenerator from './VideoGenerator'
import VideoGallery from './VideoGallery'
import CreditPurchase from './CreditPurchase'
import BillingHistory from './BillingHistory'
import { Video } from '@/types/auth'

interface DashboardProps {
  user: {
    id: string
    email: string
    name: string
    credits: number
    createdAt: string
    updatedAt: string
  }
}

export default function Dashboard({ user }: DashboardProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const { logout, refreshUser } = useAuth()

  useEffect(() => {
    loadUserVideos()
  }, [])

  const loadUserVideos = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userVideos = await response.json()
        setVideos(userVideos)
      }
    } catch (error) {
      console.error('Failed to load videos:', error)
    }
  }

  const addVideo = (video: Video) => {
    setVideos(prev => [video, ...prev])
    refreshUser() // Refresh user credits
  }

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ))
  }

  const completedVideos = videos.filter(v => v.status === 'completed').length
  const generatingVideos = videos.filter(v => v.status === 'generating').length
  const totalCreditsUsed = videos.reduce((sum, v) => sum + v.creditsUsed, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-300">
              Ready to create amazing AI videos? You have <span className="font-semibold text-purple-300">{user.credits} credits</span> available.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-300">{user.credits}</div>
              <div className="text-sm text-gray-400">Credits Available</div>
            </div>
            <Button 
              onClick={() => setActiveTab('billing')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Buy More Credits
            </Button>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="generate" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Generate Video
          </TabsTrigger>
          <TabsTrigger 
            value="gallery" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            My Videos
          </TabsTrigger>
          <TabsTrigger 
            value="billing" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Credits & Billing
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Account
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Available Credits</CardTitle>
                <div className="text-3xl font-bold text-purple-400">{user.credits}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Ready for video generation</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Videos Created</CardTitle>
                <div className="text-3xl font-bold text-green-400">{completedVideos}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Successfully generated</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">In Progress</CardTitle>
                <div className="text-3xl font-bold text-yellow-400">{generatingVideos}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Currently generating</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Credits Used</CardTitle>
                <div className="text-3xl font-bold text-blue-400">{totalCreditsUsed}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Total consumed</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Videos</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest video generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length > 0 ? (
                <div className="space-y-4">
                  {videos.slice(0, 3).map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="space-y-1">
                        <p className="text-white font-medium line-clamp-1">
                          {video.prompt.substring(0, 60)}...
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(video.createdAt).toLocaleDateString()} • {video.creditsUsed} credits
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        video.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        video.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {video.status}
                      </div>
                    </div>
                  ))}
                  <Button 
                    onClick={() => setActiveTab('gallery')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    View All Videos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">No videos created yet</div>
                  <Button 
                    onClick={() => setActiveTab('generate')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Your First Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Generation Tab */}
        <TabsContent value="generate">
          <VideoGenerator 
            user={user}
            onVideoAdd={addVideo} 
            onVideoUpdate={updateVideo} 
          />
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <VideoGallery videos={videos} onVideoUpdate={updateVideo} />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreditPurchase user={user} />
            <BillingHistory user={user} />
          </div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your SKV Global account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <p className="text-white">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Member Since</label>
                      <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Update Profile
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Change Password
                    </Button>
                    <Button 
                      onClick={logout}
                      variant="outline"
                      className="w-full border-red-600 text-red-400 hover:text-white hover:bg-red-600"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}