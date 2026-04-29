import { motion } from 'framer-motion'

export default function SectionLabel({ number, label }) {
  return (
    <motion.div
      className="flex items-center gap-4 mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono text-xs text-[var(--accent)] tracking-widest opacity-70">
        {String(number).padStart(2, '0')}
      </span>
      <div className="h-px w-8 bg-[var(--border-accent)]" />
      <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-[0.2em]">
        {label}
      </span>
    </motion.div>
  )
}