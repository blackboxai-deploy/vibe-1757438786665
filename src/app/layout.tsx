import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SKV Global AI Video Generator',
  description: 'Professional AI Video Creation Platform - Generate stunning videos with credit-based system',
  keywords: 'AI video generation, video creation, artificial intelligence, content creation, SKV Global',
  authors: [{ name: 'SKV Global' }],
  creator: 'SKV Global',
  publisher: 'SKV Global',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navigation Header */}
            <header className="bg-gray-800 border-b border-gray-700 py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* SKV Global Logo */}
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">SKV</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-white">SKV Global</h1>
                        <p className="text-xs text-gray-400">AI Video Generator</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="hidden md:flex items-center space-x-6">
                    <nav className="flex space-x-6">
                      <a href="#create" className="text-gray-300 hover:text-white transition-colors">
                        Create Video
                      </a>
                      <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
                        My Videos
                      </a>
                      <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                        Pricing
                      </a>
                      <a href="#billing" className="text-gray-300 hover:text-white transition-colors">
                        Billing
                      </a>
                    </nav>
                  </div>

                  {/* User Actions */}
                  <div className="flex items-center space-x-4">
                    {/* Credits Display */}
                    <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-3 py-1 rounded-full border border-purple-500/30">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-semibold text-purple-300">25 Credits</span>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">U</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 py-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SKV</span>
                      </div>
                      <span className="font-bold text-white">SKV Global</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Professional AI Video Creation Platform. Generate stunning videos with advanced AI technology.
                    </p>
                  </div>

                  {/* Product */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Product</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">AI Video Generator</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Video Templates</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Custom Models</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">Company</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                      <p>© 2024 SKV Global. All rights reserved. Professional AI Video Creation Platform.</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="text-gray-400 text-sm">Powered by Advanced AI</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">Secure Payment Processing</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}