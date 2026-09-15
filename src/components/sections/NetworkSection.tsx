"use client";

import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { Search, Users, ArrowRight } from "lucide-react";
import { listNetworkDirectory, type DirectoryPerson } from "@/lib/networking.functions";
import { TRACKS } from "@/lib/register/tracks";

const ATTENDEE_TYPE_LABELS: Record<string, string> = {
  delegate: "YALI Delegate",
  sponsor: "Sponsor",
  media: "Media",
  public: "General Public",
  volunteer: "Volunteer",
};

export function NetworkSection() {
  const fetchDirectory = useServerFn(listNetworkDirectory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["network-directory"],
    queryFn: () => fetchDirectory(),
    retry: false,
  });

  const people = data?.people ?? [];

  const attendeeTypes = useMemo(
    () => [...new Set(people.map((p) => p.attendee_type))],
    [people],
  );

  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const matchesSearch =
        searchTerm === "" ||
        p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.headline ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.bio ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || p.attendee_type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [people, searchTerm, selectedType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out } },
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
            Meet registered attendees who've opted in to be discovered
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8 flex items-center gap-3 px-4 py-3 rounded-full border-2"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border-strong)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Search className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search by name, headline, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "var(--text-primary)" }}
          />
        </motion.div>

        {/* Attendee-type filter */}
        {attendeeTypes.length > 0 && (
          <motion.div
            className="mb-12 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setSelectedType(null)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: selectedType === null ? "var(--accent-cyan)" : "transparent",
                color: selectedType === null ? "var(--brand-navy)" : "var(--text-secondary)",
                border: selectedType === null ? "none" : "1px solid var(--border-strong)",
              }}
            >
              Everyone
            </button>
            {attendeeTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize"
                style={{
                  backgroundColor: selectedType === type ? "var(--accent-cyan)" : "transparent",
                  color: selectedType === type ? "var(--brand-navy)" : "var(--text-secondary)",
                  border: selectedType === type ? "none" : "1px solid var(--border-strong)",
                }}
              >
                {ATTENDEE_TYPE_LABELS[type] ?? type}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading / error / empty states */}
        {isLoading && (
          <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading the directory…
          </p>
        )}

        {error && (
          <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Couldn't load the directory right now. Try refreshing.
          </p>
        )}

        {!isLoading && !error && (
          <>
            <motion.p
              className="mb-8 text-center text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {filteredPeople.length} attendee{filteredPeople.length !== 1 ? "s" : ""} to connect with
            </motion.p>

            {filteredPeople.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {filteredPeople.map((person) => (
                  <AttendeeCard key={person.ticket_code} person={person} variants={itemVariants} />
                ))}
              </motion.div>
            ) : people.length === 0 ? (
              <motion.div
                className="text-center py-12 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p style={{ color: "var(--text-secondary)" }}>
                  Nobody has opted into the directory yet. Registered? Open your ticket link and turn on
                  "List me in the attendee directory" from your networking card to be the first.
                </p>
              </motion.div>
            ) : (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p style={{ color: "var(--text-secondary)" }}>No attendees match your search.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function AttendeeCard({ person, variants }: { person: DirectoryPerson; variants: any }) {
  const track = TRACKS.find((t) => t.slug === person.track_selection);

  return (
    <motion.div
      variants={variants}
      className="rounded-2xl overflow-hidden border-2 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border-strong)" }}
    >
      {/* Avatar / initials banner */}
      <div className="relative h-32 overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--brand-navy))" }}>
        {person.avatar_url ? (
          <img
            src={person.avatar_url}
            alt={person.full_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="text-4xl font-bold text-white">
            {person.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {person.full_name}
        </h3>

        {person.headline && (
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--accent-cyan)" }}>
            {person.headline}
          </p>
        )}

        {person.bio && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
            {person.bio}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium capitalize"
            style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
          >
            {ATTENDEE_TYPE_LABELS[person.attendee_type] ?? person.attendee_type}
          </span>
          {track && (
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
            >
              {track.title}
            </span>
          )}
        </div>

        {person.state && (
          <p className="text-xs mb-4 font-medium" style={{ color: "var(--text-secondary)" }}>
            📍 {person.state}
          </p>
        )}

        <Link
          to="/attendee/$code"
          params={{ code: person.ticket_code }}
          className="mt-auto w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
          style={{ backgroundColor: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          View & connect
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
