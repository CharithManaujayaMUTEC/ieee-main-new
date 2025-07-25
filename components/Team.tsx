'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Chairperson",
    photo: "/images/welcome.jpg",
  },
  {
    name: "Bob Smith",
    role: "Vice Chair",
    photo: "/images/welcome.jpg",
  },
  {
    name: "Carol Lee",
    role: "Event Coordinator",
    photo: "/images/welcome.jpg",
  },
  {
    name: "David Kim",
    role: "Technical Lead",
    photo: "/images/welcome.jpg",
  },
  // Add more members if needed
];

export default function Team() {
  return (
    <section
      id="team"
      className="max-w-7xl mx-auto px-6 sm:px-10 py-20 text-white"
    >
      <h2 className="text-4xl font-extrabold mb-12 text-center">Meet the Team</h2>

      {/* Horizontal marquee container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-12 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...teamMembers, ...teamMembers].map(({ name, role, photo }, index) => (
            <div key={`${name}-${index}`} className="flex flex-col items-center space-y-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg shadow-blue-600/50">
                <Image
                  src={photo}
                  alt={name}
                  width={128}   // fixed width
                  height={128}  // fixed height
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold whitespace-nowrap">{name}</h3>
              <p className="text-blue-400 whitespace-nowrap">{role}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
