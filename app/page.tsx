"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  useEffect(() => {
    // Redirect after a brief delay to show loading animation
    const timer = setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image 
            src="/placeholder-logo.svg" 
            alt="Snigmay Pune FC Logo" 
            width={100} 
            height={100} 
            className="rounded-full bg-white p-2 shadow-md"
          />
        </div>
        <h1 className="text-3xl font-bold text-[#0e4c92] mb-2">Snigmay Pune FC</h1>
        <p className="text-gray-600 mb-8">Football Academy Management System</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e4c92]"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
