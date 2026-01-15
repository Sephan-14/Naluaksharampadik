
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { CheckCircle, Circle, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Simple Progress component since I missed it in UI batch
function SimpleProgress({ value, className }: { value: number, className?: string }) {
    return (
        <div className={`h-2 w-full bg-secondary rounded-full overflow-hidden ${className}`}>
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${value}%` }} />
        </div>
    )
}

interface Task {
    id: string;
    day: number;
    title: string;
    completed: boolean;
}

interface Plan {
    id: string;
    subject: string;
    examDate: string;
    status: 'on-track' | 'behind' | 'completed';
    progress: number;
    totalTasks: number;
    completedTasks: number;
    roadmap: Task[];
}

export function CatchUpTab() {
    const [plans, setPlans] = useState<Plan[]>([
        {
            id: '1',
            subject: 'Engineering Mathematics III',
            examDate: '2026-05-15',
            status: 'behind',
            progress: 35,
            totalTasks: 20,
            completedTasks: 7,
            roadmap: [
                { id: 't1', day: 1, title: 'Laplace Transforms Basics', completed: true },
                { id: 't2', day: 2, title: 'Inverse Laplace Transforms', completed: true },
                { id: 't3', day: 3, title: 'Fourier Series', completed: false },
                { id: 't4', day: 4, title: 'Partial Differential Equations', completed: false },
            ]
        }
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newDate, setNewDate] = useState('');

    const handleCreatePlan = () => {
        if (!newSubject || !newDate) return;

        const newPlan: Plan = {
            id: Date.now().toString(),
            subject: newSubject,
            examDate: newDate,
            status: 'on-track',
            progress: 0,
            totalTasks: 14, // Mock
            completedTasks: 0,
            roadmap: Array.from({ length: 5 }, (_, i) => ({
                id: `new-${i}`,
                day: i + 1,
                title: `Day ${i + 1} Study Topic`,
                completed: false
            }))
        };

        setPlans([...plans, newPlan]);
        setIsCreateOpen(false);
        setNewSubject('');
        setNewDate('');
    };

    const toggleTask = (planId: string, taskId: string) => {
        setPlans(plans.map(plan => {
            if (plan.id !== planId) return plan;

            const newRoadmap = plan.roadmap.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );

            const completedCount = newRoadmap.filter(t => t.completed).length;
            const progress = Math.round((completedCount / plan.totalTasks) * 100); // normalized to total tasks

            return {
                ...plan,
                roadmap: newRoadmap,
                completedTasks: completedCount,
                progress: Math.min(progress, 100) // Simple mock math
            };
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Catch-Up Plans</h2>
                    <p className="text-muted-foreground">Your personalized roadmap to academic recovery.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>Create New Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Catch-Up Plan</DialogTitle>
                            <DialogDescription>
                                We'll generate a daily roadmap based on your exam date.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    placeholder="e.g. Data Structures"
                                    value={newSubject}
                                    onChange={e => setNewSubject(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Exam Date</Label>
                                <Input
                                    type="date"
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleCreatePlan} disabled={!newSubject || !newDate}>
                                Generate Roadmap
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {plans.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="flex justify-center mb-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold">No active catch-up plans</h3>
                        <p className="text-muted-foreground mb-4">Start a plan to get back on track!</p>
                        <Button onClick={() => setIsCreateOpen(true)}>Create Plan</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {plans.map(plan => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{plan.subject}</CardTitle>
                                        <CardDescription>Target: {new Date(plan.examDate).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge variant={plan.status === 'on-track' ? 'default' : 'destructive'}>
                                        {plan.status === 'on-track' ? 'On Track' : 'Behind Schedule'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress ({plan.progress}%)</span>
                                        <span>{plan.completedTasks} / {plan.totalTasks} tasks</span>
                                    </div>
                                    <SimpleProgress value={plan.progress} />
                                </div>

                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    <div className="space-y-4">
                                        {plan.roadmap.map(task => (
                                            <div key={task.id} className="flex items-center gap-3 group">
                                                <button onClick={() => toggleTask(plan.id, task.id)} className="text-muted-foreground hover:text-primary transition-colors">
                                                    {task.completed ?
                                                        <CheckCircle className="h-5 w-5 text-green-500" /> :
                                                        <Circle className="h-5 w-5" />
                                                    }
                                                </button>
                                                <div className={task.completed ? 'opacity-50 line-through transition-all' : ''}>
                                                    <p className="text-sm font-medium">Day {task.day}: {task.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
