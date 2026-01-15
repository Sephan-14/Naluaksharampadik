import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AlumniRoadmap {
  id: string;
  title: string;
  description: string;
  targetYear: number;
  academicFocus: string[];
  skillsFocus: string[];
  lessonsLearned: string;
}

export default function RoadmapVault() {
  const { userProfile } = useAuth();
  const [roadmaps, setRoadmaps] = useState<AlumniRoadmap[]>([]);

  useEffect(() => {
    if (userProfile?.role === 'alumni') {
      fetchRoadmaps();
    }
  }, [userProfile]);

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('alumni_roadmaps')
        .select('*')
        .eq('alumni_id', userProfile?.id)
        .order('target_year', { ascending: true });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    }
  };

  return (
    <Card className="bg-neutral-900 border border-neutral-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Roadmap Vault
          </CardTitle>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            + New Roadmap
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roadmaps.length > 0 ? (
            roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="p-4 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{roadmap.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{roadmap.description}</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Year {roadmap.targetYear}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Academic Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {roadmap.academicFocus?.map((focus) => (
                        <Badge key={focus} variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-300 border-0">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Skills Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {roadmap.skillsFocus?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-300 border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {roadmap.lessonsLearned && (
                  <div className="p-3 rounded bg-neutral-700/50 border border-neutral-700 mb-3">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Key Learnings</p>
                    <p className="text-sm text-gray-300">{roadmap.lessonsLearned.substring(0, 100)}...</p>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-purple-400 hover:bg-purple-500/10"
                >
                  View Full Roadmap
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No roadmaps created yet</p>
              <p className="text-sm text-gray-500 mt-1">Share your academic journey with future students</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
