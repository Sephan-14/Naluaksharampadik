import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface GrowthData {
  month: string;
  streakConsistency: number;
  skillDevelopment: number;
}

interface Student {
  id: string;
  name: string;
  joinedDate: string;
  currentStreak: number;
  skillsCount: number;
}

export default function LongTermGrowthTracker() {
  const { userProfile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  useEffect(() => {
    if (userProfile?.role === 'alumni') {
      fetchConnectedStudents();
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedStudent) {
      fetchGrowthMetrics();
    }
  }, [selectedStudent]);

  const fetchConnectedStudents = async () => {
    try {
      const { data: connections, error } = await supabase
        .from('mentorship_connections')
        .select(`
          mentee_id,
          mentee:mentee_id (id, full_name, created_at)
        `)
        .eq('alumni_id', userProfile?.id)
        .eq('status', 'active');

      if (error) throw error;

      // Fetch streak and skill info for each student
      const studentList = await Promise.all(
        (connections || []).map(async (c: any) => {
          const { data: streak } = await supabase
            .from('user_streaks')
            .select('current_streak')
            .eq('user_id', c.mentee_id)
            .single();

          const { data: skills } = await supabase
            .from('users')
            .select('areas_of_expertise')
            .eq('id', c.mentee_id)
            .single();

          return {
            id: c.mentee_id,
            name: c.mentee?.full_name,
            joinedDate: c.mentee?.created_at,
            currentStreak: streak?.current_streak || 0,
            skillsCount: Array.isArray(skills?.areas_of_expertise) ? skills.areas_of_expertise.length : 0
          };
        })
      );

      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrowthMetrics = async () => {
    try {
      // Fetch study logs grouped by month
      const { data: logs, error } = await supabase
        .from('study_logs')
        .select('created_at, duration_minutes')
        .eq('user_id', selectedStudent)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Generate monthly data
      const monthlyData: { [key: string]: { logs: number; minutes: number } } = {};

      logs?.forEach((log: any) => {
        const date = new Date(log.created_at);
        const month = `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;

        if (!monthlyData[month]) {
          monthlyData[month] = { logs: 0, minutes: 0 };
        }
        monthlyData[month].logs += 1;
        monthlyData[month].minutes += log.duration_minutes || 0;
      });

      // Convert to chart data
      const chartData = Object.entries(monthlyData)
        .sort((a, b) => {
          const [aM, aY] = a[0].split('/').map(Number);
          const [bM, bY] = b[0].split('/').map(Number);
          return aY === bY ? aM - bM : aY - bY;
        })
        .slice(-12) // Last 12 months
        .map(([month, data]) => {
          const consistency = Math.min(100, (data.logs / 30) * 100); // Normalize to 30 days
          const development = Math.min(100, (data.minutes / 1200) * 100); // Normalize to 20 hours
          return {
            month,
            streakConsistency: Math.round(consistency),
            skillDevelopment: Math.round(development)
          };
        });

      setGrowthData(chartData);
    } catch (error) {
      console.error('Error fetching growth metrics:', error);
    }
  };

  const selectedStudentInfo = students.find(s => s.id === selectedStudent);

  return (
    <Card className="bg-neutral-900 border border-neutral-800 col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Long-Term Growth Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-200 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Track student growth beyond academic performance—focus on habits and skill development
          </p>
        </div>

        {/* Student Selector */}
        {students.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Streak: {s.currentStreak}d | Skills: {s.skillsCount})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Student Stats */}
        {selectedStudentInfo && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
              <p className="text-xs text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-emerald-400">{selectedStudentInfo.currentStreak}</p>
              <p className="text-xs text-gray-500">consecutive days</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
              <p className="text-xs text-gray-400">Skills Developed</p>
              <p className="text-2xl font-bold text-purple-400">{selectedStudentInfo.skillsCount}</p>
              <p className="text-xs text-gray-500">areas of expertise</p>
            </div>
          </div>
        )}

        {/* Growth Chart */}
        {growthData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">12-Month Growth Pattern</h4>
            <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#999' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#999' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #404040' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="streakConsistency"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Consistency"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="skillDevelopment"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    name="Skill Growth"
                    dot={{ fill: '#a78bfa', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Growth Insights */}
        {selectedStudentInfo && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-200 font-semibold mb-1">Strength</p>
              <p className="text-sm text-green-300">
                {selectedStudentInfo.currentStreak > 14 ? 'Excellent habit formation' : 'Developing consistency'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-200 font-semibold mb-1">Focus Area</p>
              <p className="text-sm text-blue-300">
                {selectedStudentInfo.skillsCount < 3 ? 'Build diverse skills' : 'Deepen expertise'}
              </p>
            </div>
          </div>
        )}

        {selectedStudent && growthData.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">No growth data available yet</p>
          </div>
        )}

        {!selectedStudent && students.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">No connected students</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
