// Mock database for demo purposes
// In production, replace with proper database (Prisma, MongoDB, etc.)

export interface User {
  id: string
  email: string
  name: string
  password: string
  credits: number
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  amount: number
  description: string
  stripePaymentId?: string
  createdAt: string
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

// In-memory storage (for demo only)
export const users: User[] = []
export const transactions: Transaction[] = []
export const videos: Video[] = []

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email)
}

export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id)
}

export function addUser(user: User): void {
  users.push(user)
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return null
  
  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
  return users[userIndex]
}

export function addTransaction(transaction: Transaction): void {
  transactions.push(transaction)
}

export function getUserTransactions(userId: string): Transaction[] {
  return transactions
    .filter(transaction => transaction.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addVideo(video: Video): void {
  videos.push(video)
}

export function updateVideo(id: string, updates: Partial<Video>): Video | null {
  const videoIndex = videos.findIndex(video => video.id === id)
  if (videoIndex === -1) return null
  
  videos[videoIndex] = { ...videos[videoIndex], ...updates, updatedAt: new Date().toISOString() }
  return videos[videoIndex]
}

export function getUserVideos(userId: string): Video[] {
  return videos
    .filter(video => video.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}