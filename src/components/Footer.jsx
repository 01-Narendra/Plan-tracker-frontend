import React from 'react'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

const LINK_COLUMNS = [
  {
    title: 'Product',
    links: ['Dashboard', 'Plans', 'Streaks', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Guide', 'FAQ', 'Support'],
  },
  {
    title: 'Company',
    links: ['About', 'Privacy', 'Terms'],
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
              <a
                href="#"
                aria-label="GitHub"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
              >
                <Github size={15} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
              >
                <Twitter size={15} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="mailto:hello@ledger.app"
                aria-label="Email"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-ledger-rule text-ledger-inkSoft hover:text-ledger-accent hover:border-ledger-accent transition"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ledger-ink/80 hover:text-ledger-accent transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
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
