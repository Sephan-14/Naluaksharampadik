import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface RoadmapData {
  title: string;
  description: string;
  target_year: number;
  academic_focus: string[];
  skills_focus: string[];
  key_learnings: string;
}

interface StudentProgress {
  currentYear: number;
  areasOfExpertise: string[];
  studyLogsThisMonth: number;
  currentStreak: number;
}

export default function CompareYearView() {
  const { userProfile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [alumni, setAlumni] = useState<RoadmapData | null>(null);
  const [student, setStudent] = useState<StudentProgress | null>(null);
  const [studentYear, setStudentYear] = useState<number>(0);

  useEffect(() => {
    if (userProfile?.role === 'alumni') {
      fetchConnectedStudents();
    }
  }, [userProfile]);

  const fetchConnectedStudents = async () => {
    try {
      const { data: connections, error } = await supabase
        .from('mentorship_connections')
        .select(`
          mentee_id,
          mentee:mentee_id (id, full_name)
        `)
        .eq('alumni_id', userProfile?.id)
        .eq('status', 'active');

      if (error) throw error;
      setStudents(connections?.map((c: any) => ({ id: c.mentee_id, name: c.mentee?.full_name })) || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchComparisonData = async (studentId: string) => {
    try {
      // Fetch student's current data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('areas_of_expertise, created_at')
        .eq('id', studentId)
        .single();

      if (userError) throw userError;

      // Calculate student's year based on join date
      const joinDate = new Date(userData?.created_at);
      const now = new Date();
      const yearsInProgram = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

      // Fetch study logs this month
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: logs } = await supabase
        .from('study_logs')
        .select('id')
        .eq('user_id', studentId)
        .gte('created_at', monthStart.toISOString());

      // Fetch current streak
      const { data: streak } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', studentId)
        .single();

      setStudent({
        currentYear: yearsInProgram || 1,
        areasOfExpertise: Array.isArray(userData?.areas_of_expertise) ? userData.areas_of_expertise : [],
        studyLogsThisMonth: logs?.length || 0,
        currentStreak: streak?.current_streak || 0
      });
      setStudentYear(yearsInProgram || 1);

      // Fetch alumni's roadmap for the same year
      const { data: roadmaps, error: roadmapError } = await supabase
        .from('alumni_roadmaps')
        .select('*')
        .eq('alumni_id', userProfile?.id)
        .eq('target_year', yearsInProgram || 1)
        .order('created_at', { ascending: false })
        .limit(1);

      if (roadmapError) throw roadmapError;
      setAlumni(roadmaps?.[0] || null);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
  };

  const handleStudentSelect = async (studentId: string) => {
    setSelectedStudent(studentId);
    await fetchComparisonData(studentId);
  };

  const getSkillGaps = () => {
    if (!alumni || !student) return [];
    const alumniSkills = alumni.skills_focus || [];
    const studentSkills = student.areasOfExpertise || [];
    return alumniSkills.filter(skill => !studentSkills.includes(skill));
  };

  const skillGaps = getSkillGaps();

  return (
    <Card className="bg-neutral-900 border border-neutral-800 col-span-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-blue-400" />
          Compare-Year View
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-200">
            See your roadmap from their year and compare with their current progress
          </p>
        </div>

        {/* Student Selector */}
        {students.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Comparison View */}
        {selectedStudent && student && (
          <>
            {/* Timeline Header */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
                <p className="text-xs text-gray-400 mb-1">Student's Current Year</p>
                <p className="text-2xl font-bold text-blue-400">{student.currentYear}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {student.currentYear === 1 ? 'First year student' : `${student.currentYear} years in program`}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
                <p className="text-xs text-gray-400 mb-1">Your Year {student.currentYear} Roadmap</p>
                <p className="text-lg font-semibold text-purple-400">
                  {alumni ? alumni.title : 'No roadmap for this year'}
                </p>
              </div>
            </div>

            {alumni && (
              <>
                {/* Academic Focus Comparison */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300">Academic Focus</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                      <p className="text-xs text-gray-400 mb-2">Your Focus (Year {studentYear})</p>
                      <div className="flex flex-wrap gap-2">
                        {alumni.academic_focus && alumni.academic_focus.length > 0 ? (
                          alumni.academic_focus.map((focus: string) => (
                            <Badge key={focus} className="bg-purple-600/30 text-purple-300 border border-purple-500/30">
                              {focus}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No specific focus</p>
                        )}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                      <p className="text-xs text-gray-400 mb-2">Student's Current Progress</p>
                      <p className="text-xs text-gray-400">
                        {student.studyLogsThisMonth} study logs this month
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        🔥 Streak: {student.currentStreak} days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Focus Comparison */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300">Skills Development</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                      <p className="text-xs text-gray-400 mb-2">Skills You Developed</p>
                      <div className="flex flex-wrap gap-2">
                        {alumni.skills_focus && alumni.skills_focus.length > 0 ? (
                          alumni.skills_focus.map((skill: string) => (
                            <Badge key={skill} className="bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                      <p className="text-xs text-gray-400 mb-2">Student's Current Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {student.areasOfExpertise.length > 0 ? (
                          student.areasOfExpertise.map((skill: string) => (
                            <Badge key={skill} className="bg-blue-600/30 text-blue-300 border border-blue-500/30">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No skills yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Gaps */}
                {skillGaps.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-200 font-semibold mb-2">Gap Areas to Focus On</p>
                    <div className="flex flex-wrap gap-2">
                      {skillGaps.map((skill: string) => (
                        <Badge key={skill} className="bg-amber-600/30 text-amber-300 border border-amber-500/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Learnings */}
                <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                  <p className="text-xs text-gray-400 mb-2">Your Key Learnings from Year {studentYear}</p>
                  <p className="text-sm text-gray-300">{alumni.key_learnings}</p>
                </div>
              </>
            )}

            {!alumni && (
              <div className="p-4 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
                <p className="text-gray-400 text-sm">
                  No roadmap created for Year {student.currentYear}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Create a roadmap in your Roadmap Vault to share guidance with Year {student.currentYear} students
                </p>
              </div>
            )}
          </>
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
