import React, { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { extractAvailableMonthsAndYears, getChartDataForMonthYear } from '../utils/dateUtils.js'

const COLORS = ['#D9531E', '#2F8F5B', '#1C2438', '#6B5B95', '#88B0D3']

export default function TrendChart({ plans }) {

  const safePlans = Array.isArray(plans) ? plans : []

  const { years, monthsForYear, currentYear } = useMemo(() => {
    return extractAvailableMonthsAndYears(safePlans)
  }, [safePlans])

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const availableMonths = useMemo(() => {
    return monthsForYear(selectedYear)
  }, [selectedYear, monthsForYear])

  const chartData = useMemo(() => {
    return getChartDataForMonthYear(plans, selectedYear, selectedMonth)
  }, [plans, selectedYear, selectedMonth])

  // Get unique plan names for lines
  const planNames = useMemo(() => {
    const names = new Set()
    plans.forEach(plan => {
      if (plan.recurring) names.add(plan.name)
    })
    return Array.from(names).slice(0, COLORS.length)
  }, [plans])

  if (safePlans.length === 0) {
    return (
      <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-5">
        <p className="text-ledger-inkSoft text-center">No data to display</p>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-5">
        <div className="mb-4 flex gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase text-ledger-inkSoft mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-ledger-rule rounded-lg text-sm"
            >
              {availableMonths.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase text-ledger-inkSoft mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-ledger-rule rounded-lg text-sm"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-ledger-inkSoft text-center">No data for selected month</p>
      </div>
    )
  }

  return (
    <div className="bg-ledger-panel border border-ledger-rule rounded-2xl shadow-stamp p-5">
      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block font-mono text-[10px] uppercase text-ledger-inkSoft mb-2">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-ledger-rule rounded-lg text-sm font-semibold"
          >
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase text-ledger-inkSoft mb-2">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-ledger-rule rounded-lg text-sm font-semibold"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
          <XAxis dataKey="date" stroke="#8B7355" style={{ fontSize: '12px' }} />
          <YAxis stroke="#8B7355" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#EFEBE1',
              border: '1px solid #D4C5B9',
              borderRadius: '8px',
            }}
            formatter={(value) => `${value}%`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {planNames.map((name, idx) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}