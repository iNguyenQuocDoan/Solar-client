import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { KeyValueList } from '@/components/ui/lists'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { assistant } from '@/data/customer'
import { cx } from '@/lib/cx'

type Message = { id: number; role: 'user' | 'assistant'; time: string; text: string }

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const streamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight })
  }, [messages, typing])

  function send(text: string) {
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { id: Date.now(), role: 'user', time: 'Just now', text: t }])
    setDraft('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', time: 'Just now', text: assistant.cannedReply }])
      setTyping(false)
    }, 850)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(draft)
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="space-y-8">
        <Button onClick={() => setMessages([])}>New conversation</Button>

        <Panel>
          <PanelHeader title="System profile" action={<Badge tone="ok">{assistant.profile.status}</Badge>} />
          <PanelBody>
            <KeyValueList
              items={[
                { k: 'System', v: assistant.profile.system },
                { k: 'Contract', v: <span className="text-fg-2">{assistant.profile.contract}</span> },
              ]}
            />
            <p className="mt-3 text-[13px] text-fg-3">Specs update automatically on each contract revision.</p>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Knows about" />
          <PanelBody>
            <p className="text-[15px] leading-6 text-fg-2">{assistant.domains.join(', ')}.</p>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader
            title="Recent conversations"
            action={
              <button type="button" className="text-[14px] text-accent-fg hover:underline">
                View all
              </button>
            }
          />
          <PanelBody>
            <ul className="divide-y divide-line">
              {assistant.recent.map((r) => (
                <li key={r.title}>
                  <button type="button" className="press -mx-2 w-full rounded-md px-2 py-2.5 text-left hover:bg-surface-2">
                    <p className="text-[13px] text-fg-3">{r.when}</p>
                    <p className="text-[14px] font-medium">{r.title}</p>
                    <p className="text-[13px] text-fg-2">{r.meta}</p>
                  </button>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>
      </aside>

      <Panel className="flex min-h-[70dvh] flex-col border-t-0! pt-0!">
        <PanelHeader
          title="Solar assistant"
          description="Answers from your Oakwood Residence system specs and project contract. Available 24/7."
        />

        <div ref={streamRef} className="flex-1 space-y-6 overflow-y-auto border-t border-line px-5 py-5">
          <div>
            <p className="mb-2 text-[13px] text-fg-3">Suggested for Oakwood Residence</p>
            <ul className="flex flex-col items-start gap-1.5">
              {assistant.suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="press text-left text-[15px] text-fg-2 underline-offset-4 hover:text-fg hover:underline"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {messages.length === 0 && (
            <>
              <Bubble role="user" time={assistant.thread[0]!.time}>
                {assistant.thread[0]!.text}
              </Bubble>
              <Bubble role="assistant" time={assistant.thread[1]!.time}>
                <p className="font-medium">{assistant.thread[1]!.title}</p>
                <p className="mt-1">{assistant.thread[1]!.text}</p>
                <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                  {assistant.thread[1]!.tiers!.map((t) => (
                    <div key={t.name} className="rounded-md bg-surface-2 p-3">
                      <dt className="text-[14px] font-medium">
                        <span className="tnum block text-[13px] text-fg-3">{t.years}</span>
                        {t.name}
                      </dt>
                      <dd className="mt-1 text-[13px] text-fg-2">{t.body}</dd>
                    </div>
                  ))}
                </dl>
                <a href="#" className="mt-3 flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[14px] hover:bg-surface-2">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{assistant.thread[1]!.attachment!.name}</span>
                    <span className="block text-[13px] text-fg-3">{assistant.thread[1]!.attachment!.meta}</span>
                  </span>
                </a>
                <p className="mt-3">{assistant.thread[1]!.footer}</p>
              </Bubble>
            </>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} time={m.time}>
              {m.text}
            </Bubble>
          ))}
          {typing && (
            <p className="text-[13px] text-fg-3" aria-live="polite">
              Assistant is typing
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-line px-5 py-4">
          <div className="flex items-end gap-2">
            <Button type="button" variant="ghost" size="sm">
              Attach
            </Button>
            <Textarea
              aria-label="Message"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(draft)
                }
              }}
              placeholder="Ask anything about your solar installation, equipment or billing"
              className="min-h-9 resize-none"
            />
            <Button type="submit" variant="primary" disabled={!draft.trim()}>
              Send
            </Button>
          </div>
          <p className="mt-2 text-[13px] text-fg-3">{assistant.disclaimer}</p>
        </form>
      </Panel>
    </div>
  )
}

function Bubble({ role, time, children }: { role: 'user' | 'assistant'; time: string; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div className={cx('flex gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <span className="w-16 shrink-0 pt-3 text-[14px] text-fg-3">Assistant</span>
      )}
      <div className={cx('max-w-[720px] min-w-0', isUser && 'text-right')}>
        <div
          className={cx(
            'inline-block rounded-md px-4 py-3 text-left text-[15px] leading-6',
            isUser ? 'bg-accent text-on-accent' : 'border border-line bg-surface',
          )}
        >
          {children}
        </div>
        <p className="mt-1 text-[13px] text-fg-3">{time}</p>
      </div>
    </div>
  )
}
