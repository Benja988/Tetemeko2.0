'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaTimes } from 'react-icons/fa'
import { events } from '@/constants/events'

// Event Detail Modal Component
const EventDetailModal = ({ event, isOpen, onClose }: { event: any; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full"
          aria-label="Close"
        >
          <FaTimes size={16} />
        </button>
        
        <div className="relative h-60 w-full">
          <img
            src="/prof.jpg"
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            Upcoming
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{event.name}</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{event.location || 'Online Event'}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">About This Event</h3>
            <p className="text-gray-300">{event.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">What You'll Experience</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Keynote presentations from industry leaders</li>
              <li>Interactive workshops and hands-on sessions</li>
              <li>Networking opportunities with professionals</li>
              <li>Q&A sessions with experts</li>
              <li>Exclusive insights and future trends</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Who Should Attend</h3>
            <p className="text-gray-300">This event is perfect for professionals, enthusiasts, and anyone interested in {event.name.split(' ')[0].toLowerCase()} and related fields.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Register Now
            </button>
            <button className="px-6 py-3 border border-gray-700 hover:border-blue-500 text-white rounded-lg font-medium transition-colors">
              Add to Calendar
            </button>
            <button className="px-6 py-3 border border-gray-700 hover:border-blue-500 text-white rounded-lg font-medium transition-colors">
              Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const EventCard = ({ event, isActive, onClick }: { event: any; isActive: boolean; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl overflow-hidden border-2 ${isActive ? 'border-blue-500' : 'border-gray-800'} transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <img
          src="/prof.jpg"
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {isActive && (
          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <FaChevronRight size={16} />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900">
        <h3 className="font-bold text-white line-clamp-1">{event.name}</h3>
        <div className="flex items-center gap-2 text-blue-300 text-sm mt-2">
          <FaCalendarAlt />
          <span>{event.date}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Events() {
  const [activeEvent, setActiveEvent] = useState(0)
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  const scrollToEvent = (index: number) => {
    setActiveEvent(index)
    if (timelineRef.current) {
      const eventElement = timelineRef.current.children[index] as HTMLElement
      eventElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }

  const handleKnowMore = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#07131F] to-[#0A1B2D] text-white overflow-hidden">
      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
      
      {/* Floating calendar elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-white/10 rounded-md"
            style={{
              width: `${100 + Math.random() * 100}px`,
              height: `${100 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Upcoming Events
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Join us for exciting broadcasts, live shows, and community gatherings
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Map View
            </button>
          </div>
        </div>

        {viewMode === 'timeline' ? (
          <>
            {/* Timeline Navigation */}
            <div className="flex justify-center gap-2 mb-8">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToEvent(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeEvent ? 'bg-blue-500 w-6' : 'bg-gray-600'}`}
                />
              ))}
            </div>

            {/* Timeline Cards */}
            <div
              ref={timelineRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-hide"
            >
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="flex-shrink-0 w-full max-w-md snap-center"
                  onClick={() => setActiveEvent(index)}
                >
                  <div className={`bg-gray-900 rounded-2xl overflow-hidden border-2 ${index === activeEvent ? 'border-blue-500' : 'border-gray-800'} transition-all duration-300`}>
                    <div className="relative h-60 w-full">
                      <img
                        src="/prof.jpg"
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Upcoming
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt />
                          <span>{event.location || 'Online Event'}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6 line-clamp-3">{event.description}</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleKnowMore(event);
                          }}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Know More
                        </button>
                        <button className="px-6 py-3 border border-gray-700 hover:border-blue-500 text-white rounded-lg font-medium transition-colors">
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">Interactive Event Map</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                This would display an interactive map with event locations in a real implementation
              </p>
            </div>
          </div>
        )}

        {/* All Events Link */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
            View All Events
            <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}