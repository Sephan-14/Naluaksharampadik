
import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Clock, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { Button } from './ui/button';

export function CommunityFeedTab() {
    const [posts, setPosts] = useState([
        {
            id: '1',
            user: 'Aditya Kumar',
            avatar: 'AK',
            subject: 'Digital Electronics',
            topic: 'Mastered K-Maps today! 🚀',
            description: 'Spent 2 hours solving Karnaugh maps. Finally understanding grouping logic.',
            duration: 120,
            likes: 15,
            comments: 3,
            timeAgo: '2h ago'
        },
        {
            id: '2',
            user: 'Sarah Lee',
            avatar: 'SL',
            subject: 'Data Structures',
            topic: 'Trees Traversal',
            description: 'Implemented Inorder, Preorder, and Postorder traversal in C++. Recursion is tricky!',
            duration: 90,
            likes: 24,
            comments: 5,
            timeAgo: '4h ago'
        }
    ]);

    const handleLike = (id: string) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Community Feed</h2>
                <p className="text-muted-foreground">See what others are learning and stay inspired.</p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Community is quiet right now. Be the first to post!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map(post => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar>
                                    <AvatarFallback>{post.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{post.user}</span>
                                    <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg">{post.topic}</h3>
                                        <Badge variant="secondary" className="flex gap-1 items-center">
                                            <Clock className="w-3 h-3" /> {post.duration}m
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
                                        Subject: {post.subject}
                                    </p>
                                </div>
                                <p className="text-sm">{post.description}</p>

                                <div className="flex gap-4 pt-2 border-t mt-4">
                                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleLike(post.id)}>
                                        <ThumbsUp className="w-4 h-4" /> {post.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <MessageSquare className="w-4 h-4" /> {post.comments}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
