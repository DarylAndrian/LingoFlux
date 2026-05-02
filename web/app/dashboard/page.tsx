'use client'

import { useState, useEffect } from 'react'
import LanguageBadge from '@/components/LanguageBadge'
import WordCard from '@/components/WordCard'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [dailyWords, setDailyWords] = useState<any[]>([])
  const [savedWords, setSavedWords] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeLanguage, setActiveLanguage] = useState('zh-CN')

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      window.location.href = '/login'
      return
    }

    setUser(JSON.parse(userData))

    // Fetch daily words
    fetchDailyWords()
    // Fetch saved words
    fetchSavedWords()
  }, [])

  const fetchDailyWords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3001/api/v1/words/daily?language=${activeLanguage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setDailyWords(data.words || [])
      }
    } catch (err) {
      console.error('Failed to fetch daily words:', err)
    }
  }

  const fetchSavedWords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/words/saved', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSavedWords(data.words || [])
        setStreak(data.streak || 0)
      }
    } catch (err) {
      console.error('Failed to fetch saved words:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWord = async (wordId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/v1/words/save', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word_id: wordId }),
      })

      if (response.ok) {
        fetchSavedWords()
      }
    } catch (err) {
      console.error('Failed to save word:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">🌐 LingoFlux</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">🔥 {streak} day streak</span>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            You have {dailyWords.length} new words to learn today.
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Languages</h3>
          <div className="flex space-x-3">
            {[
              { code: 'zh-CN', name: '🇨🇳 Chinese', level: 'HSK 3' },
              { code: 'ja', name: '🇯🇵 Japanese', level: 'JLPT N4' },
              { code: 'ko', name: '🇰🇷 Korean', level: 'TOPIK 2' },
              { code: 'zh-TW', name: '🇹🇼 Taiwanese', level: 'TOCFL 3' },
            ].map((lang) => (
              <LanguageBadge
                key={lang.code}
                language={lang.name}
                level={lang.level}
                active={activeLanguage === lang.code}
                onClick={() => setActiveLanguage(lang.code)}
              />
            ))}
          </div>
        </div>

        {/* Daily Words Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Today's Words ({activeLanguage})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyWords.length > 0 ? (
              dailyWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  onSave={() => handleSaveWord(word.id)}
                />
              ))
            ) : (
              <div className="col-span-full p-8 bg-white rounded-xl border border-gray-200 text-center">
                <p className="text-gray-600">
                  No new words today. Come back tomorrow! 🎯
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Words Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Saved Words</h3>
            <span className="text-sm text-gray-600">{savedWords.length} saved</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWords.slice(0, 3).map((item) => (
              <WordCard
                key={item.id}
                word={item.word}
                saved={true}
              />
            ))}
          </div>
          {savedWords.length > 3 && (
            <button className="mt-4 text-blue-600 hover:underline">
              View all {savedWords.length} saved words →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
