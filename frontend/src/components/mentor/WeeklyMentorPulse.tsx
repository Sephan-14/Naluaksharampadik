import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PulseCheckin {
  studentId: string;
  studentName: string;
  status: 'on_track' | 'concern' | 'critical';
  notes: string;
}

const statusConfig = {
  on_track: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'On Track' },
  concern: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Concern' },
  critical: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' }
};

export default function WeeklyMentorPulse() {
  const { userProfile } = useAuth();
  const [checkins, setCheckins] = useState<PulseCheckin[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenteesList();
  }, [userProfile]);

  const fetchMenteesList = async () => {
    try {
      const { data: connections, error } = await supabase
        .from('mentorship_connections')
        .select(`
          mentee_id,
          mentee:mentee_id (id, full_name)
        `)
        .eq('mentor_id', userProfile?.id)
        .eq('status', 'active');

      if (error) throw error;

      const studentList = connections?.map((conn: any) => ({
        id: conn.mentee_id,
        name: conn.mentee?.full_name
      })) || [];

      setCheckins(
        studentList.map((s: any) => ({
          studentId: s.id,
          studentName: s.name,
          status: 'on_track' as const,
          notes: ''
        }))
      );
    } catch (error) {
      console.error('Error fetching mentees:', error);
    }
  };

  const handleStatusChange = (studentId: string, status: 'on_track' | 'concern' | 'critical') => {
    setCheckins(checkins.map(c => 
      c.studentId === studentId ? { ...c, status } : c
    ));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setCheckins(checkins.map(c =>
      c.studentId === studentId ? { ...c, notes } : c
    ));
  };

  const handleSaveCheckin = async (checkin: PulseCheckin) => {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const { error } = await supabase
        .from('mentor_pulse_checkins')
        .upsert({
          mentor_id: userProfile?.id,
          mentee_id: checkin.studentId,
          status: checkin.status,
          notes: checkin.notes || null,
          week_starting: weekStart.toISOString().split('T')[0]
        });

      if (error) throw error;
      setEditingId(null);
    } catch (error) {
      console.error('Error saving checkin:', error);
    }
  };

  const saveAllCheckins = async () => {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      await Promise.all(
        checkins.map(checkin =>
          supabase.from('mentor_pulse_checkins').upsert({
            mentor_id: userProfile?.id,
            mentee_id: checkin.studentId,
            status: checkin.status,
            notes: checkin.notes || null,
            week_starting: weekStart.toISOString().split('T')[0]
          })
        )
      );
    } catch (error) {
      console.error('Error saving all checkins:', error);
    }
  };

  return (
    <Card className="bg-neutral-900 border border-neutral-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Weekly Mentor Pulse
          </CardTitle>
          <Button
            onClick={saveAllCheckins}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkins.map((checkin) => {
            const config = statusConfig[checkin.status];
            const Icon = config.icon;
            const isEditing = editingId === checkin.studentId;

            return (
              <div
                key={checkin.studentId}
                className="p-4 rounded-lg bg-neutral-800 border border-neutral-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{checkin.studentName}</h4>
                    <p className="text-xs text-gray-400">This week's status</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    {/* Status Buttons */}
                    <div className="flex gap-2">
                      {(['on_track', 'concern', 'critical'] as const).map((status) => (
                        <Button
                          key={status}
                          onClick={() => handleStatusChange(checkin.studentId, status)}
                          size="sm"
                          variant={checkin.status === status ? 'default' : 'outline'}
                          className={`flex-1 ${
                            checkin.status === status
                              ? statusConfig[status].bg + ' ' + statusConfig[status].color
                              : ''
                          }`}
                        >
                          {statusConfig[status].label}
                        </Button>
                      ))}
                    </div>

                    {/* Notes */}
                    <Textarea
                      placeholder="Add optional notes about this student's progress..."
                      value={checkin.notes}
                      onChange={(e) => handleNotesChange(checkin.studentId, e.target.value)}
                      className="bg-neutral-700 border-neutral-600 text-white placeholder:text-gray-500 text-sm"
                      rows={2}
                    />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveCheckin(checkin)}
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <Badge className={`${config.bg} ${config.color} border-0`}>
                        {config.label}
                      </Badge>
                      {checkin.notes && (
                        <p className="text-xs text-gray-400 italic">{checkin.notes}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => setEditingId(checkin.studentId)}
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:bg-purple-500/10"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {checkins.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No active mentees to check in on</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
