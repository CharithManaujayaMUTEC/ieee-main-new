'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

function Counter({
  target,
  duration = 2000,
  trigger,
}: { target: number; duration?: number; trigger: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return // don’t start until visible

    const start = Date.now()
    const step = () => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    step()
  }, [target, duration, trigger])

  return <span>{count}</span>
}

const logos = [
  '/images/subchapter1.png',
  '/images/subchapter2.png',
  '/images/subchapter3.png',
  '/images/subchapter4.png',
  '/images/subchapter5.png',
]

export default function About() {
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutPara, setAboutPara] = useState('')
  const [projects, setProjects] = useState(0)
  const [members, setMembers] = useState(0)
  const [visible, setVisible] = useState(false)

  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/HomePageContent')
        const data = await res.json()
        const content = data.homepageData

        setAboutTitle(content.About_Title || '')
        setAboutPara(content.About_Para || '')
        setProjects(parseInt(content.Projects) || 6)
        setMembers(parseInt(content.Members) || 10)
      } catch (err) {
        console.error('Failed to load about data:', err)
      }
    }

    fetchData()
  }, [])

  // Observe when the section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // only trigger once
        }
      },
      { threshold: 0.3 } // 30% visible triggers
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-10 py-16 md:py-20 text-white rounded-3xl bg-neutral-900/60 backdrop-blur-md overflow-hidden"
    >
      {/* Heading & Paragraphs */}
      <div className="md:w-4/5 text-left md:pl-8 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center md:text-left">
          {aboutTitle || 'Our Presence'}
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-center md:text-left">
          {aboutPara ||
            'The IEEE PES was established in 2012 with the vision of bridging academia and industry in the field of power and energy. Through technical workshops, field visits, guest lectures, and collaborative projects, we provide students with valuable exposure to real-world challenges and solutions. Our mission is to inspire the next generation of engineers to drive advancements in power, energy, and sustainability.'}
        </p>
        <p className="text-gray-400 text-sm sm:text-base text-center md:text-left">
          Join us to be part of a global network that supports your career growth and technical development.
        </p>
      </div>

      {/* Counters */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-10 sm:gap-16 mt-12 mb-8">
        {[
          { label: 'Projects', value: projects },
          { label: 'Members', value: members },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center relative">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full before:absolute before:inset-0 before:rounded-full before:bg-blue-500/30 before:blur-xl before:animate-pulse">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 z-10">
                <Counter target={value} trigger={visible} />
              </span>
            </div>
            <p className="mt-2 uppercase text-xs sm:text-sm tracking-wider text-gray-300">{label}</p>
          </div>
        ))}
      </div>

      {/* Scrolling Subchapter Logos */}
      <div className="overflow-hidden whitespace-nowrap mt-6 px-4 sm:px-8 bg-amber-50 rounded-lg">
        <div className="animate-marquee inline-flex gap-6 sm:gap-10 items-center">
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="relative h-12 sm:h-16 flex-shrink-0">
              <Image
                src={logo}
                alt={`Subchapter logo ${index + 1}`}
                width={256}
                height={128}
                style={{ height: '100%', width: 'auto' }}
                className="object-contain opacity-80 hover:opacity-100 transition duration-300"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
