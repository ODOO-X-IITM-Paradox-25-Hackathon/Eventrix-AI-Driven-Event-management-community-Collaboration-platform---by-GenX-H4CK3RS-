
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, Award, GraduationCap, Check, Upload, CreditCard } from "lucide-react";
import { initializeRazorpayPayment } from "../services/razorpayService";

interface TicketSelectionProps {
  eventId: string;
  eventName: string;
  onClose: () => void;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({ eventId, eventName, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [isStudent, setIsStudent] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const { toast } = useToast();

  // Static ticket pricing - no dynamic changes
  const ticketTiers: TicketTier[] = [
    {
      id: 'gold',
      name: 'Gold',
      price: 601, // Fixed price
      currency: 'INR',
      icon: <Crown className="h-6 w-6" />,
      features: ['Premium seating', 'VIP access', 'Welcome drinks', 'Certificate'],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 464, // Fixed price
      currency: 'INR',
      icon: <Star className="h-6 w-6" />,
      features: ['Good seating', 'Event materials', 'Light refreshments'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 218, // Fixed price
      currency: 'INR',
      icon: <Award className="h-6 w-6" />,
      features: ['Standard seating', 'Basic access', 'Event materials'],
      color: 'from-gray-300 to-gray-500'
    },
    {
      id: 'student',
      name: 'Student',
      price: 0,
      currency: 'INR',
      icon: <GraduationCap className="h-6 w-6" />,
      features: ['Student seating', 'Basic access', 'Student networking'],
      color: 'from-blue-400 to-blue-600'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStudentIdFile(file);
      toast({
        title: "Student ID uploaded",
        description: "Your student ID card has been uploaded for verification.",
      });
    }
  };

  const verifyStudentStatus = async () => {
    if (!studentId || !studentIdFile) {
      toast({
        title: "Missing information",
        description: "Please provide your student ID number and upload your ID card.",
        variant: "destructive"
      });
      return false;
    }

    // Simulate student verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification - in real app, this would check against university database
    const isValidStudent = studentId.length >= 6;
    
    if (isValidStudent) {
      toast({
        title: "Student status verified",
        description: "Your student status has been successfully verified!",
      });
      return true;
    } else {
      toast({
        title: "Verification failed",
        description: "Could not verify your student status. Please check your information.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleRazorpayPayment = (tier: TicketTier) => {
    setPaymentStatus('processing');
    
    initializeRazorpayPayment({
      amount: tier.price,
      eventName,
      eventId,
      tier: tier.name,
      onSuccess: (paymentData) => {
        console.log('Payment successful:', paymentData);
        setPaymentStatus('completed');
        
        // Store payment information
        const paidEvents = JSON.parse(localStorage.getItem('paidEvents') || '[]');
        if (!paidEvents.includes(eventId)) {
          paidEvents.push(eventId);
          localStorage.setItem('paidEvents', JSON.stringify(paidEvents));
        }
        
        const ticketInfo = {
          eventId,
          tier: tier.id,
          price: tier.price,
          currency: 'INR',
          purchaseDate: new Date().toISOString(),
          paymentId: paymentData.paymentId
        };
        
        const purchasedTickets = JSON.parse(localStorage.getItem('purchasedTickets') || '[]');
        purchasedTickets.push(ticketInfo);
        localStorage.setItem('purchasedTickets', JSON.stringify(purchasedTickets));
        
        toast({
          title: "Payment successful!",
          description: `Your ${tier.name} ticket (₹${tier.price}) has been purchased successfully.`,
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onFailure: () => {
        setPaymentStatus('failed');
        toast({
          title: "Payment failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive"
        });
      },
      onDismiss: () => {
        setPaymentStatus('idle');
        setSelectedTier("");
      }
    });
  };

  const handleTicketSelection = async (tierId: string) => {
    setSelectedTier(tierId);
    
    if (tierId === 'student') {
      setIsStudent(true);
      return;
    }
    
    const selectedTierData = ticketTiers.find(t => t.id === tierId);
    if (selectedTierData) {
      handleRazorpayPayment(selectedTierData);
    }
  };

  const handleStudentTicket = async () => {
    const verified = await verifyStudentStatus();
    if (verified) {
      setPaymentStatus('completed');
      
      // Store student ticket information
      const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!registeredEvents.includes(eventId)) {
        registeredEvents.push(eventId);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }
      
      const ticketInfo = {
        eventId,
        tier: 'student',
        price: 0,
        currency: 'INR',
        purchaseDate: new Date().toISOString(),
        studentVerified: true
      };
      
      const purchasedTickets = JSON.parse(localStorage.getItem('purchasedTickets') || '[]');
      purchasedTickets.push(ticketInfo);
      localStorage.setItem('purchasedTickets', JSON.stringify(purchasedTickets));
      
      toast({
        title: "Student ticket confirmed!",
        description: "Your free student ticket has been confirmed.",
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Select Your Ticket for {eventName}
          </h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        {!isStudent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ticketTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`p-4 cursor-pointer hover:scale-105 border-2 ${
                  selectedTier === tier.id 
                    ? 'border-eventrix bg-eventrix/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleTicketSelection(tier.id)}
              >
                <div className={`w-full h-16 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {tier.icon}
                </div>
                
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{tier.name}</h3>
                
                <div className="text-2xl font-bold text-eventrix mb-3">
                  {tier.price === 0 ? 'FREE' : `₹${tier.price}`}
                </div>
                
                <ul className="space-y-1 mb-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {paymentStatus === 'processing' && selectedTier === tier.id && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eventrix mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Processing Payment...</p>
                  </div>
                )}
                
                {paymentStatus === 'completed' && selectedTier === tier.id && (
                  <div className="text-center">
                    <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-green-600">Payment Successful!</p>
                  </div>
                )}

                {tier.price > 0 && paymentStatus === 'idle' && (
                  <div className="text-center mt-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Pay with Razorpay
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-900 dark:text-blue-100">
              <GraduationCap className="h-6 w-6 mr-2" />
              Student Verification Required
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student ID Number</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your student ID"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="studentIdFile">Upload Student ID Card</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    id="studentIdFile"
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('studentIdFile')?.click()}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload ID Card
                  </Button>
                  {studentIdFile && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {studentIdFile.name}
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleStudentTicket}
                disabled={!studentId || !studentIdFile || paymentStatus === 'processing'}
                className="w-full"
              >
                {paymentStatus === 'processing' ? 'Verifying...' : 'Verify & Get Free Ticket'}
              </Button>
            </div>
          </Card>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Payment failed. Please try again or contact support.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TicketSelection;
