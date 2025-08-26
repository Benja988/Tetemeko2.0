// Replace with user testimonials section
"use client";

import { Star, Quote } from "lucide-react";

export default function PodCastSection3() {
  const testimonials = [
    {
      id: 1,
      text: "This podcast platform has completely changed my daily commute. The content quality is exceptional!",
      author: "Sarah Johnson",
      role: "Regular Listener",
      rating: 5
    },
    {
      id: 2,
      text: "I've discovered so many amazing shows here that I wouldn't have found anywhere else. Highly recommended!",
      author: "Michael Chen",
      role: "Podcast Enthusiast",
      rating: 5
    },
    {
      id: 3,
      text: "The audio quality and production value of these podcasts are top-notch. Great listening experience!",
      author: "Emily Rodriguez",
      role: "Audio Professional",
      rating: 4
    },
    {
      id: 4,
      text: "Perfect blend of entertainment and education. I've learned so much while being thoroughly entertained.",
      author: "David Kim",
      role: "Lifelong Learner",
      rating: 5
    }
  ];

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            What Listeners Say
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover why thousands of listeners love our podcast platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30">
              <Quote className="h-8 w-8 text-blue-400/30 mb-4" />
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}