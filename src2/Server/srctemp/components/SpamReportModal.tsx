
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Flag } from "lucide-react";

interface SpamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

const SpamReportModal: React.FC<SpamReportModalProps> = ({ isOpen, onClose, eventId, eventName }) => {
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const { toast } = useToast();

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting this event.",
        variant: "destructive"
      });
      return;
    }

    // Store the report in localStorage (in real app, this would go to backend)
    const existingReports = JSON.parse(localStorage.getItem('reportedEvents') || '[]');
    const newReport = {
      eventId,
      eventName,
      reason: reportReason,
      customReason: reportReason === 'other' ? customReason : '',
      reportedAt: new Date().toISOString(),
      reportedBy: 'current-user' // In real app, get from auth context
    };
    
    existingReports.push(newReport);
    localStorage.setItem('reportedEvents', JSON.stringify(existingReports));

    // Mark event as flagged
    const flaggedEvents = JSON.parse(localStorage.getItem('flaggedEvents') || '[]');
    if (!flaggedEvents.includes(eventId)) {
      flaggedEvents.push(eventId);
      localStorage.setItem('flaggedEvents', JSON.stringify(flaggedEvents));
    }

    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We'll review this event and take appropriate action.",
    });

    onClose();
    setReportReason("");
    setCustomReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report Event
          </DialogTitle>
          <DialogDescription>
            Report "{eventName}" for inappropriate content or spam. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Reason for reporting</Label>
            <RadioGroup value={reportReason} onValueChange={setReportReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam">Spam or misleading content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" />
                <Label htmlFor="inappropriate">Inappropriate or offensive content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scam" id="scam" />
                <Label htmlFor="scam">Scam or dangerous activity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hate-speech" id="hate-speech" />
                <Label htmlFor="hate-speech">Hate speech or harassment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          {reportReason === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason">Please describe the issue</Label>
              <Textarea
                id="custom-reason"
                placeholder="Describe why you're reporting this event..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReport}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!reportReason || (reportReason === 'other' && !customReason.trim())}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpamReportModal;
