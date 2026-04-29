import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import SectionLabel from '../ui/SectionLabel'

function FloatInput({ label, type = 'text', name, value, onChange, error }) {
  return (
    <div className="float-label">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={error ? '!border-red-500/60' : ''}
      />
      <label>{label}</label>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-xs text-red-400 font-mono"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function FloatTextarea({ label, name, value, onChange }) {
  return (
    <div className="float-label">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={4}
      />
      <label>{label}</label>
    </div>
  )
}

function SuccessState({ onReset }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-elevated)' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Animated check */}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(0,255,178,0.1)', border: '1px solid rgba(0,255,178,0.3)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
      >
        <motion.svg
          width="32" height="32" viewBox="0 0 32 32" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        >
          <motion.path
            d="M6 16l8 8 12-14"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </motion.div>

      <motion.h3
        className="font-display text-3xl tracking-wide text-[var(--text-primary)] mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        SENT!
      </motion.h3>
      <motion.p
        className="text-[var(--text-secondary)] text-sm mb-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your message was delivered. <br />
        (This is a demo — no server involved)
      </motion.p>
      <motion.button
        onClick={onReset}
        className="px-6 py-3 rounded-full font-mono text-xs text-[var(--accent)] border border-[var(--border-accent)] hover:bg-[var(--accent)] hover:text-black transition-all duration-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Send another
      </motion.button>
    </motion.div>
  )
}

export default function FormsUX() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message cannot be empty'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Shake animation
      formRef.current?.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(0)' },
      ], { duration: 400, easing: 'ease-out' })
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)

    // Confetti burst
    const btn = document.getElementById('submit-btn')
    if (btn) {
      const rect = btn.getBoundingClientRect()
      confetti({
        particleCount: 120,
        spread: 80,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ['#00FFB2', '#00B4D8', '#ffffff', '#FF4D00'],
        ticks: 200,
      })
    }
  }

  return (
    <section id="forms" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={7} label="Forms & Micro UX" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          FORM<br />
          <span className="gradient-text">CRAFT</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Contact Form with Validation
            </p>
            <div ref={formRef} className="relative glass rounded-2xl p-8 overflow-hidden" style={{ minHeight: 480 }}>
              <AnimatePresence>
                {submitted ? (
                  <SuccessState onReset={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: '', message: '' })
                  }} />
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FloatInput label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
                      <FloatInput label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
                    </div>
                    <FloatInput label="Subject" name="subject" value={form.subject} onChange={onChange} />
                    <FloatTextarea label="Message" name="message" value={form.message} onChange={onChange} />

                    <motion.button
                      id="submit-btn"
                      type="submit"
                      disabled={loading}
                      className="relative py-4 rounded-xl font-body font-medium text-sm tracking-wide text-black overflow-hidden disabled:opacity-70"
                      style={{ background: 'var(--accent)' }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            className="flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <motion.div
                              className="w-4 h-4 rounded-full border-2 border-black border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            Sending…
                          </motion.div>
                        ) : (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Send Message ✦
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Micro UX Showcase */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Micro-interaction States
            </p>
            <div className="space-y-4">
              <MicroToggle label="Notifications" />
              <MicroSlider label="Opacity" />
              <MicroSelect label="Animation Easing" options={['Spring', 'Ease Out Expo', 'Bounce', 'Linear']} />
              <MicroCounter label="Duration (ms)" min={100} max={1000} step={100} initial={300} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MicroToggle({ label }) {
  const [on, setOn] = useState(false)
  return (
    <div className="glass rounded-xl px-5 py-4 flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="relative w-12 h-6 rounded-full transition-colors duration-300"
        style={{ background: on ? 'var(--accent)' : 'var(--border)' }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          animate={{ x: on ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

function MicroSlider({ label }) {
  const [val, setVal] = useState(70)
  return (
    <div className="glass rounded-xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="font-mono text-xs text-[var(--accent)]">{val}%</span>
      </div>
      <div className="relative h-1 bg-[var(--border)] rounded-full">
        <div
          className="absolute h-full rounded-full transition-all"
          style={{ width: `${val}%`, background: 'linear-gradient(90deg, var(--accent), #00B4D8)' }}
        />
        <input
          type="range" min={0} max={100}
          value={val} onChange={e => setVal(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
        />
      </div>
    </div>
  )
}

function MicroSelect({ label, options }) {
  const [selected, setSelected] = useState(0)
  return (
    <div className="glass rounded-xl px-5 py-4">
      <span className="text-sm text-[var(--text-secondary)] block mb-3">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setSelected(i)}
            className="relative px-3 py-1.5 rounded-lg font-mono text-xs transition-colors"
            style={{
              color: selected === i ? '#000' : 'var(--text-secondary)',
              background: selected === i ? 'var(--accent)' : 'var(--surface)',
              border: '1px solid',
              borderColor: selected === i ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MicroCounter({ label, min, max, step, initial }) {
  const [val, setVal] = useState(initial)
  const inc = () => setVal(v => Math.min(max, v + step))
  const dec = () => setVal(v => Math.max(min, v - step))
  return (
    <div className="glass rounded-xl px-5 py-4 flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={dec}
          className="w-8 h-8 rounded-full glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all font-mono"
        >−</button>
        <motion.span
          key={val}
          className="font-mono text-sm w-12 text-center text-[var(--text-primary)]"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {val}
        </motion.span>
        <button
          onClick={inc}
          className="w-8 h-8 rounded-full glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all font-mono"
        >+</button>
      </div>
    </div>
  )
}