"use client";

import { useState, useMemo } from "react";
import { NETWORK_ATTENDEES } from "@/lib/event-data";
import { motion } from "framer-motion";
import { spring, ease } from "@/lib/motion";
import { Search, Users, MessageSquare } from "lucide-react";

export function NetworkSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectors = useMemo(
    () => [...new Set(NETWORK_ATTENDEES.map((a) => a.sector))],
    []
  );

  const filteredAttendees = useMemo(() => {
    return NETWORK_ATTENDEES.filter((attendee) => {
      const matchesSearch =
        searchTerm === "" ||
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = !selectedSector || attendee.sector === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [searchTerm, selectedSector]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: ease.out },
    },
  };

  return (
    <section id="network" className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-background to-surface">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8" style={{ color: "var(--accent-cyan)" }} />
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              Network & Connect
            </h2>
          </div>
          <p className="text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>
            Meet innovators, leaders, and changemakers from across Africa
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8 flex items-center gap-3 px-4 py-3 rounded-full border-2"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border-strong)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Search className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search by name, title, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "var(--text-primary)" }}
          />
        </motion.div>

        {/* Sector Filter */}
        <motion.div
          className="mb-12 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setSelectedSector(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedSector === null
                ? "text-brand-navy dark:text-white"
                : "text-text-secondary hover:text-accent-cyan"
            }`}
            style={{
              backgroundColor: selectedSector === null ? "var(--accent-cyan)" : "transparent",
              border: selectedSector === null ? "none" : "1px solid var(--border-strong)",
            }}
          >
            All Sectors
          </button>

          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedSector === sector
                  ? "text-brand-navy dark:text-white"
                  : "text-text-secondary hover:text-accent-cyan"
              }`}
              style={{
                backgroundColor: selectedSector === sector ? "var(--accent-cyan)" : "transparent",
                border: selectedSector === sector ? "none" : "1px solid var(--border-strong)",
              }}
            >
              {sector}
            </button>
          ))}
        </motion.div>

        {/* Attendee Count */}
        <motion.p
          className="mb-8 text-center text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {filteredAttendees.length} attendee{filteredAttendees.length !== 1 ? "s" : ""} found
        </motion.p>

        {/* Attendee Grid */}
        {filteredAttendees.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredAttendees.map((attendee) => (
              <AttendeeCard key={attendee.id} attendee={attendee} variants={itemVariants} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p style={{ color: "var(--text-secondary)" }}>No attendees match your search.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function AttendeeCard({
  attendee,
  variants,
}: {
  attendee: typeof NETWORK_ATTENDEES[0];
  variants: any;
}) {
  return (
    <motion.div
      variants={variants}
      className="rounded-2xl overflow-hidden border-2 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border-strong)",
      }}
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-accent-cyan/10 to-brand-navy/20 flex items-center justify-center">
        {attendee.image && attendee.image.startsWith("/") ? (
          <img
            src={attendee.image}
            alt={attendee.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        {/* Fallback Avatar */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--brand-navy))" }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {attendee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {attendee.name}
        </h3>

        <p className="text-sm font-semibold mb-2" style={{ color: "var(--accent-cyan)" }}>
          {attendee.title}
        </p>

        <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
          {attendee.organization}
        </p>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {attendee.bio}
        </p>

        {/* Interests */}
        <div className="mb-4 flex flex-wrap gap-2">
          {attendee.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: "var(--accent-cyan)",
                color: "var(--brand-navy)",
              }}
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Location */}
        <p className="text-xs mb-4 font-medium" style={{ color: "var(--text-secondary)" }}>
          📍 {attendee.location}
        </p>

        {/* Connect Button */}
        <button
          className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--accent-cyan)",
            color: "var(--brand-navy)",
          }}
        >
          <MessageSquare className="w-4 h-4" />
          Connect
        </button>
      </div>
    </motion.div>
  );
}
