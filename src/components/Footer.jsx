import React from 'react'
import { CalendarDays, CheckCircle2, Flame, Github, Linkedin, Mail, Target, Twitter } from 'lucide-react'

const INFO_SECTIONS = [
  {
    title: 'Build Consistency',
    text: 'Small actions repeated every day create lasting habits and meaningful progress.',
  },
  {
    title: 'Track Your Progress',
    text: 'Organize your day, complete your tasks, and keep moving toward your goals.',
  },
  {
    title: 'Stay Accountable',
    text: 'Every completed day is another step forward. Progress matters more than perfection.',
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ledger-rule bg-ledger-panel/60 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-ledger-ink text-ledger-bg font-display flex items-center justify-center text-sm rotate-[-3deg]">
                L
              </div>
              <span className="font-display text-lg font-semibold text-ledger-ink">
                Ledger
              </span>
            </div>
            <p className="text-sm text-ledger-inkSoft leading-relaxed max-w-xs">
              A daily plan tracker for people who'd rather build a streak than
              start over every Monday.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
                title="Daily Planning"
              >
                <CalendarDays size={15} />
              </div>

              <div
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
                title="Goals"
              >
                <Target size={15} />
              </div>

              <div
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
                title="Streaks"
              >
                <Flame size={15} />
              </div>

              <div
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
                title="Completed Tasks"
              >
                <CheckCircle2 size={15} />
              </div>
            </div>
          </div>

          {INFO_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-base font-semibold text-ledger-ink mb-3">
                {section.title}
              </h4>

              <p className="text-sm text-ledger-inkSoft leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-ledger-rule">
          <p className="font-mono text-xs text-ledger-inkSoft">
            © {year} Ledger. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ledger-inkSoft">
            Show up. Check it off. Repeat.
          </p>
        </div>
      </div>
    </footer>
  )
}
