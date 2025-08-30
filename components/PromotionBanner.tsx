'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface PromotionBannerProps {
  onLoad?: () => void
}

export default function PromotionBanner({ onLoad }: PromotionBannerProps) {
  const [promoBanner, setPromoBanner] = useState<string | null>(null)
  const [promoLink, setPromoLink] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)

  // Fetch promo banner
  useEffect(() => {
    const fetchPromoBanner = async () => {
      try {
        const res = await fetch('/api/HomePageContent')
        const { homepageData } = await res.json()
        setPromoBanner(homepageData?.Promo_Banner || null)
        setPromoLink(homepageData?.Promo_Link || null)
        onLoad?.()
      } catch (err) {
        console.error('Failed to fetch promo banner:', err)
        setPromoBanner(null)
        onLoad?.()
      }
    }

    fetchPromoBanner()
  }, [onLoad]) // ✅ add onLoad to dependencies

  // Hide banner after 15 seconds
  useEffect(() => {
    if (promoBanner) {
      const timer = setTimeout(() => setVisible(false), 15000)
      return () => clearTimeout(timer)
    }
  }, [promoBanner])

  if (!promoBanner) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="relative w-full"
        >
          <div className="relative w-full aspect-[16/5] overflow-hidden pt-16">
            {promoLink ? (
              <a href={promoLink} target="_blank" rel="noopener noreferrer">
                <Image
                  src={promoBanner}
                  alt="Promotion Banner"
                  fill
                  className="object-cover w-full h-full cursor-pointer pt-16"
                  priority
                />
              </a>
            ) : (
              <Image
                src={promoBanner}
                alt="Promotion Banner"
                fill
                className="object-cover w-full h-full pt-16"
                priority
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
