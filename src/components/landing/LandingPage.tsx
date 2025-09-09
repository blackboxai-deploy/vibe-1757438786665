'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LandingPageProps {
  onGetStarted: () => void
}

const creditPackages = [
  {
    name: 'Starter',
    credits: 10,
    price: 9.99,
    description: 'Perfect for testing and small projects',
    features: ['10 AI video generations', 'Standard quality', 'Email support', '30-day history']
  },
  {
    name: 'Pro',
    credits: 50,
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    description: 'Great for content creators',
    features: ['50 AI video generations', 'HD quality', 'Priority support', '90-day history'],
    popular: true
  },
  {
    name: 'Business',
    credits: 100,
    price: 69.99,
    originalPrice: 99.99,
    discount: 30,
    description: 'Ideal for businesses',
    features: ['100 AI video generations', '4K quality', '24/7 support', 'Unlimited history']
  },
  {
    name: 'Enterprise',
    credits: 500,
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    description: 'For large scale operations',
    features: ['500 AI video generations', '4K+ quality', 'Dedicated support', 'Custom integrations']
  }
]

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* SKV Global Badge */}
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SKV</span>
              </div>
              <span className="text-purple-300 font-semibold">SKV Global AI Video Generator</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Create Stunning
                <br />
                AI Videos
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Professional AI-powered video generation platform. Transform your ideas into cinematic videos 
                with our advanced credit-based system.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Start Creating Videos
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-4 text-lg"
              >
                View Pricing
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure Payment Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Advanced AI Models</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Professional Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SKV Global?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-leading AI video generation with professional features and enterprise-grade reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Generation',
                description: 'Advanced AI models create stunning, professional-quality videos from your text descriptions.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Credit-Based System',
                description: 'Flexible pricing with credit packages. Pay only for what you use with transparent pricing.',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                title: 'Professional Quality',
                description: 'Enterprise-grade video generation with 4K support and cinematic quality output.',
                gradient: 'from-green-500 to-blue-500'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Credit Package
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Flexible pricing designed for creators, businesses, and enterprises. Start with any package and upgrade anytime.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {creditPackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-200 ${
                  pkg.popular ? 'border-purple-500 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-xl">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-white">${pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${pkg.originalPrice}</span>
                      )}
                    </div>
                    {pkg.discount && (
                      <div className="text-green-400 text-sm font-semibold">
                        Save {pkg.discount}%
                      </div>
                    )}
                    <div className="text-purple-400 font-semibold">
                      {pkg.credits} Credits
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={onGetStarted}
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white font-semibold`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Creating professional AI videos is simple with our streamlined 4-step process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and choose a credit package' },
              { step: '2', title: 'Describe', desc: 'Enter detailed description of your desired video' },
              { step: '3', title: 'Generate', desc: 'Our AI creates your professional video (5-15 minutes)' },
              { step: '4', title: 'Download', desc: 'Download your high-quality video and share' }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Create Amazing Videos?
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of creators using SKV Global's AI video generation platform.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-bold"
            >
              Start Your Journey Today
            </Button>
            <p className="text-sm text-gray-500">
              No long-term commitments • Secure payments • Instant access
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}