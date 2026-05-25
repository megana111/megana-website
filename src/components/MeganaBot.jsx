import { useState, useRef, useEffect } from 'react'
import styles from './MeganaBot.module.css'

const SYSTEM_PROMPT = `You are "ask megana" — a warm, casual, witty AI assistant that lives on Megana Madhurakavi's personal website. You answer questions about Megana in her voice: friendly, a little playful, humble but confident. Keep answers concise and conversational — like texting, not a Wikipedia entry.

Here's everything you know about Megana:

BASICS:
- Student at Harvard University
- Email: mmadhurakavi@college.harvard.edu
- LinkedIn: linkedin.com/in/megana-madhurakavi
- Passionate about tech, social impact, sustainability, and entrepreneurship
- Daughter of Indian immigrants; grew up in Robbinsville, NJ
- Her interest in preparedness started after experiencing Hurricane Sandy

EXPERIENCE:
1. Liila (Founder & CEO) — sustainable fashion brand she founded at age 15. Makes clothing from bamboo, banana stems, and upcycled fabric. 2 collections. International supply chain. 600k+ social media reach. 500+ handmade small-batch pieces sold. 50+ sustainability workshops & pop-ups. Website: shopliila.com
2. FEMA National Youth Preparedness Council (2024-25) — 1 of 15 selected globally. Equity & Access Team Lead. Works on finance, AI & sustainability intersection to support underserved populations in emergencies. Received training on disaster response. Attended fully funded trip to Washington D.C.
3. Kuchipudi Classical Dance — 13 years of training. Hundreds of performances and competitions. Raised $10,000 through dance for visually challenged and tribal schools.
4. Finance & PR Intern at CITYarts, Inc. — NYC nonprofit creating public art in underserved communities.

HONORS:
- 2026 Coca-Cola Scholar (0.14% acceptance rate)
- 2025 Emerging Innovator of the Year — Horn Entrepreneurship (1 out of 360 international applications)
- 2nd Place at Princeton University's IgniteSTEM Challenge (smart trash can automating food composting via CAD)
- Sustainability Impact for UNSDGs Excellence Award (youngest awardee, international)
- Global Youth Ambassador of SDG & Carbon Neutrality (judged by UN & UNIDO professionals, international competition with 5M+ viewers)

PERSONALITY / FUN FACTS:
- Started entrepreneurial ventures in 3rd grade (fidget spinners and slime!)
- Blends fashion, environmental ethics, and youth empowerment
- Passionate about using tech for good; wants more experience with tech and AI; interested in startups
- Really good at storytelling and creating a brand voice
- Open to internships and collaboration opportunities

RULES:
- If asked something personal, weird, or that you don't know → respond with something like: "hmm, i'm not totally sure about that one! want me to send Megana a message directly?" then set needs_email: true in your response.
- Stay in character — warm, casual, lowercase-leaning, a little witty
- Never make up facts about Megana
- If asked if you're AI: be honest but playful ("yep! i'm megana's little digital helper 😄")
- Keep responses under 100 words unless the question really warrants more

RESPONSE FORMAT: Always respond as plain conversational text. Do not use markdown headers or bullet points.`

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "hi! i'm megana's little corner of the internet ✨ ask me anything about her — work, projects, how she got started, all of it 👋",
}

export default function MeganaBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailDraft, setEmailDraft] = useState(null)
  const [emailSent, setEmailSent] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, emailDraft])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)
    setEmailDraft(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.reply) {
        console.error('[ask megana] api error:', data)
      }
      const reply = data.reply || "hmm, something went wrong on my end! try again?"

      const needsEmail = reply.toLowerCase().includes('send megana a message') ||
        reply.toLowerCase().includes('shoot megana') ||
        reply.toLowerCase().includes('email megana')

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      if (needsEmail) {
        setEmailDraft({
          to: 'mmadhurakavi@college.harvard.edu',
          subject: 'Question from your website',
          body: `Hi Megana,\n\nI visited your website and wanted to ask:\n\n"${text}"\n\nLooking forward to hearing from you!`,
        })
      }
    } catch (err) {
      console.error('[ask megana] network error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: "oops, something went wrong! try again in a sec 😅" }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const sendEmail = () => {
    if (!emailDraft) return
    const mailto = `mailto:${emailDraft.to}?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`
    window.open(mailto)
    setEmailSent(true)
    setEmailDraft(null)
    setMessages(prev => [...prev, { role: 'assistant', content: "sent! megana will get back to you soon 💌" }])
  }

  return (
    <>
      <button className={`${styles.fab} ${open ? styles.fabOpen : ''}`} onClick={() => setOpen(o => !o)} aria-label="Chat with Megana bot">
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {!open && <span className={styles.fabLabel}>ask megana</span>}
      </button>

      <div className={`${styles.window} ${open ? styles.windowOpen : ''}`}>
        <div className={styles.windowHeader}>
          <div className={styles.botAvatar}>M</div>
          <div>
            <div className={styles.botName}>ask megana</div>
            <div className={styles.botStatus}><span className={styles.statusDot} />online</div>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgBot}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <span className={styles.typing}><span/><span/><span/></span>
            </div>
          )}
          {emailDraft && !emailSent && (
            <div className={styles.emailDraft}>
              <div className={styles.draftLabel}>draft email</div>
              <div className={styles.draftField}><span>to:</span> {emailDraft.to}</div>
              <div className={styles.draftField}><span>subject:</span> {emailDraft.subject}</div>
              <div className={styles.draftBody}>{emailDraft.body}</div>
              <div className={styles.draftActions}>
                <button className={styles.sendBtn} onClick={sendEmail}>send it ✉</button>
                <button className={styles.skipBtn} onClick={() => setEmailDraft(null)}>nevermind</button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ask me anything..."
            disabled={loading}
          />
          <button className={styles.sendBtn2} onClick={send} disabled={loading || !input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
