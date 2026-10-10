"use client";

import { motion, Variants } from "framer-motion";
import { MapPin, Calendar, Clock, Sparkles } from "lucide-react";

interface Event {
  title: string;
  subTitle: string;
  date: string;
  time: string;
  desc: string;
  venue: string;
  mapUrl: string;
  colorTheme: string; // Tailwind colors like 'maroon', 'saffron', 'gold'
  accentText: string;
}

export default function EventDetails() {
  const events: Event[] = [
    {
      title: "Mehndi Ceremony",
      subTitle: "Henna & Festivities",
      date: "Saturday, February 13, 2027",
      time: "4:00 PM onwards",
      desc: "Adorning Devanshi's hands with beautiful henna (Mehndi) designs amidst traditional Gujarati songs, music, and sweet family gatherings.",
      venue: "Shree Niketan Greens, Satellite, Ahmedabad",
      mapUrl: "https://maps.app.goo.gl/Uhc7bmcJwa81KV5RA",
      colorTheme: "bg-[#FFF4E8] border-saffron-500/40",
      accentText: "text-saffron-600",
    },
    {
      title: "Shubh Vivah (Wedding Day)",
      subTitle: "The Auspicious Union",
      date: "Monday, February 15, 2027",
      time: "Grahshanti: 9:00 AM | Mameru: 10:30 AM | Haldi: 11:00 AM | Baraat & Vivah: 4:30 PM onwards",
      desc: "A day of sacred union. Witness Grahshanti in the morning, followed by Mameru, the turmeric Haldi blessings, and the main Vivah Pheras in the evening, followed by celebratory dinner.",
      venue: "Kavan Palace Resort, Gandhinagar Highway, Ahmedabad",
      mapUrl: "https://maps.app.goo.gl/M7wDB5sBMcZT3XeZ8",
      colorTheme: "bg-[#FAF1F3] border-maroon-500/40",
      accentText: "text-maroon-700",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col gap-8 w-full max-w-md px-4 mx-auto"
    >
      {events.map((event, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className={`relative p-6 rounded-2xl border-2 ${event.colorTheme} shadow-[0_4px_16px_rgba(45,37,34,0.03)] overflow-hidden flex flex-col justify-between`}
        >
          {/* Subtle Corner Ornament SVG */}
          <div className="absolute -top-3 -right-3 w-10 h-10 text-gold-500/10 pointer-events-none">
            <Sparkles className="w-full h-full" />
          </div>

          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-display-wedding text-maroon-900 font-bold leading-tight">
                  {event.title}
                </h3>
                <p className={`text-xs uppercase tracking-widest font-bold ${event.accentText} mt-0.5`}>
                  {event.subTitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-charcoal-wedding/80 leading-relaxed font-serif-wedding mb-5 border-l-2 border-gold-500/30 pl-3">
              {event.desc}
            </p>

            {/* Event Meta Details */}
            <div className="flex flex-col gap-2.5 text-xs text-charcoal-wedding/90 font-serif-wedding mb-6 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-gold-500/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-saffron-600 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-saffron-600 shrink-0" />
                <span className="font-bold">{event.time}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-wedding font-bold text-xs uppercase tracking-wider rounded-xl border border-gold-400 shadow-md active:scale-[0.98] transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            Navigate Venue
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
}
