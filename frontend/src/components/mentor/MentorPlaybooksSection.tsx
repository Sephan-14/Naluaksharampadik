import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BookMarked, Plus, Trash2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Playbook {
  id: string;
  title: string;
  category: string;
  guidance: string;
  createdAt: string;
}

interface CreateForm {
  title: string;
  category: string;
  guidance: string;
}

const categories = [
  'Time Management',
  'Study Techniques',
  'Motivation',
  'Exam Prep',
  'Project Management',
  'Learning Strategies',
  'Work-Life Balance',
  'Leadership'
];

export default function MentorPlaybooksSection() {
  const { userProfile } = useAuth();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<CreateForm>({
    title: '',
    category: '',
    guidance: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.role === 'mentor') {
      fetchPlaybooks();
    }
  }, [userProfile]);

  const fetchPlaybooks = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_playbooks')
        .select('*')
        .eq('mentor_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaybooks(data?.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        guidance: p.guidance,
        createdAt: p.created_at
      })) || []);
    } catch (error) {
      console.error('Error fetching playbooks:', error);
    }
  };

  const handleCreatePlaybook = async () => {
    if (!form.title || !form.category || !form.guidance) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('mentor_playbooks')
        .insert({
          mentor_id: userProfile?.id,
          title: form.title,
          category: form.category,
          guidance: form.guidance
        });

      if (error) throw error;

      setForm({ title: '', category: '', guidance: '' });
      setIsAdding(false);
      await fetchPlaybooks();
    } catch (error) {
      console.error('Error creating playbook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaybook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mentor_playbooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlaybooks(playbooks.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting playbook:', error);
    }
  };

  const handleDuplicatePlaybook = async (playbook: Playbook) => {
    try {
      const { error } = await supabase
        .from('mentor_playbooks')
        .insert({
          mentor_id: userProfile?.id,
          title: `${playbook.title} (Copy)`,
          category: playbook.category,
          guidance: playbook.guidance
        });

      if (error) throw error;
      await fetchPlaybooks();
    } catch (error) {
      console.error('Error duplicating playbook:', error);
    }
  };

  return (
    <Card className="bg-neutral-900 border border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-amber-400" />
          Mentor Playbooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-200">
            Create reusable guidance templates to quickly support students facing similar challenges
          </p>
        </div>

        {/* Add Playbook Form */}
        {isAdding ? (
          <div className="space-y-3 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <h4 className="font-semibold text-white">New Playbook</h4>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Title</label>
              <Input
                placeholder="e.g., Exam Prep for Core Subjects"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Guidance</label>
              <textarea
                placeholder="Write the detailed guidance students should follow..."
                value={form.guidance}
                onChange={(e) => setForm({ ...form, guidance: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder:text-gray-500 text-sm h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreatePlaybook}
                disabled={isLoading || !form.title || !form.category || !form.guidance}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? 'Creating...' : 'Create Playbook'}
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
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Playbook
          </Button>
        )}

        {/* Playbooks List */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-300">
            Your Playbooks ({playbooks.length})
          </p>

          {playbooks.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {playbooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className="p-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">{playbook.title}</h5>
                      <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30 text-xs mt-1">
                        {playbook.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        onClick={() => handleDuplicatePlaybook(playbook)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePlaybook(playbook.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                    {playbook.guidance}
                  </p>

                  <p className="text-xs text-gray-500">
                    Created {new Date(playbook.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No playbooks created yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Start building your playbook library to help students consistently
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700">
          <p className="text-xs text-gray-400 font-semibold mb-2">💡 Playbook Tips:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Be specific and actionable in your guidance</li>
            <li>• Use categories to organize by topic</li>
            <li>• Duplicate and customize for different students</li>
            <li>• Update playbooks based on student feedback</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
