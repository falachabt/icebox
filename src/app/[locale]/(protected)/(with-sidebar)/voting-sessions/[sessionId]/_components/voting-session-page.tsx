"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { upsertManualScore, updateSessionStatus } from "./_actions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type VotingSession = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  campuses: Campus[];
  criteria: Criterion[];
  votes: Vote[];
  ManualScore: ManualScore[];
};

type ManualScore = {
  score: number;
  campusId: string;
  criterionId: string;
};

type Campus = {
  id: string;
  name: string;
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
  isVotable: boolean;
};

type Vote = {
  id: string;
  score: number;
  campusId: string;
  criterionId: string;
};

type VotingSessionPageProps = {
  session: VotingSession;
};

const VotingSessionPage: React.FC<VotingSessionPageProps> = ({ session }) => {
  // State for manual scores of non-votable criteria
  const [manualScores, setManualScores] = useState<Record<string, Record<string, number>>>(() => {
    const initialScores: Record<string, Record<string, number>> = {};
    session.campuses.forEach(campus => {
      initialScores[campus.id] = {};
      session.criteria
        .filter(c => !c.isVotable)
        .forEach(criterion => {
          // Look for existing manual score
          const existingScore = session.ManualScore.find(
            ms => ms.campusId === campus.id && ms.criterionId === criterion.id
          );
          initialScores[campus.id][criterion.id] = existingScore?.score ?? 0;
        });
    });
    return initialScores;
  });

  const router = useRouter();

  // Calculate average scores per criterion per campus for votable criteria
  const calculateAverageScores = () => {
    const averages = session.campuses.map(campus => {
      const scores = session.criteria.reduce((acc, criterion) => {
        if (criterion.isVotable) {
          const criterionVotes = session.votes.filter(
            vote => vote.campusId === campus.id && vote.criterionId === criterion.id
          );
          
          const average = criterionVotes.length > 0
            ? criterionVotes.reduce((sum, vote) => sum + vote.score, 0) / criterionVotes.length
            : 0;
          
          return {
            ...acc,
            [criterion.name]: Number(average.toFixed(2))
          };
        } else {
          // Use manual scores for non-votable criteria
          return {
            ...acc,
            [criterion.name]: manualScores[campus.id][criterion.id] || 0
          };
        }
      }, {});

      // Calculate weighted total score
      const totalScore = calculateWeightedTotal(campus.id);

      return {
        campusName: campus.name,
        totalScore: Number(totalScore.toFixed(2)),
        ...scores
      };
    });

    return averages;
  };

  // Calculate weighted total score for a campus
  const calculateWeightedTotal = (campusId: string) => {
    return session.criteria.reduce((total, criterion) => {
      let score = 0;
      if (criterion.isVotable) {
        const votes = session.votes.filter(
          vote => vote.campusId === campusId && vote.criterionId === criterion.id
        );
        score = votes.length > 0
          ? votes.reduce((sum, vote) => sum + vote.score, 0) / votes.length
          : 0;
      } else {
        score = manualScores[campusId][criterion.id] || 0;
      }
      return total + (score * criterion.weight / 100);
    }, 0);
  };

  const handleManualScoreChange = async (campusId: string, criterionId: string, value: string) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    
    setManualScores(prev => ({
      ...prev,
      [campusId]: {
        ...prev[campusId],
        [criterionId]: numValue
      }
    }));

    // Save to database using the server action
    const result = await upsertManualScore({
      sessionId: session.id,
      campusId,
      criterionId,
      score: numValue
    });

    if (!result.success) {
      console.error('Failed to save manual score');
    }
  };

  const averageScores = calculateAverageScores();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/voting-sessions')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Button>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{session.title}</h1>
        {session.description && (
          <p className="text-gray-500">{session.description}</p>
        )}
      </div>

       {/* Additional Statistics */}
       <Card>
        <CardHeader>
          <CardTitle>Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Total Votes Cast</h3>
              <p className="text-2xl font-bold">{session.votes.length}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <div className="flex items-center gap-4">
                <p className={`text-2xl font-bold ${session.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {session.isActive ? 'Active' : 'Closed'}
                </p>
                {session.isActive && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Close Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Close Voting Session</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to close this voting session? This will prevent any further voting.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const close = e.currentTarget.closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
                            if (close) close.click();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            const result = await updateSessionStatus(session.id, false);
                            if (result.success) {
                              const close = document.querySelector('[role="dialog"] button[aria-label="Close"]') as HTMLButtonElement;
                              if (close) close.click();
                              router.refresh();
                            }
                          }}
                        >
                          Close Session
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {!session.isActive && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Reopen Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reopen Voting Session</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to reopen this voting session? This will allow participants to vote again.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const close = e.currentTarget.closest('[role="dialog"]')?.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
                            if (close) close.click();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          onClick={async () => {
                            const result = await updateSessionStatus(session.id, true);
                            if (result.success) {
                              const close = document.querySelector('[role="dialog"] button[aria-label="Close"]') as HTMLButtonElement;
                              if (close) close.click();
                              router.refresh();
                            }
                          }}
                        >
                          Reopen Session
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Date Range</h3>
              <p className="text-sm">
                {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Scores Input for Non-votable Criteria */}
      {session.criteria.some(c => !c.isVotable) && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Scores for Administrative Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.campuses.map(campus => (
                <div key={campus.id} className="space-y-4">
                  <h3 className="font-semibold">{campus.name}</h3>
                  {session.criteria
                    .filter(criterion => !criterion.isVotable)
                    .map(criterion => (
                      <div key={criterion.id} className="flex items-center gap-2">
                        <label className="text-sm flex-grow">
                          {criterion.name} ({criterion.weight}%)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="w-24"
                          value={manualScores[campus.id][criterion.id]}
                          onChange={(e) => handleManualScoreChange(campus.id, criterion.id, e.target.value)}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Weighted Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Total Weighted Scores</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="campusName" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="totalScore" fill="#4f46e5" name="Total Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Scores per Criterion */}
      <Card>
        <CardHeader>
          <CardTitle>Scores by Criterion</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="campusName" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {session.criteria.map((criterion, index) => (
                <Bar
                  key={criterion.id}
                  dataKey={criterion.name}
                  fill={`hsl(${index * (360 / session.criteria.length)}, 70%, 50%)`}
                  name={`${criterion.name} (${criterion.weight}%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

     
    </div>
  );
};

export default VotingSessionPage;