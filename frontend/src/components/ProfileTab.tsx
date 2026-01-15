
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Award, BookOpen, Target, Edit, Save, Users } from 'lucide-react';

interface ProfileTabProps {
    userRole: 'junior' | 'senior';
    setUserRole: (role: 'junior' | 'senior') => void;
}

export function ProfileTab({ userRole, setUserRole }: ProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Rahul Verma');
    const [year, setYear] = useState('2nd Year');
    const [department, setDepartment] = useState('Computer Science');
    const [bio, setBio] = useState('Passionate about algorithms and web development. Always eager to learn!');
    const [expertise, setExpertise] = useState(['Data Structures', 'Web Development', 'Python']);

    const stats = {
        studyLogs: 45,
        currentStreak: 5,
        totalHours: 87,
        mentorConnections: userRole === 'junior' ? 3 : 12,
    };

    const achievements = [
        { id: '1', name: '7-Day Streak', icon: '🔥', earned: true },
        { id: '2', name: 'First Study Log', icon: '📚', earned: true },
        { id: '3', name: 'Helpful Mentor', icon: '🌟', earned: userRole === 'senior' },
        { id: '4', name: '30-Day Streak', icon: '💪', earned: false },
        { id: '5', name: '100 Hours Logged', icon: '⏰', earned: false },
        { id: '6', name: 'Community Champion', icon: '🏆', earned: false },
    ];

    const handleSave = () => {
        setIsEditing(false);
        // Here you would save to backend
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info Section */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
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
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st Year">1st Year</SelectItem>
                                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                                        <SelectItem value="Final Year">Final Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
                            </div>
                        ) : (
                            <>
                                <CardTitle className="text-2xl">{name}</CardTitle>
                                <CardDescription>
                                    {year} • {department}
                                </CardDescription>
                            </>
                        )}
                        <div className="flex justify-center gap-2 mt-4">
                            <Badge
                                variant={userRole === 'junior' ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setUserRole('junior')}
                            >
                                Junior
                            </Badge>
                            <Badge
                                variant={userRole === 'senior' ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setUserRole('senior')}
                            >
                                Senior / Mentor
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 text-center">{bio}</p>
                        )}
                        <Button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className="w-full"
                            variant={isEditing ? 'default' : 'outline'}
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Stats Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-5 text-blue-600" />
                                <span className="text-sm font-medium">Study Logs</span>
                            </div>
                            <span className="font-bold text-blue-600">{stats.studyLogs}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Target className="size-5 text-orange-600" />
                                <span className="text-sm font-medium">Current Streak</span>
                            </div>
                            <span className="font-bold text-orange-600">{stats.currentStreak} days</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Award className="size-5 text-purple-600" />
                                <span className="text-sm font-medium">Total Hours</span>
                            </div>
                            <span className="font-bold text-purple-600">{stats.totalHours}h</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users className="size-5 text-green-600" />
                                <span className="text-sm font-medium">
                                    {userRole === 'junior' ? 'Mentors' : 'Mentees'}
                                </span>
                            </div>
                            <span className="font-bold text-green-600">{stats.mentorConnections}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2">
                <Tabs defaultValue="achievements" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="achievements">
                            <Award className="size-4 mr-2" />
                            Achievements
                        </TabsTrigger>
                        <TabsTrigger value="expertise">
                            <BookOpen className="size-4 mr-2" />
                            {userRole === 'senior' ? 'My Expertise' : 'Interests'}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Achievements</CardTitle>
                                <CardDescription>Unlock badges by staying consistent and helping others</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {achievements.map((achievement) => (
                                        <Card
                                            key={achievement.id}
                                            className={`text-center p-4 ${achievement.earned
                                                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                                                    : 'bg-gray-50 opacity-50'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <h4 className="font-semibold text-sm">{achievement.name}</h4>
                                            {achievement.earned && (
                                                <Badge variant="secondary" className="mt-2 text-xs">
                                                    Earned
                                                </Badge>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="expertise">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {userRole === 'senior' ? 'Areas of Expertise' : 'Learning Interests'}
                                </CardTitle>
                                <CardDescription>
                                    {userRole === 'senior'
                                        ? 'Topics you can help others with'
                                        : 'Subjects you want to focus on'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <Label>Add your expertise/interests (comma-separated)</Label>
                                        <Input
                                            value={expertise.join(', ')}
                                            onChange={(e) => setExpertise(e.target.value.split(',').map((s) => s.trim()))}
                                            placeholder="e.g., Data Structures, Web Development, Python"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {expertise.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {userRole === 'senior' && (
                                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                        <h4 className="font-semibold text-indigo-900 mb-2">Mentor Status</h4>
                                        <p className="text-sm text-indigo-700">
                                            As a senior member, you're making a real difference! You've helped{' '}
                                            <span className="font-bold">{stats.mentorConnections} students</span> on their
                                            academic journey.
                                        </p>
                                    </div>
                                )}

                                {userRole === 'junior' && (
                                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-2">Keep Growing!</h4>
                                        <p className="text-sm text-purple-700">
                                            You're connected with <span className="font-bold">{stats.mentorConnections} mentors</span>.
                                            Don't hesitate to reach out whenever you need guidance!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
