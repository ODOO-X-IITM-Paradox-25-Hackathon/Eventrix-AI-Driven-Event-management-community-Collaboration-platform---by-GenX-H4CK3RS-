
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Share2, Facebook, Twitter, MessageCircle, Mail, Copy, Instagram } from "lucide-react";

interface SocialShareProps {
  eventId: string;
  eventName: string;
  eventDescription: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ eventId, eventName, eventDescription }) => {
  const { toast } = useToast();
  const eventUrl = `${window.location.origin}/events/${eventId}`;
  const shareText = `Check out this amazing event: ${eventName}`;

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${eventDescription}\n\n${eventUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy to clipboard with instructions
    const instagramText = `${shareText}\n\n${eventUrl}`;
    navigator.clipboard.writeText(instagramText).then(() => {
      toast({
        title: "Text Copied for Instagram",
        description: "Share text copied! Open Instagram and paste in your story or post.",
      });
    });
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Event Invitation: ${eventName}`);
    const body = encodeURIComponent(`Hi!\n\nI'd like to share this interesting event with you:\n\n${eventName}\n\n${eventDescription}\n\nEvent Details: ${eventUrl}\n\nHope to see you there!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link Copied",
        description: "Event link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            onClick={shareToWhatsApp}
            variant="outline"
            className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          
          <Button
            onClick={shareToFacebook}
            variant="outline"
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          
          <Button
            onClick={shareToTwitter}
            variant="outline"
            className="flex items-center gap-2 text-blue-400 border-blue-200 hover:bg-blue-50"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>

          <Button
            onClick={shareToInstagram}
            variant="outline"
            className="flex items-center gap-2 text-pink-600 border-pink-200 hover:bg-pink-50"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </Button>
          
          <Button
            onClick={shareViaEmail}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
