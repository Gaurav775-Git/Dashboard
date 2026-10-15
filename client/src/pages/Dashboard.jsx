import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#131A26] flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F2F4F7] mb-2">
            Dashboard
          </h1>
          <p className="text-[#8C95A6] text-sm md:text-base">
            Welcome back. Here's what's happening.
          </p>
        </div>

        {/* Content Area — drop your components in here */}
        <div className="w-full">
          {/* Your dashboard content goes here */}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard