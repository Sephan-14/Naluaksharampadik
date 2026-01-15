import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Target, Users, TrendingUp, Activity, LogOut } from 'lucide-react';
import { MentorshipTab } from '../components/MentorshipTab';
import { StudyLogTab } from '../components/StudyLogTab';
import { CatchUpTab } from '../components/CatchUpTab';
import { ProfileTab } from '../components/ProfileTab';
import { CommunityFeedTab } from '../components/CommunityFeedTab';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [stats, setStats] = useState({
    mentorsCount: 0,
    studyLogsToday: 0,
    catchUpPlansCount: 0
  });

  useEffect(() => {
    fetchDashboardStats();
    if (userProfile?.id) {
      fetchUserStreak();
    }
  }, [userProfile]);

  const fetchDashboardStats = async () => {
    try {
      // Count active mentors
      const { count: mentorsCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .in('role', ['mentor', 'alumni']);

      // Count study logs today
      const today = new Date().toISOString().split('T')[0];
      const { count: studyLogsToday } = await supabase
        .from('study_logs')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      // Count active catch-up plans
      const { count: catchUpPlansCount } = await supabase
        .from('catch_up_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');

      setStats({
        mentorsCount: mentorsCount || 0,
        studyLogsToday: studyLogsToday || 0,
        catchUpPlansCount: catchUpPlansCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchUserStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', userProfile.id)
        .single();

      if (error) throw error;
      if (data) {
        setCurrentStreak(data.current_streak);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      {/* Header */}
      <header className="bg-neutral-900/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-fuchsia-500/30">
                <GraduationCap className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Naalu Aksharam Padikk
                </h1>
                <p className="text-sm text-gray-300">Connect. Learn. Grow Together.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex text-right flex-col">
                <span className="font-semibold text-sm text-gray-100">{userProfile.full_name}</span>
                <span className="text-xs text-gray-400 capitalize">{userProfile.role}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-200 hover:bg-neutral-800">
                <LogOut className="h-5 w-5" />
              </Button>
              <Card className="border border-amber-500/30 bg-neutral-900 hidden sm:block">
                <CardContent className="p-2 px-3 flex items-center gap-2 text-amber-100">
                  <Target className="size-5 text-amber-400" />
                  <div>
                    <p className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Streak</p>
                    <p className="text-lg font-bold text-amber-400 leading-none">{currentStreak} days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-neutral-800 bg-neutral-900/80 shadow-lg shadow-indigo-500/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Active Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="size-8 text-indigo-300" />
                <p className="text-3xl font-bold text-gray-100">{stats.mentorsCount}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Ready to help you succeed</p>
            </CardContent>
          </Card>

          <Card className="border border-neutral-800 bg-neutral-900/80 shadow-lg shadow-emerald-500/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Study Logs Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="size-8 text-emerald-300" />
                <p className="text-3xl font-bold text-gray-100">{stats.studyLogsToday}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Students staying accountable</p>
            </CardContent>
          </Card>

          <Card className="border border-neutral-800 bg-neutral-900/80 shadow-lg shadow-fuchsia-500/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Catch-Up Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Target className="size-8 text-fuchsia-300" />
                <p className="text-3xl font-bold text-gray-100">{stats.catchUpPlansCount}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">It's never too late to start</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="mentorship" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-neutral-900 border border-neutral-800 shadow-sm rounded-lg">
            <TabsTrigger value="mentorship" className="flex items-center gap-2 py-3 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-200">
              <Users className="size-4" />
              <span className="hidden sm:inline">Mentorship</span>
            </TabsTrigger>
            <TabsTrigger value="study-log" className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-200">
              <TrendingUp className="size-4" />
              <span className="hidden sm:inline">Study Log</span>
            </TabsTrigger>
            <TabsTrigger value="catch-up" className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200">
              <Target className="size-4" />
              <span className="hidden sm:inline">Catch-Up</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2 py-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200">
              <Activity className="size-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 py-3 data-[state=active]:bg-neutral-800 data-[state=active]:text-gray-100">
              <GraduationCap className="size-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentorship" className="mt-6">
            <MentorshipTab userRole={userProfile.role} />
          </TabsContent>

          <TabsContent value="study-log" className="mt-6">
            <StudyLogTab currentStreak={currentStreak} setCurrentStreak={setCurrentStreak} />
          </TabsContent>

          <TabsContent value="catch-up" className="mt-6">
            <CatchUpTab />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <CommunityFeedTab />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab userRole={userProfile.role} setUserRole={() => {}} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
