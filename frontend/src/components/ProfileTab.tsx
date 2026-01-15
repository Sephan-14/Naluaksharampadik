
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Award, BookOpen, Target, Edit, Save, Users } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileTabProps {
    userRole: string;
    setUserRole: (role: string) => void;
}

export function ProfileTab({ userRole: _userRole, setUserRole: _setUserRole }: ProfileTabProps) {
    const { userProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [department, setDepartment] = useState('');
    const [bio, setBio] = useState('');
    const [expertise, setExpertise] = useState<string[]>([]);
    const [expertiseInput, setExpertiseInput] = useState('');

    const [stats, setStats] = useState({
        studyLogs: 0,
        currentStreak: 0,
        totalHours: 0,
        mentorConnections: 0,
    });

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.full_name || '');
            setYear(userProfile.year ? `${userProfile.year} Year` : '');
            setDepartment(userProfile.department || '');
            setBio(userProfile.bio || '');
            setExpertise(userProfile.areas_of_expertise || []);
            fetchUserStats();
        }
    }, [userProfile]);

    const fetchUserStats = async () => {
        if (!userProfile?.id) return;

        try {
            // Fetch study logs count
            const { count: logsCount } = await supabase
                .from('study_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userProfile.id);

            // Fetch current streak
            const { data: streakData } = await supabase
                .from('user_streaks')
                .select('current_streak')
                .eq('user_id', userProfile.id)
                .single();

            // Fetch total study hours
            const { data: hoursData } = await supabase
                .from('study_logs')
                .select('hours_studied')
                .eq('user_id', userProfile.id);

            const totalHours = hoursData?.reduce((sum, log) => sum + (log.hours_studied || 0), 0) || 0;

            // Fetch mentor connections
            const { count: connectionsCount } = await supabase
                .from('mentorship_connections')
                .select('*', { count: 'exact', head: true })
                .or(`mentor_id.eq.${userProfile.id},mentee_id.eq.${userProfile.id}`)
                .eq('status', 'active');

            setStats({
                studyLogs: logsCount || 0,
                currentStreak: streakData?.current_streak || 0,
                totalHours: Math.round(totalHours),
                mentorConnections: connectionsCount || 0,
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: name,
                    year: parseInt(year.replace(' Year', '')) || null,
                    department,
                    bio,
                    areas_of_expertise: expertise
                })
                .eq('id', userProfile?.id);

            if (error) throw error;
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const addExpertise = () => {
        if (expertiseInput.trim() && !expertise.includes(expertiseInput.trim())) {
            setExpertise([...expertise, expertiseInput.trim()]);
            setExpertiseInput('');
        }
    };

    const removeExpertise = (item: string) => {
        setExpertise(expertise.filter(e => e !== item));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info Section */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-neutral-900 border border-neutral-800">
                    <CardHeader className="text-center">
                        <Avatar className="size-24 mx-auto mb-4">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold">
                                {name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        {isEditing ? (
                            <div className="space-y-3">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-neutral-800 border-neutral-700 text-white"
                                />
                                <Input
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    placeholder="e.g., 2nd Year"
                                    className="bg-neutral-800 border-neutral-700 text-white"
                                />
                                <Input
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="bg-neutral-800 border-neutral-700 text-white"
                                />
                            </div>
                        ) : (
                            <>
                                <CardTitle className="text-2xl text-white">{name}</CardTitle>
                                <CardDescription className="text-gray-400">
                                    {year} • {department}
                                </CardDescription>
                            </>
                        )}
                        <div className="flex justify-center gap-2 mt-4">
                            <Badge
                                variant="secondary"
                                className="bg-neutral-800 text-gray-300 capitalize"
                            >
                                {userProfile?.role || 'Student'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <Label className="text-gray-300">Bio</Label>
                                <Input
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="bg-neutral-800 border-neutral-700 text-white"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center">{bio || 'No bio yet'}</p>
                        )}
                        <Button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className={`w-full ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-neutral-800 hover:bg-neutral-700'}`}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="size-4 mr-2" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Edit className="size-4 mr-2" />
                                    Edit Profile
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <Card className="bg-neutral-900 border border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Stats Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-5 text-blue-400" />
                                <span className="text-sm font-medium text-gray-300">Study Logs</span>
                            </div>
                            <span className="font-bold text-blue-400">{stats.studyLogs}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Target className="size-5 text-orange-400" />
                                <span className="text-sm font-medium text-gray-300">Current Streak</span>
                            </div>
                            <span className="font-bold text-orange-400">{stats.currentStreak} days</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Award className="size-5 text-purple-400" />
                                <span className="text-sm font-medium text-gray-300">Total Hours</span>
                            </div>
                            <span className="font-bold text-purple-400">{stats.totalHours}h</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users className="size-5 text-emerald-400" />
                                <span className="text-sm font-medium text-gray-300">Connections</span>
                            </div>
                            <span className="font-bold text-emerald-400">{stats.mentorConnections}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2">
                <Card className="bg-neutral-900 border border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Profile Details</CardTitle>
                        <CardDescription className="text-gray-400">
                            Manage your skills and achievements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="skills" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
                                <TabsTrigger value="skills" className="data-[state=active]:bg-neutral-700 text-gray-300">
                                    Skills & Expertise
                                </TabsTrigger>
                                <TabsTrigger value="achievements" className="data-[state=active]:bg-neutral-700 text-gray-300">
                                    Achievements
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="skills" className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Areas of Expertise</Label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {expertise.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-1 px-3 cursor-pointer hover:bg-indigo-500/20"
                                                onClick={() => isEditing && removeExpertise(skill)}
                                            >
                                                {skill} {isEditing && ' ×'}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <Input
                                                value={expertiseInput}
                                                onChange={(e) => setExpertiseInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                                                placeholder="Add a skill (press Enter)"
                                                className="bg-neutral-800 border-neutral-700 text-white"
                                            />
                                            <Button
                                                onClick={addExpertise}
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
                                    <p className="text-sm text-gray-400">
                                        {isEditing
                                            ? 'Click on skills to remove them or add new ones using the input above.'
                                            : `You have ${expertise.length} skill${expertise.length !== 1 ? 's' : ''} listed. Enable edit mode to modify.`}
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="achievements" className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { id: '1', name: '7-Day Streak', icon: '🔥', earned: stats.currentStreak >= 7 },
                                        { id: '2', name: 'First Study Log', icon: '📚', earned: stats.studyLogs > 0 },
                                        { id: '3', name: 'Helpful Mentor', icon: '🌟', earned: stats.mentorConnections >= 3 },
                                        { id: '4', name: '30-Day Streak', icon: '💪', earned: stats.currentStreak >= 30 },
                                        { id: '5', name: '100 Hours Logged', icon: '⏰', earned: stats.totalHours >= 100 },
                                        { id: '6', name: 'Community Champion', icon: '🏆', earned: false },
                                    ].map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className={`p-4 rounded-lg text-center transition-all ${
                                                achievement.earned
                                                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40'
                                                    : 'bg-neutral-800 border border-neutral-700 opacity-50'
                                            }`}
                                        >
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <div className="text-sm font-medium text-white">{achievement.name}</div>
                                            {achievement.earned && (
                                                <Badge className="mt-2 bg-emerald-600 text-white text-xs">
                                                    Earned
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
