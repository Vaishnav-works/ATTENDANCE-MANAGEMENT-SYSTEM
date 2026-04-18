import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Week 1', attendance: 100 },
  { name: 'Week 2', attendance: 85 },
  { name: 'Week 3', attendance: 75 },
  { name: 'Week 4', attendance: 80 },
  { name: 'Week 5', attendance: 72 },
];

const StudentReports = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-100 via-emerald-400 to-teal-500 bg-clip-text text-transparent italic tracking-tighter uppercase">
          SCANOVA Analytics
        </h1>
        <p className="text-gray-500 font-medium italic mt-1">Your personal attendance performance overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', value: '82%', color: 'emerald' },
          { label: 'This Month', value: '78%', color: 'teal' },
          { label: 'Classes Attended', value: '34', color: 'emerald' },
          { label: 'Total Classes', value: '42', color: 'teal' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
            <span className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-6 h-96">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Weekly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 12 }} />
            <YAxis stroke="#555" tick={{ fontSize: 12 }} domain={[60, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#10B981' }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10B981', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#34d399', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentReports;

