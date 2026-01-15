
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Flame, TrendingUp, Clock, BookOpen, Trophy, ThumbsUp } from 'lucide-react';

interface StudyLogTabProps {
    currentStreak: number;
    setCurrentStreak: (streak: number) => void;
}

interface StudyLog {
    id: string;
    subject: string;
    duration: number;
    notes: string;
    date: Date;
    likes: number;
}

export function StudyLogTab({ currentStreak, setCurrentStreak }: StudyLogTabProps) {
    const [logs, setLogs] = useState<StudyLog[]>([
        {
            id: '1',
            subject: 'Data Structures - Trees',
            duration: 90,
            notes: 'Completed binary tree implementation and practiced traversal algorithms',
            date: new Date(),
            likes: 12,
        },
        {
            id: '2',
            subject: 'Digital Electronics - Flip Flops',
            duration: 60,
            notes: 'Studied SR, JK, and D flip-flops. Made truth tables and timing diagrams.',
            date: new Date(Date.now() - 86400000),
            likes: 8,
        },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');

    const [communityLogs] = useState<StudyLog[]>([
        {
            id: 'c1',
            subject: 'Machine Learning - Neural Networks',
            duration: 120,
            notes: 'Built my first neural network from scratch! Finally understanding backpropagation 🎉',
            date: new Date(),
            likes: 34,
        },
        {
            id: 'c2',
            subject: 'Thermodynamics - Heat Transfer',
            duration: 75,
            notes: 'Solved 15 problems on conduction and convection. Feeling more confident!',
            date: new Date(),
            likes: 19,
        },
        {
            id: 'c3',
            subject: 'Operating Systems - Scheduling',
            duration: 45,
            notes: 'Compared FCFS, SJF, and Round Robin algorithms. Making charts helped a lot.',
            date: new Date(),
            likes: 23,
        },
    ]);

    const totalHours = logs.reduce((sum, log) => sum + log.duration, 0) / 60;
    const thisWeekLogs = logs.filter(
        (log) => new Date().getTime() - log.date.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    const handleAddLog = () => {
        if (subject && duration) {
            const newLog: StudyLog = {
                id: Date.now().toString(),
                subject,
                duration: parseInt(duration),
                notes,
                date: new Date(),
                likes: 0,
            };
            setLogs([newLog, ...logs]);
            setCurrentStreak(currentStreak + 1);

            // Reset form
            setSubject('');
            setDuration('');
            setNotes('');
            setIsDialogOpen(false);
        }
    };

    const handleLike = (id: string) => {
        setLogs(
            logs.map((log) =>
                log.id === id ? { ...log, likes: log.likes + 1 } : log
            )
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Study Log Section */}
            <div className="lg:col-span-2 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-lg">
                                    <Flame className="size-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Current Streak</p>
                                    <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                    <Clock className="size-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Hours</p>
                                    <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500 p-2 rounded-lg">
                                    <TrendingUp className="size-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">This Week</p>
                                    <p className="text-2xl font-bold text-purple-600">{thisWeekLogs} logs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* My Study Logs */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="size-5 text-indigo-600" />
                                    My Study Logs
                                </CardTitle>
                                <CardDescription>Your daily accountability tracker</CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                        <Plus className="size-4 mr-2" />
                                        Add Log
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Log Your Study Session</DialogTitle>
                                        <DialogDescription>
                                            Share your progress with the community and maintain your streak!
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject/Topic</Label>
                                            <Input
                                                id="subject"
                                                placeholder="e.g., Data Structures - Arrays"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (minutes)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                placeholder="60"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">What did you accomplish?</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Share your progress, breakthroughs, or challenges..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddLog}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                            disabled={!subject || !duration}
                                        >
                                            Post Study Log
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <Card key={log.id} className="border-l-4 border-l-indigo-600">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-semibold text-lg">{log.subject}</h4>
                                                    <Badge variant="secondary" className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {log.duration} min
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {log.date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                {log.notes && (
                                                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{log.notes}</p>
                                                )}
                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleLike(log.id)}
                                                        className="text-gray-600"
                                                    >
                                                        <ThumbsUp className="size-4 mr-1" />
                                                        {log.likes}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Community Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-600" />
                        Community Feed
                    </CardTitle>
                    <CardDescription>Get inspired by your peers' progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-4">
                            {communityLogs.map((log) => (
                                <Card key={log.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-3">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h5 className="font-semibold text-sm">{log.subject}</h5>
                                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {log.duration}m
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-600">{log.notes}</p>
                                            <div className="flex items-center justify-between pt-1">
                                                <p className="text-xs text-gray-500">
                                                    {log.date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <ThumbsUp className="size-3" />
                                                    {log.likes}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
