'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const lineData = [
  { day: 'Mon', donations: 400, views: 2400 },
  { day: 'Tue', donations: 1200, views: 3600 },
  { day: 'Wed', donations: 900, views: 3000 },
  { day: 'Thu', donations: 1600, views: 4800 },
  { day: 'Fri', donations: 2100, views: 5600 },
  { day: 'Sat', donations: 1800, views: 4200 },
  { day: 'Sun', donations: 2400, views: 6000 },
]

export function StatsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={lineData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '16px', 
            border: 'none', 
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            padding: '12px 16px'
          }}
          cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
        />
        <Area 
          type="monotone" 
          dataKey="donations" 
          stroke="#2563eb" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorDonations)" 
          animationDuration={1500}
        />
        <Area 
          type="monotone" 
          dataKey="views" 
          stroke="#7c3aed" 
          strokeWidth={2}
          strokeDasharray="5 5"
          fillOpacity={1} 
          fill="url(#colorViews)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const barData = [
  { name: 'Medical', value: 45 },
  { name: 'Education', value: 30 },
  { name: 'Animal', value: 15 },
  { name: 'Other', value: 10 },
]

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b']

export function CategoryBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData} layout="vertical">
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false}
          tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
          width={80}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
