"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rate, Image as AntImage, Divider, Image } from 'antd';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { submitVote } from './_actions';
import { motion, AnimatePresence } from 'framer-motion';
interface Criterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
  imageUrl?: string;
}

interface Campus {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Session {
  id: string;
  title: string;
  description?: string;
  sessionCode: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  campuses: Campus[];
  criteria: Criterion[];
}

interface CriterionVote {
  criterionId: string;
  score: number;
}

interface VotesByCampus {
  [key: string]: CriterionVote[];
}

interface StepwiseVotingFormProps {
  session: Session;
}

const StepwiseVotingForm: React.FC<StepwiseVotingFormProps> = ({ session }) => {
  const router = useRouter();
  const [currentCampusIndex, setCurrentCampusIndex] = useState<number>(0);
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [votes, setVotes] = useState<VotesByCampus>(
    session.campuses.reduce((acc, campus) => ({
      ...acc,
      [campus.id]: session.criteria.map(criterion => ({
        criterionId: criterion.id,
        score: 0
      }))
    }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
 

  const currentCampus = session.campuses[currentCampusIndex];
  const currentCriterion = session.criteria[currentCriterionIndex];

  const getEmojiSeed = (score: number): string => {
    if (score === 0) return 'Destiny'; // Neutral face
    if (score <= 20) return 'Sawyer'; // Very angry
    if (score <= 40) return 'Brooklynn'; // Sad
    if (score <= 60) return 'Valentina'; // Slight smile
    if (score <= 80) return 'Adrian'; // Happy
    return 'rich'; // Super happy with sunglasses
  };

  const handleVoteChange = (value: number) => {
    const score = value * 20;
    setVotes(prev => ({
      ...prev,
      [currentCampus.id]: prev[currentCampus.id].map(vote =>
        vote.criterionId === currentCriterion.id ? { ...vote, score } : vote
      )
    }));
  };

  const getCurrentVote = () => {
    return votes[currentCampus.id].find(v => v.criterionId === currentCriterion.id);
  };

  const getScoreLabel = (score: number): string => {
    if (score === 0) return '---';
    if (score <= 20) return 'Poor';
    if (score <= 40) return 'Fair';
    if (score <= 60) return 'Good';
    if (score <= 80) return 'Very Good';
    return 'Excellent';
  };

  const handleNext = () => {
    const currentVote = getCurrentVote();
    if (!currentVote || currentVote.score === 0) {
      toast.error('Please rate the current criterion before proceeding');
      return;
    }

    if (currentCriterionIndex < session.criteria.length - 1) {
      setDirection('up');
      setCurrentCriterionIndex(prev => prev + 1);
    } else if (currentCampusIndex < session.campuses.length - 1) {
      setDirection('right');
      setCurrentCampusIndex(prev => prev + 1);
      setCurrentCriterionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentCriterionIndex > 0) {
      setDirection('down');
      setCurrentCriterionIndex(prev => prev - 1);
    } else if (currentCampusIndex > 0) {
      setDirection('left');
      setCurrentCampusIndex(prev => prev - 1);
      setCurrentCriterionIndex(session.criteria.length - 1);
    }
  };

  const isLastStep = currentCampusIndex === session.campuses.length - 1 && 
                    currentCriterionIndex === session.criteria.length - 1;

  const handleSubmit = async () => {
    const currentVote = getCurrentVote();
    if (!currentVote || currentVote.score === 0) {
      toast.error('Please rate the current criterion before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const allVotes = Object.entries(votes).flatMap(([campusId, campusVotes]) => 
        campusVotes.map(vote => ({
          ...vote,
          campusId
        }))
      );

      await submitVote({
        sessionId: session.id,
        votes: allVotes
      });
      
      toast.success('Votes submitted successfully!');
      router.push(`/vote/${session.sessionCode}/result`);
    } catch (error) {
      console.error('Error submitting votes:', error);
      toast.error('Failed to submit votes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">

      
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center text-center justify-between gap-4">
            <div className='text-center'>
              <h1 className="text-2xl text-center font-bold">{session.title}</h1>
              {session.description && (
                <p className="text-muted-foreground mt-1">{session.description}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Session:</span>
                <Badge variant="outline">{session.sessionCode}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6">
        <Card className="relative overflow-hidden p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCampus.id}
              initial={{ x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0 }}
              animate={{ x: 0 }}
              exit={{ x: direction === 'right' ? '-100%' : direction === 'left' ? '100%' : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  {/* {currentCampus.imageUrl && (
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <AntImage
                        src={currentCampus.imageUrl}
                        alt={currentCampus.name}
                        className="w-full h-full object-cover"
                        preview={false}
                      />
                    </div>
                  )} */}
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentCampus.name}</h2>
                    <Badge variant="secondary" className="text-lg">
                      Campus {currentCampusIndex + 1} of {session.campuses.length}
                    </Badge>
                  </div>
                </div>

               <div className='w-full items-center flex justify-center ' >
                <AntImage
                      src={currentCampus.imageUrl}
                      alt="Rating Emoji"
                      className="w-full h-full object-contain max-h-[500px] "
                      height={400}
                      
                    />
                </div> 
              </div>
            </motion.div>

          </AnimatePresence>
        </Card>

        <Card className="relative flex flex-col justify-between p-6">
          <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
            <div>Criterion {currentCriterionIndex + 1} of {session.criteria.length}</div>
            <Badge variant="secondary">Weight: {currentCriterion.weight}%</Badge>
          </div>

          <div className="relative flex-1 pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCampus.id}-${currentCriterion.id}`}
                initial={{ y: direction === 'up' ? '10%' : direction === 'down' ? '-10%' : 0 }}
                animate={{ y: 0 }}
                exit={{ y: direction === 'up' ? '-10%' : direction === 'down' ? '10%' : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping:  20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{currentCriterion.name}</h3>
                  <p className="text-muted-foreground">
                    {currentCriterion.description || 'No description provided'}
                  </p>
                </div>

                <div className="flex flex-col mt-24 justify-center items-center h-full ">
                  <div className="w-24 h-24 overflow-hidden rounded-lg bg-muted">
                    <AntImage
                      src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${getEmojiSeed(getCurrentVote()?.score || 0)}`}
                      alt="Rating Emoji"
                      className="w-full h-full object-contain"
                      preview={false}
                    />
                  </div>
                  <div className='sm:hidden '>
              <p className="  text-sm font-bold text-orange-500 mb-2 text-center">
                {getScoreLabel(getCurrentVote()?.score || 0)}
              </p>
              <div className="flex justify-center">
                <Rate
                  value={(getCurrentVote()?.score || 0) / 20}
                  onChange={handleVoteChange}
                  allowHalf
                  className="text-2xl"
                />
              </div>
            </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex bg-white z-50 relative items-center justify-between">
            <Button
              onClick={handleBack}
              disabled={currentCampusIndex === 0 && currentCriterionIndex === 0}
              variant="outline"
              size="lg"
            >
              Previous
            </Button>

            <div className='max-sm:hidden'>
              <p className="  text-sm font-bold text-orange-500 mb-2 text-center">
                {getScoreLabel(getCurrentVote()?.score || 0)}
              </p>
              <div className="flex justify-center">
                <Rate
                  value={(getCurrentVote()?.score || 0) / 20}
                  onChange={handleVoteChange}
                  allowHalf
                  className="text-2xl"
                />
              </div>
              </div>

           
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !getCurrentVote() || getCurrentVote()?.score === 0}
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit All Votes'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!getCurrentVote() || getCurrentVote()?.score === 0}
                size="lg"
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StepwiseVotingForm;