
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Smartphone, Eye, Mail, CheckCircle, RefreshCw, Lock } from 'lucide-react';

interface MFASetupProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const MFASetup: React.FC<MFASetupProps> = ({ isOpen, onClose, userEmail }) => {
  const [currentStep, setCurrentStep] = useState<'captcha' | 'otp' | 'biometric' | 'complete'>('captcha');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [otp, setOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 5 minutes
  const { toast } = useToast();

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  // Generate OTP
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(otp);
    setOtpTimeLeft(300);
    
    // Simulate sending OTP via email
    toast({
      title: "OTP Sent",
      description: `Demo OTP: ${otp} (Check console for generated OTP)`,
    });
    console.log(`Generated OTP for ${userEmail}: ${otp}`);
  };

  // Timer for OTP
  useEffect(() => {
    if (currentStep === 'otp' && otpTimeLeft > 0) {
      const timer = setTimeout(() => setOtpTimeLeft(otpTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimeLeft, currentStep]);

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  const handleCaptchaVerify = () => {
    if (userCaptcha.toUpperCase() === captchaText) {
      setCaptchaVerified(true);
      setCurrentStep('otp');
      generateOTP();
      toast({
        title: "CAPTCHA Verified",
        description: "Proceeding to OTP verification",
      });
    } else {
      toast({
        title: "Invalid CAPTCHA",
        description: "Please try again",
        variant: "destructive",
      });
      generateCaptcha();
      setUserCaptcha('');
    }
  };

  const handleOTPVerify = () => {
    if (userOtp === otp && otpTimeLeft > 0) {
      setOtpVerified(true);
      setCurrentStep('biometric');
      toast({
        title: "OTP Verified",
        description: "Proceeding to biometric verification",
      });
    } else if (otpTimeLeft <= 0) {
      toast({
        title: "OTP Expired",
        description: "Please request a new OTP",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check your OTP and try again",
        variant: "destructive",
      });
    }
  };

  const handleBiometricVerify = () => {
    // Simulate biometric verification
    setBiometricVerified(true);
    setCurrentStep('complete');
    toast({
      title: "Biometric Verified",
      description: "MFA setup completed successfully!",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-eventrix" />
                Multi-Factor Authentication
              </CardTitle>
              <CardDescription>
                Secure your account with additional verification steps
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${captchaVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${captchaVerified ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                {captchaVerified ? <CheckCircle className="h-4 w-4 text-white" /> : '1'}
              </div>
              <span className="text-sm">CAPTCHA</span>
            </div>
            <div className={`flex items-center gap-2 ${otpVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${otpVerified ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                {otpVerified ? <CheckCircle className="h-4 w-4 text-white" /> : '2'}
              </div>
              <span className="text-sm">OTP</span>
            </div>
            <div className={`flex items-center gap-2 ${biometricVerified ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${biometricVerified ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                {biometricVerified ? <CheckCircle className="h-4 w-4 text-white" /> : '3'}
              </div>
              <span className="text-sm">Biometric</span>
            </div>
          </div>

          {/* CAPTCHA Step */}
          {currentStep === 'captcha' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold flex items-center gap-2 justify-center">
                  <Eye className="h-4 w-4" />
                  CAPTCHA Verification
                </h3>
                <p className="text-sm text-gray-600 mt-1">Enter the text shown below</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="font-mono text-2xl font-bold tracking-wider text-gray-800 select-none" 
                     style={{ 
                       background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                     }}>
                  {captchaText}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="captcha">Enter CAPTCHA</Label>
                <Input
                  id="captcha"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Enter the text above"
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCaptchaVerify} className="flex-1">
                  Verify CAPTCHA
                </Button>
                <Button variant="outline" onClick={() => { generateCaptcha(); setUserCaptcha(''); }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* OTP Step */}
          {currentStep === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold flex items-center gap-2 justify-center">
                  <Smartphone className="h-4 w-4" />
                  OTP Verification
                </h3>
                <p className="text-sm text-gray-600 mt-1">Enter the 6-digit code sent to {userEmail}</p>
                {otpTimeLeft > 0 && (
                  <Badge variant="outline" className="mt-2">
                    Expires in: {formatTime(otpTimeLeft)}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleOTPVerify} className="flex-1" disabled={otpTimeLeft <= 0}>
                  Verify OTP
                </Button>
                <Button variant="outline" onClick={generateOTP} disabled={otpTimeLeft > 240}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Biometric Step */}
          {currentStep === 'biometric' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold flex items-center gap-2 justify-center">
                  <Lock className="h-4 w-4" />
                  Biometric Verification
                </h3>
                <p className="text-sm text-gray-600 mt-1">Complete biometric authentication</p>
              </div>
              
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Place your finger on the sensor</p>
                <Button onClick={handleBiometricVerify} className="w-full">
                  Scan Biometric
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-600">MFA Setup Complete!</h3>
              <p className="text-sm text-gray-600">Your account is now secured with multi-factor authentication</p>
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MFASetup;
