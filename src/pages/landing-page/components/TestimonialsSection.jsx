import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    category: 'HR & People Management',
    categoryColor: 'from-violet-500 to-purple-600',
    categoryBg: 'bg-violet-50',
    categoryText: 'text-violet-700',
    quote:
      'Compliance Trained webinars have transformed the way our HR team approaches talent management. The sessions are insightful, practical, and aligned with real-world challenges.',
    name: 'Alex Johnson',
    title: 'HR Manager',
    company: 'TechCorp',
    avatar: 'AJ',
    avatarGradient: 'from-violet-400 to-purple-600',
    rating: 5,
  },
  {
    id: 2,
    category: 'HR & People Management',
    categoryColor: 'from-violet-500 to-purple-600',
    categoryBg: 'bg-violet-50',
    categoryText: 'text-violet-700',
    quote:
      'A must-attend for HR professionals looking to stay ahead. The content is future-focused and perfectly balances technology with human-centric insights.',
    name: 'Jennifer Lopez',
    title: 'Finance Manager',
    company: 'Innovation Labs',
    avatar: 'JL',
    avatarGradient: 'from-pink-400 to-rose-600',
    rating: 5,
  },
  {
    id: 3,
    category: 'Banking & Financial Services',
    categoryColor: 'from-blue-500 to-indigo-600',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-700',
    quote:
      'Compliance Trained webinars offer deep insights into digital transformation in banking and financial services. The sessions are highly relevant and forward-thinking.',
    name: 'Michael Reynolds',
    title: 'Financial Analyst',
    company: 'BlueRock Capital',
    avatar: 'MR',
    avatarGradient: 'from-blue-400 to-indigo-600',
    rating: 5,
  },
  {
    id: 4,
    category: 'Banking & Financial Services',
    categoryColor: 'from-blue-500 to-indigo-600',
    categoryBg: 'bg-blue-50',
    categoryText: 'text-blue-700',
    quote:
      'Excellent speakers and well-structured content. The webinars provided clarity on regulatory, compliance, and AI adoption challenges.',
    name: 'Daniel Brooks',
    title: 'Founder & CEO',
    company: 'SummitPeak Consulting',
    avatar: 'DB',
    avatarGradient: 'from-cyan-400 to-blue-600',
    rating: 5,
  },
  {
    id: 5,
    category: 'Artificial Intelligence',
    categoryColor: 'from-emerald-500 to-teal-600',
    categoryBg: 'bg-emerald-50',
    categoryText: 'text-emerald-700',
    quote:
      'Compliance Trained delivers cutting-edge knowledge on AI trends and real-world applications. Every session adds tangible value.',
    name: 'Emily Carter',
    title: 'Marketing Manager',
    company: 'BrightWave Solutions',
    avatar: 'EC',
    avatarGradient: 'from-emerald-400 to-teal-600',
    rating: 5,
  },
  {
    id: 6,
    category: 'Artificial Intelligence',
    categoryColor: 'from-emerald-500 to-teal-600',
    categoryBg: 'bg-emerald-50',
    categoryText: 'text-emerald-700',
    quote:
      'An excellent platform for continuous learning. The discussions on automation and data-driven decision-making are particularly impactful.',
    name: 'Ava Collins',
    title: 'HR Manager',
    company: 'PeopleFirst HR Solutions',
    avatar: 'AC',
    avatarGradient: 'from-teal-400 to-cyan-600',
    rating: 5,
  },
  {
    id: 7,
    category: 'General Excellence',
    categoryColor: 'from-orange-500 to-amber-600',
    categoryBg: 'bg-orange-50',
    categoryText: 'text-orange-700',
    quote:
      'Compliance Trained consistently exceeds expectations. The quality of content and expert-led discussions make it the go-to platform for professional development.',
    name: 'Ethan Parker',
    title: 'Sales Executive',
    company: 'Velocity Sales Group',
    avatar: 'EP',
    avatarGradient: 'from-orange-400 to-amber-600',
    rating: 5,
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 32" fill="currentColor">
    <path d="M0 32V19.733C0 8.88 6.4 2.507 19.2 0l2.4 4.267C14.293 5.973 10.4 9.76 9.6 15.467H16V32H0zm24 0V19.733C24 8.88 30.4 2.507 43.2 0l2.4 4.267c-7.307 1.706-11.2 5.493-12 11.2H40V32H24z" />
  </svg>
);

const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
  >
    {/* Top color bar */}
    <div className={`h-1.5 w-full bg-gradient-to-r ${testimonial.categoryColor}`} />

    <div className="p-6 flex flex-col flex-1">
      {/* Category badge */}
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${testimonial.categoryBg} ${testimonial.categoryText} mb-4 self-start`}
      >
        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${testimonial.categoryColor} inline-block`} />
        {testimonial.category}
      </span>

      {/* Quote */}
      <div className="relative flex-1">
        <QuoteIcon className="w-8 h-6 text-gray-100 absolute -top-1 -left-1" />
        <p className="text-gray-700 text-sm leading-relaxed relative z-10 pl-2">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}
        >
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm truncate">{testimonial.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {testimonial.title} · {testimonial.company}
          </div>
        </div>
        <StarRating count={testimonial.rating} />
      </div>
    </div>
  </motion.div>
);

const FILTERS = ['All', 'HR & People Management', 'Banking & Financial Services', 'Artificial Intelligence', 'General Excellence'];

const TestimonialsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = activeFilter === 'All'
    ? testimonials
    : testimonials.filter(t => t.category === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-20 px-4">
      {/* Decorative background dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: (i * 0.3) % 2 }}
            style={{ left: `${(i * 8.5) % 100}%`, top: `${(i * 12) % 100}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            TRUSTED BY PROFESSIONALS
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Learners
            </span>{' '}
            Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real professionals. Real results. Hear how Compliance Trained webinars are transforming careers and teams.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { value: '10,000+', label: 'Professionals Trained' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '500+', label: 'Live Sessions' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200'
                  : 'bg-white text-gray-700 hover:shadow-lg hover:text-blue-600'
              }`}
            >
              {filter}
              {filter !== 'All' && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeFilter === filter ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                }`}>
                  {testimonials.filter(t => t.category === filter).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount(v => v + 3)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Load More Reviews
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 rounded-3xl p-10 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 2) * 50}%` }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE WEBINARS AVAILABLE
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Join{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                10,000+
              </span>{' '}
              Professionals?
            </h3>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
              Explore upcoming live webinars across HR, BFSI, AI, and more. Expert-led sessions designed for real-world impact.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/webinars/live'}
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-900 font-black px-10 py-4 rounded-xl shadow-2xl hover:shadow-cyan-400/40 transition-all text-lg"
            >
              Browse Live Webinars →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;