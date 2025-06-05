
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Timer, RefreshCw, Shield } from "lucide-react";
import { T } from "../hooks/useTranslation";
import MFASetup from "./MFASetup";

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onResendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onResendOTP
}) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate OTP verification (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any 6-digit OTP
    if (otp === "123456" || otp.length === 6) {
      toast({
        title: "OTP Verified",
        description: "Login successful!",
      });
      onVerificationSuccess();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check your OTP and try again",
        variant: "destructive",
      });
    }
    
    setIsVerifying(false);
  };

  const handleResendOTP = () => {
    onResendOTP();
    setTimeLeft(300);
    setCanResend(false);
    setOtp("");
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your email",
    });
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-eventrix/10 rounded-full">
              <Mail className="h-8 w-8 text-eventrix" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            <T>Verify Your Email</T>
          </CardTitle>
          <CardDescription>
            <T>We've sent a 6-digit verification code to</T><br />
            <span className="font-medium text-eventrix">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={handleVerifyOTP}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Timer className="h-4 w-4" />
              <span><T>Code expires in</T> {formatTime(timeLeft)}</span>
            </div>
          </div>

          <Button 
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full bg-eventrix hover:bg-eventrix-hover"
          >
            {isVerifying ? <T>Verifying...</T> : <T>Verify OTP</T>}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              <T>Didn't receive the code?</T>
            </p>
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={!canResend}
              className="text-eventrix hover:text-eventrix-hover"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {canResend ? <T>Resend OTP</T> : <span><T>Resend in</T> {formatTime(timeLeft)}</span>}
            </Button>
          </div>

          {/* MFA Enable Button */}
          <div className="border-t pt-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                <T>Want to make your account more secure?</T>
              </p>
              <Button
                onClick={() => setShowMFA(true)}
                variant="outline"
                className="w-full border-eventrix text-eventrix hover:bg-eventrix/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                <T>Enable Multi-Factor Authentication</T>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <MFASetup 
        isOpen={showMFA}
        onClose={() => setShowMFA(false)}
        userEmail={email}
      />
    </>
  );
};

export default OTPVerification;
