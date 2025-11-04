'use client'

import { useEffect, useState } from 'react'

interface HeroContent {
  onLoad?: () => void
}

export default function Hero({ onLoad }: HeroContent) {
  const [heroTitle, setHeroTitle] = useState('Empowering the Future of Energy')
  const [heroParagraph, setHeroParagraph] = useState(
    "Welcome to the IEEE Power & Energy Society (PES)  of the University of Ruhuna! Since 2012, we have been a vibrant community of students passionate about power, energy, and sustainable innovation. Our mission is to empower future engineers by fostering collaboration, creativity, and knowledge sharing in the energy sector. Whether you’re looking to expand your expertise, connect with industry leaders, or contribute to building a sustainable future, you’ll find your place with us."
    )

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const res = await fetch('/api/HomePageContent')
        const data = await res.json()
        if (data.Hero_Title) setHeroTitle(data.Hero_Title)
        if (data.Hero_Paragraph) setHeroParagraph(data.Hero_Paragraph)
        onLoad?.()
      } catch (error) {
        console.error('Failed to load hero content:', error)
        onLoad?.()
      }
    }

    fetchHeroContent()
  }, [onLoad]) // ✅ include onLoad in dependencies

  return (
    <section
      id="welcome"
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-10 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 flex flex-col md:flex-row items-center justify-between text-white"
    >
      {/* Intro Content */}
      <div className="md:w-4/5 text-center md:text-left space-y-6 md:pl-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug sm:leading-tight md:leading-tight">
          {heroTitle}
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          {heroParagraph}
        </p>
        <a
          href="#about"
          className="inline-block bg-green-600 hover:bg-green-500 transition px-5 sm:px-6 py-2.5 sm:py-3 text-white font-semibold rounded-lg"
        >
          Learn More
        </a>
      </div>
    </section>
  )
}
