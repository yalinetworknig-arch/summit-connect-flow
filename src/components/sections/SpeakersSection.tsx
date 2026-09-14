import { SPEAKERS } from "@/lib/event-data";
import { motion } from "framer-motion";
import { spring, ease } from "@/lib/motion";

export function SpeakersSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: ease.out },
    },
  };

  const speakersByType = {
    keynote: SPEAKERS.filter((s) => s.sessionType === "keynote"),
    masterclass: SPEAKERS.filter((s) => s.sessionType === "masterclass"),
    panel: SPEAKERS.filter((s) => s.sessionType === "panel"),
  };

  return (
    <section id="speakers" className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-surface to-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Meet Our Speakers
          </h2>
          <p className="text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>
            Inspiring leaders, innovators, and visionaries shaping Africa's digital future
          </p>
        </motion.div>

        {/* Keynote Speakers */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl md:text-3xl font-semibold mb-8"
            style={{ color: "var(--accent-cyan)" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Keynote Speakers
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {speakersByType.keynote.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} variants={itemVariants} />
            ))}
          </motion.div>
        </div>

        {/* Masterclass Facilitators */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl md:text-3xl font-semibold mb-8"
            style={{ color: "var(--accent-cyan)" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Masterclass Facilitators
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {speakersByType.masterclass.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} variants={itemVariants} />
            ))}
          </motion.div>
        </div>

        {/* Panel Speakers */}
        <div>
          <motion.h3
            className="text-2xl md:text-3xl font-semibold mb-8"
            style={{ color: "var(--accent-cyan)" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Panel Moderators & Speakers
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {speakersByType.panel.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} variants={itemVariants} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker, variants }: { speaker: typeof SPEAKERS[0]; variants: any }) {
  return (
    <motion.div
      variants={variants}
      className="rounded-2xl overflow-hidden border-2 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border-strong)",
      }}
    >
      {/* Image Container */}
      <div
        className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-accent-cyan/10 to-brand-navy/20 flex items-center justify-center"
      >
        {speaker.image && speaker.image.startsWith('/') ? (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        {/* Fallback Avatar */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--brand-navy))" }}>
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {speaker.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {speaker.name}
        </h3>

        <p className="text-sm font-semibold mb-4" style={{ color: "var(--accent-cyan)" }}>
          {speaker.title}
        </p>

        <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          {speaker.bio}
        </p>

        <div className="pt-4 border-t" style={{ borderColor: "var(--border-strong)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>
            Session
          </p>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {speaker.session}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
