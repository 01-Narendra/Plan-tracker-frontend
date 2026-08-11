
import React, { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const FILTERS = [7, 15, 30, 45, 60]

function formatDay(dateStr) {
  const d = new Date(dateStr)

  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
  })
}

export default function TrendChart({ history }) {

  const [days, setDays] = useState(7)

  const filteredHistory = useMemo(() => {
    if (!history?.length) return []

    // Find the latest date in history.
    // This makes the filter work correctly even if the data
    // doesn't contain today's entry yet.
    const latestDate = new Date(
      Math.max(...history.map((item) => new Date(item.date).getTime()))
    )

    const startDate = new Date(latestDate)
    startDate.setDate(startDate.getDate() - (days - 1))
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(latestDate)
    endDate.setHours(23, 59, 59, 999)

    return history
      .filter((item) => {
        const date = new Date(item.date)

        return date >= startDate && date <= endDate
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [history, days])

  const data = filteredHistory.map((h) => ({
    ...h,
    day: formatDay(h.date),
  }))

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

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {FILTERS.map((filter) => {
          const active = days === filter

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setDays(filter)}
              className={`
                px-2.5 py-1
                rounded-md
                border
                font-mono text-[10px]
                transition-colors
                ${
                  active
                    ? 'bg-ledger-ink text-white border-ledger-ink'
                    : 'bg-transparent text-ledger-inkSoft border-ledger-line hover:text-ledger-ink hover:border-ledger-ink'
                }
              `}
            >
              {filter}D
            </button>
          )
        })}
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-center px-4">
          <p className="font-mono text-xs text-ledger-inkSoft">
            No data available for the last {days} days.
          </p>
        </div>
      ) : (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 10,
                bottom: 0,
                left: 1,
              }}
            >
              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 10,
                  fill: '#4B5468',
                  fontFamily: 'IBM Plex Mono',
                }}
                axisLine={{
                  stroke: '#D8D1BF',
                }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 10,
                  fill: '#4B5468',
                  fontFamily: 'IBM Plex Mono',
                }}
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
                labelFormatter={(label) => label}
              />

              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#D9531E"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  fill: '#D9531E',
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
