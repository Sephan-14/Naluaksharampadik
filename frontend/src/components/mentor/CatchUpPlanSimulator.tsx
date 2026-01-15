import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Zap } from 'lucide-react';
import { useState } from 'react';


export default function CatchUpPlanSimulator() {
  const [inputs, setInputs] = useState({
    syllabusCompletion: 60,
    daysRemaining: 30,
    dailyStudyHours: 3
  });

  const [approved, setApproved] = useState(false);

  const calculateTimelines = () => {
    const remaining = 100 - inputs.syllabusCompletion;
    const hoursNeeded = remaining * 0.5; // Estimate: 0.5 hours per percentage point

    // Best case: optimal study conditions
    const bestCaseHours = hoursNeeded * 0.8;
    const bestCaseDays = Math.ceil(bestCaseHours / (inputs.dailyStudyHours * 1.2));

    // Realistic: normal conditions
    const realisticDays = Math.ceil(hoursNeeded / inputs.dailyStudyHours);

    // Worst case: slower progress
    const worstCaseHours = hoursNeeded * 1.3;
    const worstCaseDays = Math.ceil(worstCaseHours / (inputs.dailyStudyHours * 0.7));

    return {
      best: {
        days: Math.max(1, Math.min(bestCaseDays, inputs.daysRemaining)),
        label: 'Best Case',
        description: `With focused study and minimal distractions`
      },
      realistic: {
        days: Math.max(1, Math.min(realisticDays, inputs.daysRemaining)),
        label: 'Realistic Timeline',
        description: `With normal study patterns and breaks`
      },
      worst: {
        days: Math.max(1, Math.min(worstCaseDays, inputs.daysRemaining)),
        label: 'Worst Case',
        description: `With interruptions and slower progress`
      }
    };
  };

  const timelines = calculateTimelines();
  const canComplete = timelines.realistic.days <= inputs.daysRemaining;

  return (
    <Card className="bg-neutral-900 border border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          Catch-Up Plan Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="syllabus" className="text-sm text-gray-300">Syllabus Completion %</Label>
            <Input
              id="syllabus"
              type="number"
              min="0"
              max="100"
              value={inputs.syllabusCompletion}
              onChange={(e) => setInputs({ ...inputs, syllabusCompletion: parseInt(e.target.value) })}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <p className="text-xs text-gray-500">{inputs.syllabusCompletion}% done</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days" className="text-sm text-gray-300">Days Remaining</Label>
            <Input
              id="days"
              type="number"
              min="1"
              value={inputs.daysRemaining}
              onChange={(e) => setInputs({ ...inputs, daysRemaining: parseInt(e.target.value) })}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <p className="text-xs text-gray-500">{inputs.daysRemaining} days to exam</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-sm text-gray-300">Daily Study Hours</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              max="12"
              value={inputs.dailyStudyHours}
              onChange={(e) => setInputs({ ...inputs, dailyStudyHours: parseFloat(e.target.value) })}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
            <p className="text-xs text-gray-500">{inputs.dailyStudyHours} hours/day</p>
          </div>
        </div>

        {/* Timelines Output */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-300">Recovery Timelines</p>
          
          <div className="space-y-3">
            {/* Best Case */}
            <div className="p-4 rounded-lg bg-neutral-800 border border-emerald-500/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-emerald-300">{timelines.best.label}</p>
                  <p className="text-xs text-gray-400">{timelines.best.description}</p>
                </div>
                <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-300">
                  {timelines.best.days} days
                </Badge>
              </div>
              <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full" 
                  style={{ width: `${Math.min((timelines.best.days / inputs.daysRemaining) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Realistic */}
            <div className={`p-4 rounded-lg bg-neutral-800 border ${canComplete ? 'border-amber-500/20' : 'border-red-500/20'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`text-sm font-semibold ${canComplete ? 'text-amber-300' : 'text-red-300'}`}>
                    {timelines.realistic.label}
                  </p>
                  <p className="text-xs text-gray-400">{timelines.realistic.description}</p>
                </div>
                <Badge className={`${canComplete ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
                  {timelines.realistic.days} days
                </Badge>
              </div>
              <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${canComplete ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${Math.min((timelines.realistic.days / inputs.daysRemaining) * 100, 100)}%` }}
                ></div>
              </div>
              {!canComplete && (
                <p className="text-xs text-red-400 mt-2">⚠️ May not complete in time with current pace</p>
              )}
            </div>

            {/* Worst Case */}
            <div className="p-4 rounded-lg bg-neutral-800 border border-red-500/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-red-300">{timelines.worst.label}</p>
                  <p className="text-xs text-gray-400">{timelines.worst.description}</p>
                </div>
                <Badge className="bg-red-500/20 border-red-500/30 text-red-300">
                  {timelines.worst.days} days
                </Badge>
              </div>
              <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-400 rounded-full" 
                  style={{ width: `${Math.min((timelines.worst.days / inputs.daysRemaining) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-purple-200">
            {canComplete ? (
              <>
                ✓ <strong>Achievable:</strong> Student can realistically complete the syllabus in {timelines.realistic.days} days
              </>
            ) : (
              <>
                ⚠️ <strong>At Risk:</strong> Student needs {timelines.realistic.days - inputs.daysRemaining} more days. Consider revision strategy.
              </>
            )}
          </p>
        </div>

        {/* Action */}
        <Button 
          onClick={() => setApproved(!approved)}
          className={`w-full ${approved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {approved ? '✓ Plan Approved' : 'Approve & Save Plan'}
        </Button>
      </CardContent>
    </Card>
  );
}
