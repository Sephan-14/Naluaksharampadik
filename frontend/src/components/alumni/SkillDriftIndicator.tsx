import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { TrendingDown, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const suggestedSkills = [
  'Leadership',
  'Communication',
  'Time Management',
  'Problem Solving',
  'Collaboration',
  'Critical Thinking',
  'Emotional Intelligence',
  'Adaptability',
  'Creativity',
  'Technical Writing'
];

interface SkillRecommendation {
  id: string;
  skillName: string;
  resourceUrl: string;
  actionItem: string;
  priority: 'high' | 'medium' | 'low';
}

export default function SkillDriftIndicator() {
  const { userProfile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [newRecommendation, setNewRecommendation] = useState<{
    skill: string;
    resource: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>({
    skill: '',
    resource: '',
    action: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (userProfile?.role === 'alumni') {
      fetchConnectedStudents();
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedStudent) {
      fetchRecommendations();
    }
  }, [selectedStudent]);

  const fetchConnectedStudents = async () => {
    try {
      const { data: connections, error } = await supabase
        .from('mentorship_connections')
        .select(`
          mentee_id,
          mentee:mentee_id (id, full_name)
        `)
        .eq(userProfile?.role === 'mentor' ? 'mentor_id' : 'alumni_id', userProfile?.id)
        .eq('status', 'active');

      if (error) throw error;
      setStudents(connections?.map((c: any) => ({ id: c.mentee_id, name: c.mentee?.full_name })) || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_recommendations')
        .select('*')
        .eq('mentee_id', selectedStudent)
        .eq('alumni_id', userProfile?.id);

      if (error) throw error;
      setRecommendations(data?.map((r: any) => ({
        id: r.id,
        skillName: r.skill_name,
        resourceUrl: r.resource_url,
        actionItem: r.action_item,
        priority: r.priority
      })) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleAddRecommendation = async () => {
    if (!selectedStudent || !newRecommendation.skill) return;

    try {
      const { error } = await supabase
        .from('skill_recommendations')
        .insert({
          alumni_id: userProfile?.id,
          mentee_id: selectedStudent,
          skill_name: newRecommendation.skill,
          resource_url: newRecommendation.resource,
          action_item: newRecommendation.action,
          priority: newRecommendation.priority
        });

      if (error) throw error;
      setNewRecommendation({ skill: '', resource: '', action: '', priority: 'medium' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding recommendation:', error);
    }
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    low: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };

  return (
    <Card className="bg-neutral-900 border border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-purple-400" />
          Skill Drift Indicator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-purple-200">
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Help students develop non-academic skills critical for long-term success
          </p>
        </div>

        {/* Student Selector */}
        {students.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Select Student</Label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Add Recommendation Form */}
        {isAdding && selectedStudent && (
          <div className="space-y-3 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <h4 className="font-semibold text-white">Suggest a Skill</h4>

            <div className="space-y-2">
              <Label className="text-sm">Skill to Develop</Label>
              <select
                value={newRecommendation.skill}
                onChange={(e) => setNewRecommendation({ ...newRecommendation, skill: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm"
              >
                <option value="">Select or type skill...</option>
                {suggestedSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Resource Link (optional)</Label>
              <Input
                placeholder="https://..."
                value={newRecommendation.resource}
                onChange={(e) => setNewRecommendation({ ...newRecommendation, resource: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-gray-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Action Item</Label>
              <Input
                placeholder="What specifically should they do?"
                value={newRecommendation.action}
                onChange={(e) => setNewRecommendation({ ...newRecommendation, action: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-gray-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Priority</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    onClick={() => setNewRecommendation({ ...newRecommendation, priority: p })}
                    size="sm"
                    variant={newRecommendation.priority === p ? 'default' : 'outline'}
                    className={newRecommendation.priority === p ? priorityColors[p] : ''}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddRecommendation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={!newRecommendation.skill}
              >
                Add Recommendation
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">Your Recommendations</p>
            {!isAdding && selectedStudent && (
              <Button
                onClick={() => setIsAdding(true)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                + Add
              </Button>
            )}
          </div>

          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h5 className="font-semibold text-white">{rec.skillName}</h5>
                    <p className="text-sm text-gray-400">{rec.actionItem}</p>
                  </div>
                  <Badge className={priorityColors[rec.priority]}>
                    {rec.priority}
                  </Badge>
                </div>
                {rec.resourceUrl && (
                  <a
                    href={rec.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 inline-block"
                  >
                    View Resource →
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No recommendations yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
