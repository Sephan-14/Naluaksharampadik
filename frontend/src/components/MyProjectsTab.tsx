import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { FolderOpen, Plus, ExternalLink, Edit, Trash2, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  created_at: string;
}

export function MyProjectsTab() {
  const { userProfile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    project_url: '',
    github_url: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [userProfile?.id]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('student_projects')
        .select('*')
        .eq('user_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      user_id: userProfile?.id,
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      project_url: formData.project_url || null,
      github_url: formData.github_url || null
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('student_projects')
          .update(projectData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_projects')
          .insert(projectData);

        if (error) throw error;
      }

      setFormData({ title: '', description: '', technologies: '', project_url: '', github_url: '' });
      setIsAdding(false);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      project_url: project.project_url || '',
      github_url: project.github_url || ''
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('student_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">My Projects</h2>
          <p className="text-gray-400">Showcase your work to mentors and fellow students</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="bg-neutral-900 border border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Project Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E-Commerce Website"
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300">Technologies (comma-separated)</Label>
                <Input
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  required
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Project URL (optional)</Label>
                <Input
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://myproject.com"
                  type="url"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">GitHub URL (optional)</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username/project"
                  type="url"
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingId ? 'Update Project' : 'Add Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ title: '', description: '', technologies: '', project_url: '', github_url: '' });
                  }}
                  className="border-neutral-700 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 && !isAdding ? (
        <Card className="bg-neutral-900 border border-neutral-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-center">No projects yet. Start showcasing your work!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(project)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(project.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-neutral-800 text-gray-300">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {project.project_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-neutral-700 text-gray-300 hover:bg-neutral-800"
                      onClick={() => window.open(project.project_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-neutral-700 text-gray-300 hover:bg-neutral-800"
                      onClick={() => window.open(project.github_url, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Added {new Date(project.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
