import React from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatDay(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

export default function TrendChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-center px-4">
        <p className="font-mono text-xs text-ledger-inkSoft leading-relaxed">
          No history yet.
          <br />
          Complete a full day to start the trend line.
        </p>
      </div>
    )
  }

  const data = history.map((h) => ({ ...h, day: formatDay(h.date) }))

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 10 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#4B5468', fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: '#D8D1BF' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#4B5468', fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: '#F7F4EC',
              border: '1px solid #D8D1BF',
              borderRadius: 8,
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
            }}
            formatter={(value) => [`${value}%`, 'Completed']}
          />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#D9531E"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#D9531E', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
