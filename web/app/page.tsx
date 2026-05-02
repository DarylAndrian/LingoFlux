'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🌐 LingoFlux</h1>
          <div className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
            <a href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              ✨ Now supporting 7 languages with native leveling systems
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Languages in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {` Your Context`}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get 10 daily words tailored to your level. Scan real-world text with AI translation.
            Track progress across multiple languages simultaneously.
          </p>
          
          {/* Quick Signup Form */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Create password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Get Started Free →
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Ready in 30 seconds • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why LingoFlux?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="text-xl font-bold mb-3">10 Daily Words</h4>
              <p className="text-gray-600">
                Get 10 vocabulary words tailored to your exact level (HSK, JLPT, TOPIK, TOCFL, NLTV, CU-TFL, CEFR).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="text-xl font-bold mb-3">AI Translation</h4>
              <p className="text-gray-600">
                Scan text with your camera. Get contextual explanations with grammar notes and cultural insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="text-xl font-bold mb-3">7 Languages</h4>
              <p className="text-gray-600">
                Chinese (HSK/TOCFL), Japanese (JLPT), Korean (TOPIK), Vietnamese, Thai, German. Multi-language support built-in.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Smart Notifications</h4>
              <p className="text-gray-600">
                Words arrive at random times throughout the day. Perfect bite-sized learning moments.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Save in Context</h4>
              <p className="text-gray-600">
                Save words with real-world context snippets. Never forget why you learned a word.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Telegram Bot</h4>
              <p className="text-gray-600">
                Get daily words in Telegram. Learn even when you don't open the app. Passive learning on the go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Learning?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of language learners who are making real progress.
          </p>
          <a href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg">
            Start Your Free Account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2026 LingoFlux. All rights reserved.</p>
          <p className="text-sm mt-2">Learn languages smarter.</p>
        </div>
      </footer>
    </main>
  )
}
