import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { GraduationCap, User, Building2, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
  'Chemical',
  'Biotechnology',
  'Other'
];

const EXPERTISE_OPTIONS = [
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Database Management',
  'System Design',
  'Digital Electronics',
  'Circuit Design',
  'Microprocessors',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Communication Skills',
  'Project Management',
  'Other'
];

export default function CompleteProfile() {
  const { currentUser, refreshUserProfile, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    college: '',
    department: '',
    year: '',
    bio: '',
    areasOfExpertise: [] as string[],
  });

  // Redirect to dashboard if user already has a profile
  useEffect(() => {
    if (userProfile) {
      navigate('/dashboard', { replace: true });
    }
  }, [userProfile, navigate]);

  const handleExpertiseToggle = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.includes(expertise)
        ? prev.areasOfExpertise.filter(e => e !== expertise)
        : [...prev.areasOfExpertise, expertise]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.role || !formData.college || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.role === 'student' && !formData.year) {
      setError('Please select your year');
      return;
    }

    if (formData.areasOfExpertise.length === 0) {
      setError('Please select at least one area of expertise');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            firebase_uid: currentUser?.uid,
            email: currentUser?.email,
            full_name: formData.fullName,
            role: formData.role,
            college: formData.college,
            department: formData.department,
            year: formData.year ? parseInt(formData.year) : null,
            bio: formData.bio || null,
            areas_of_expertise: formData.areasOfExpertise,
            is_verified: false,
          }
        ]);

      if (insertError) throw insertError;

      // Create initial streak record
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', currentUser?.uid)
        .single();

      if (userData) {
        await supabase.from('user_streaks').insert([
          {
            user_id: userData.id,
            current_streak: 0,
            longest_streak: 0,
          }
        ]);
      }

      await refreshUserProfile(currentUser?.uid);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 text-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 bg-neutral-900 border border-neutral-800">
          <CheckCircle className="size-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-50 mb-2">Profile Created!</h2>
          <p className="text-gray-400">Redirecting to your dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-3 rounded-lg shadow-lg shadow-fuchsia-500/30">
              <GraduationCap className="size-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-gray-400 mt-2">Help us personalize your experience</p>
        </div>

        <Card className="shadow-2xl bg-neutral-900 border border-neutral-800">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Tell us about yourself to get connected with the right mentors and peers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="size-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student (Looking for guidance)</SelectItem>
                      <SelectItem value="mentor">Mentor (Ready to help)</SelectItem>
                      <SelectItem value="alumni">Alumni (Sharing experience)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="size-5" />
                  Academic Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="college">College/University *</Label>
                  <Input
                    id="college"
                    placeholder="Enter your college name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year {formData.role === 'student' && '*'}</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      disabled={loading || formData.role === 'alumni'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="size-5" />
                  Areas of Expertise *
                </h3>
                <p className="text-sm text-gray-400">Select topics you're skilled in or interested in learning</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {EXPERTISE_OPTIONS.map(expertise => (
                    <button
                      key={expertise}
                      type="button"
                      onClick={() => handleExpertiseToggle(expertise)}
                      className={`p-2 rounded-lg border-2 text-sm transition-all ${
                        formData.areasOfExpertise.includes(expertise)
                          ? 'border-fuchsia-400 bg-fuchsia-500/10 text-fuchsia-100 font-semibold'
                          : 'border-neutral-700 hover:border-neutral-500 text-gray-100'
                      }`}
                      disabled={loading}
                    >
                      {expertise}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your goals, or what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-lg py-6"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Complete Profile & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
