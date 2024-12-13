"use client"
import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/lib/i18n';
import { useParams } from 'next/navigation';

const SessionStatusResult = ({ canVote }: { canVote: boolean }) => {
  const router = useRouter();
  const { sessionCode } = useParams();

  if (!canVote) {
    return (
      <div className="container mx-auto flex items-center justify-center h-full mt-[10%] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Vote Already Submitted</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  You have already participated in this voting session
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Thank you for your participation! You can now view the results or return to the home page.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                >
                  Go Home
                </Button>
                <Button 
                  onClick={() => router.push(`/vote/${sessionCode}/result`)}
                >
                  View Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center h-full mt-[10%] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Session Not Active</h2>
              <p className="text-sm text-muted-foreground mt-2">
                This voting session is currently unavailable or has expired
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Please check if you have the correct session code or contact your administrator for assistance.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
              >
                Go Home
              </Button>
              <Button 
                onClick={() => router.refresh()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionStatusResult;