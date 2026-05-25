import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import styles from './MeganaBot.module.css'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_CONFIGURED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY,
)

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
- Stay in character — warm, casual, lowercase-leaning, a little witty
- Never make up facts about Megana
- If asked if you're AI: be honest but playful ("yep! i'm megana's little digital helper 😄")
- Keep responses under 80 words unless the question really warrants more

ESCALATION FLOW — when the user asks something you don't know, asks something personal/weird, or explicitly wants to reach Megana:
Walk them through these steps ONE AT A TIME — never ask for multiple things at once. Use your own warm, casual voice for each step:

  Step 1 — Offer: gently say you're not sure but you can pass along a note to Megana. Ask if they'd like that.
  Step 2 — Name: once they agree, ask what their name is.
  Step 3 — Email: once you have their name, ask for the best email for Megana to reach them at.
  Step 4 — Confirm + draft: once you have a valid-looking email (must contain @), summarize what they wanted to ask in one or two clear sentences (synthesized from the whole conversation, not a copy of their last message) and tell them they'll see the draft below and can hit send when ready. THIS is the only step where you include the "draft" field in your JSON.

Escalation rules:
- If at any point they want to abort or change topic, just go back to normal chat with draft: null.
- If they give an obviously invalid email (no @, looks like gibberish), ask once more politely.
- Never include the draft field until you have a name, a valid-looking email, AND a clear message.
- After they've sent (you'll see a tool/system note), don't keep nagging — just continue chatting.

RESPONSE FORMAT — ALWAYS respond with valid JSON in this exact shape:
{
  "reply": "your conversational message to the user, plain text, in your usual voice",
  "draft": null | { "name": "their name", "email": "their email", "message": "a clean 1-2 sentence synthesis of what they want to ask megana" }
}

- "reply" is always a string, always present, no markdown or bullet points.
- "draft" is null on every single turn EXCEPT step 4 above.
- When draft is non-null, your reply should be something brief like "perfect, you'll see the draft below — hit send whenever you're ready 💌"`

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
  const [sending, setSending] = useState(false)
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

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      // The bot only includes a draft once it's gathered name + email + message.
      if (data.draft && data.draft.name && data.draft.email && data.draft.message) {
        setEmailDraft(data.draft)
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

  const sendEmail = async () => {
    if (!emailDraft || sending) return

    // Fallback: if EmailJS isn't configured yet, open the visitor's email app
    // with a pre-filled draft. They have to manually hit send — not ideal,
    // but at least the bot is honest about what happened.
    if (!EMAILJS_CONFIGURED) {
      const subject = `Message from ${emailDraft.name} via your website`
      const body = `From: ${emailDraft.name} <${emailDraft.email}>\n\n${emailDraft.message}`
      const mailto = `mailto:mmadhurakavi@college.harvard.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailto)
      setEmailDraft(null)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "opened your email app — hit send from there and it'll reach megana 📨",
      }])
      return
    }

    setSending(true)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: emailDraft.name,
          from_email: emailDraft.email,
          reply_to: emailDraft.email,
          subject: `Message from ${emailDraft.name} via your website`,
          message: emailDraft.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      setEmailSent(true)
      setEmailDraft(null)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "sent! megana will get back to you soon 💌",
      }])
    } catch (err) {
      console.error('[ask megana] emailjs error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "oh no, couldn't send that 😔 you can email megana directly at mmadhurakavi@college.harvard.edu",
      }])
    } finally {
      setSending(false)
    }
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
              <div className={styles.draftLabel}>draft to megana</div>
              <div className={styles.draftField}><span>from:</span> {emailDraft.name}</div>
              <div className={styles.draftField}><span>email:</span> {emailDraft.email}</div>
              <div className={styles.draftBody}>{emailDraft.message}</div>
              <div className={styles.draftActions}>
                <button className={styles.sendBtn} onClick={sendEmail} disabled={sending}>
                  {sending ? 'sending...' : 'send it ✉'}
                </button>
                <button className={styles.skipBtn} onClick={() => setEmailDraft(null)} disabled={sending}>
                  nevermind
                </button>
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
