"use client"

import { useEffect, useRef } from "react"

const pastEventsData = [
  {
    id: 1,
    title: "The Beginning Chapter 01",
    location: "THE MILLS, RAJA BAHADUR CITY CENTRE, DHOLE PATIL RD, PUNE",
    description: "Experience The Unthinkable. Featuring VDJ SHAAN - India's No #1 VDJ.",
  },
  {
    id: 2,
    title: "Chapter 02: Life in the Dream House",
    location: "KOREGAON PARK ANNEXE, ONYX BUILDING, PUNE, MAHARASHTRA",
    description: "Women's Day Special featuring HRJ & K-YASH. Dress Code: Pink and White.",
  },
  {
    id: 3,
    title: "Chapter 03: Meraki's Empire",
    location: "KOREGAON PARK ANNEX, JADHAV NAGAR, MUNDHWA, PUNE",
    description: "Featuring STUVI B2B HAMSHYRE, Supporting Act: KNHALI.",
  },
  {
    id: 4,
    title: "The Asylum Wednesdays",
    location: "DI MORA - PUNE",
    description: "Sound by DHYAN and ANTOOXKRAUTEK. Curated by Team Di Mora & Manav Khiani.",
  },
  {
    id: 5,
    title: "Center Stage Saturday",
    location: "PENTHOUZE - PUNE",
    description: "Featuring SLAPJACK & KNHALI. Meraki Takes Over Penthouze.",
  },
  {
    id: 6,
    title: "Bollywood Takeover",
    location: "EPITOME - PUNE",
    description: "Featuring SUSHMAHAN - The Mashup Monarchs Duo. Hosted by Prathmesh Joshi & Omkar Patil.",
  },
  {
    id: 7,
    title: "KIKI's Amazonia 2.0: Dusk, With a Wild Twist",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    description:
      "India's No.1 Duo Performing PROBROS. Hosted by Devanshu Thite. Amazonia Special Decor, Fireworks, Live Acts.",
  },
  {
    id: 8,
    title: "House of Bollywood",
    location: "PENTHOUZE - PUNE",
    description: "Featuring DJ NAAIRO, also featuring K-YASH. Hosted by Arjun Shinde & Shreyas Bhandari.",
  },
  {
    id: 9,
    title: "SIN CITY",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    description: "Featuring TRUX. Hosted by Prakash Parmar, Mona Saraf, Chirag Bhagat and Sarang Angarkar.",
  },
  {
    id: 10,
    title: "KIKI LAND",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    description: "Feat. Neel Chhabra, RAOS, Siaara, DJ NYX",
  },
  {
    id: 11,
    title: "THE KING OF GOOD TIMES",
    location: "KIKI, B WING, 2ND FLOOR, THE MILLS - RAJA BAHADUR CITY CENTRE, PUNE",
    description: "Feat. KNALI AND HRUTVIK",
  },
]

export default function PastEventsPageContent() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src= "/videos/PastMoments.mp4" type="video/mp4" />
        {/* Fallback background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Scrolling Event Names */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="space-y-6 animate-scroll">
            {pastEventsData.map((event, index) => (
              <div
                key={event.id}
                className={`transition-all duration-500 ${
                  index % 3 === 0 ? "text-white" : index % 3 === 1 ? "text-gray-400" : "text-gray-600"
                }`}
                style={{
                  fontSize:
                    index % 4 === 0 ? "3.5rem" : index % 4 === 1 ? "2.5rem" : index % 4 === 2 ? "2rem" : "1.5rem",
                  fontWeight: index % 3 === 0 ? "bold" : "normal",
                  lineHeight: "1.2",
                  marginBottom: index % 4 === 0 ? "2rem" : "1rem",
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Event Details */}
        <div className="w-1/2 p-8 flex flex-col justify-center space-y-8">
          {pastEventsData.map((event, index) => (
            <div key={`details-${event.id}`} className="opacity-70 hover:opacity-100 transition-opacity duration-300">
              <div className="text-gray-300 text-sm mb-2">{event.location}</div>
              <div className="text-gray-400 text-sm">{event.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
