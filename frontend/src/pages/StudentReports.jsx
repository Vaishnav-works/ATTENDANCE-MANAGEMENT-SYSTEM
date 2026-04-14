import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', attendance: 100 },
  { name: 'Week 2', attendance: 85 },
  { name: 'Week 3', attendance: 75 },
  { name: 'Week 4', attendance: 80 },
  { name: 'Week 5', attendance: 72 },
];

const StudentReports = () => {
  const [insightText, setInsightText] = useState('');
  const fullInsight = "AuraAI: You need to attend 3 consecutive classes to hit your 75% safe zone. You can do this!";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setInsightText(fullInsight.substring(0, index));
      index++;
      if (index > fullInsight.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-[#6366F1] bg-clip-text text-transparent">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="md:col-span-2 glass-card p-6 h-80">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#333' }} />
              <Line type="monotone" dataKey="attendance" stroke="#6366F1" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight */}
        <div className="glass-card p-6 border-t-4 border-t-purple-500 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">AI Insights</h3>
          <div className="flex-1 bg-white/5 rounded p-4 font-mono text-sm text-gray-300 leading-relaxed border border-white/10">
            {insightText}
            <span className="animate-pulse">|</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentReports;
