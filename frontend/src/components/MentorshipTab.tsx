
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Search, MessageCircle, Star, CheckCircle, Users } from 'lucide-react';

interface MentorshipTabProps {
    userRole: 'junior' | 'senior';
}

interface Mentor {
    id: string;
    name: string;
    year: string;
    department: string;
    expertise: string[];
    rating: number;
    studentsHelped: number;
    availability: 'online' | 'busy' | 'offline';
    verified: boolean;
}

interface Connection {
    id: string;
    name: string;
    role: 'mentor' | 'mentee';
    lastMessage: string;
    unread: number;
    department: string;
}

const mockMentors: Mentor[] = [
    {
        id: '1',
        name: 'Arjun Krishnan',
        year: 'Final Year',
        department: 'Computer Science',
        expertise: ['Data Structures', 'Algorithms', 'Web Development'],
        rating: 4.8,
        studentsHelped: 23,
        availability: 'online',
        verified: true,
    },
    {
        id: '2',
        name: 'Priya Sharma',
        year: '3rd Year',
        department: 'Electronics',
        expertise: ['Digital Electronics', 'Microprocessors', 'Circuit Design'],
        rating: 4.9,
        studentsHelped: 31,
        availability: 'online',
        verified: true,
    },
    {
        id: '3',
        name: 'Rahul Menon',
        year: 'Final Year',
        department: 'Mechanical',
        expertise: ['Thermodynamics', 'Fluid Mechanics', 'CAD'],
        rating: 4.7,
        studentsHelped: 18,
        availability: 'busy',
        verified: true,
    },
    {
        id: '4',
        name: 'Sneha Patel',
        year: '3rd Year',
        department: 'Computer Science',
        expertise: ['Machine Learning', 'Python', 'Mathematics'],
        rating: 4.9,
        studentsHelped: 42,
        availability: 'online',
        verified: true,
    },
];

const mockConnections: Connection[] = [
    {
        id: '1',
        name: 'Arjun Krishnan',
        role: 'mentor',
        lastMessage: 'Sure, I can help you with that algorithm!',
        unread: 2,
        department: 'Computer Science',
    },
    {
        id: '2',
        name: 'Aditya Kumar',
        role: 'mentee',
        lastMessage: 'Thanks for the notes!',
        unread: 0,
        department: 'Computer Science',
    },
];

export function MentorshipTab({ userRole }: MentorshipTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [message, setMessage] = useState('');
    const [connections, setConnections] = useState<Connection[]>(mockConnections);

    const filteredMentors = mockMentors.filter(
        (mentor) =>
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleConnect = () => {
        if (selectedMentor && message) {
            // Add to connections
            const newConnection: Connection = {
                id: selectedMentor.id,
                name: selectedMentor.name,
                role: 'mentor',
                lastMessage: message.substring(0, 50) + '...',
                unread: 0,
                department: selectedMentor.department,
            };
            setConnections([newConnection, ...connections]);
            setMessage('');
            setSelectedMentor(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Find Mentors Section */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5 text-indigo-600" />
                        Find Your Mentor
                    </CardTitle>
                    <CardDescription>
                        Connect with verified seniors who are ready to guide you through your academic journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, department, or expertise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-4">
                            {filteredMentors.map((mentor) => (
                                <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="size-12">
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                                                    {mentor.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold">{mentor.name}</h4>
                                                            {mentor.verified && (
                                                                <CheckCircle className="size-4 text-green-600" />
                                                            )}
                                                            <Badge
                                                                variant={
                                                                    mentor.availability === 'online'
                                                                        ? 'default'
                                                                        : mentor.availability === 'busy'
                                                                            ? 'secondary'
                                                                            : 'outline'
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {mentor.availability}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {mentor.year} • {mentor.department}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold">{mentor.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {mentor.expertise.map((exp) => (
                                                        <Badge key={exp} variant="outline" className="text-xs">
                                                            {exp}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <p className="text-xs text-gray-500">
                                                        Helped {mentor.studentsHelped} students
                                                    </p>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setSelectedMentor(mentor)}
                                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                            >
                                                                <MessageCircle className="size-4 mr-2" />
                                                                Connect
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Connect with {mentor.name}</DialogTitle>
                                                                <DialogDescription>
                                                                    Introduce yourself and explain what you need help with. Be specific to
                                                                    get the best guidance!
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 pt-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="message">Your Message</Label>
                                                                    <Textarea
                                                                        id="message"
                                                                        placeholder="Hi! I'm struggling with [topic] and would really appreciate your guidance. Specifically, I need help with..."
                                                                        value={message}
                                                                        onChange={(e) => setMessage(e.target.value)}
                                                                        rows={5}
                                                                    />
                                                                </div>
                                                                <Button
                                                                    onClick={handleConnect}
                                                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                                    disabled={!message.trim()}
                                                                >
                                                                    Send Connection Request
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
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

            {/* My Connections Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="size-5 text-purple-600" />
                        My Connections
                    </CardTitle>
                    <CardDescription>
                        {userRole === 'junior' ? 'Your mentors and study partners' : 'Students you\'re helping'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-3">
                            {connections.map((connection) => (
                                <Card key={connection.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="size-10">
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                                                    {connection.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-semibold text-sm truncate">{connection.name}</h5>
                                                    {connection.unread > 0 && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            {connection.unread}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600">{connection.department}</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                    {connection.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {connections.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="size-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No connections yet</p>
                                    <p className="text-xs mt-1">Start connecting with mentors!</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
