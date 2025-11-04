'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

interface SBTimelineProps {
  onLoad?: () => void;
}

export default function SBTimeline({ onLoad }: SBTimelineProps) {
  const [timelineItems, setTimelineItems] = useState<
    { image: string; title: string; description: string; date: string }[]
  >([]);
  const controls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const [animationDuration, setAnimationDuration] = useState(80); // seconds
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedItem, setSelectedItem] = useState<null | {
    image: string;
    title: string;
    description: string;
    date: string;
  }>(null);

  // Fetch timeline data
  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch('/api/OurJourney');
        const data = await res.json();
        setTimelineItems(data.timelineItems);
        onLoad?.();
      } catch (err) {
        console.error('Failed to fetch timeline data:', err);
        setTimelineItems([]);
        onLoad?.();
      }
    }
    fetchTimeline();
  }, [onLoad]);

  // Adjust speed for mobile
  useEffect(() => {
    const handleResize = () => {
      setAnimationDuration(window.innerWidth < 768 ? 160 : 80);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // IntersectionObserver to pause animation off-screen
  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start({ x: ['0%', '-50%'], transition: { duration: animationDuration, ease: 'linear', repeat: Infinity } });
        } else {
          controls.stop();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(currentSection);
    return () => observer.unobserve(currentSection);
  }, [controls, animationDuration]);

  const pauseMarquee = useCallback(() => {
    controls.stop();
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  }, [controls]);

  const resumeMarquee = useCallback(() => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      controls.start({ x: ['0%', '-50%'], transition: { duration: animationDuration, ease: 'linear', repeat: Infinity } });
    }, 2000);
  }, [controls, animationDuration]);

  return (
    <section
      ref={sectionRef}
      id="sb-timeline"
      className="relative py-24 bg-[#001F33]/60 rounded-3xl backdrop-blur-md overflow-hidden mx-4 md:mx-12"
    >
      <h2 className="text-center text-white text-4xl font-bold mb-4">Our Journey</h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
        The IEEE Power & Energy Society (PES) was established in 2012, marking the beginning of its journey to promote knowledge sharing, innovation, and collaboration in the fields of power and energy.
      </p>

      {/* Timeline container */}
      <div
        className="relative z-10 w-full overflow-hidden"
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
        onTouchStart={pauseMarquee}
        onTouchEnd={resumeMarquee}
      >
        <motion.div
          className="flex gap-8 w-max"
          animate={controls}
          style={{ x: '0%' }}
        >
          {[...timelineItems, ...timelineItems].map((item, i) => (
            <div
              key={i}
              onClick={() => setSelectedItem(item)}
              className="relative w-60 h-80 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden shadow-xl border border-green-500 bg-black bg-opacity-60 flex flex-col hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-full h-40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex flex-col justify-between space-y-1 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-lg font-bold line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-3">{item.description}</p>
                <span className="text-xs text-green-400">{item.date}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-[#0A1A2F]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 scale-100 hover:scale-[1.01] border border-green-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-60 rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{selectedItem.title}</h3>
            <p className="text-sm text-gray-300 mb-2">{selectedItem.date}</p>
            <div className="text-gray-200 text-sm max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
              {selectedItem.description}
            </div>
            <div className="flex justify-center px-4 py-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(null);
                }}
                className="text-white hover:text-green-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
