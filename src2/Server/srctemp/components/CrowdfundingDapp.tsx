import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Leaf, 
  Wheat, 
  Bitcoin, 
  DollarSign, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  Droplets, 
  Shirt, 
  Package, 
  AlertTriangle, 
  Calendar,
  GraduationCap,
  Building,
  ArrowLeft
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: React.ReactNode;
  raised: number;
  target: number;
  funded: number;
  category: string;
  urgency?: 'high' | 'medium' | 'low';
}

const CrowdfundingDapp = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showCampaignDetail, setShowCampaignDetail] = useState(false);

  // Static campaigns data - no dynamic updates
  const campaigns: Campaign[] = [
    {
      id: "rover",
      title: "Student Project - Rover Research",
      description: "Fund rovers that help farmers implement sustainable practices by monitoring soil health and optimizing resource use.",
      detailedDescription: "Your contribution helps us develop cutting-edge autonomous rover technology that will revolutionize agricultural practices, improve food security, and promote sustainable farming around the world.",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      raised: 27500,
      target: 50000,
      funded: 55,
      category: "Research"
    },
    {
      id: "blood",
      title: "Blood Donation Drive",
      description: "Organize blood donation camps to save lives during emergencies and support local hospitals.",
      icon: <Droplets className="h-5 w-5 text-red-500" />,
      raised: 15000,
      target: 25000,
      funded: 60,
      category: "Health",
      urgency: "high"
    },
    {
      id: "clothes",
      title: "Clothes Donation for Needy",
      description: "Collect and distribute warm clothes for homeless people and underprivileged families.",
      icon: <Shirt className="h-5 w-5 text-blue-500" />,
      raised: 8500,
      target: 20000,
      funded: 42,
      category: "Welfare"
    },
    {
      id: "food",
      title: "Food Donation Campaign",
      description: "Provide meals to hungry families and support community kitchens in underserved areas.",
      icon: <Wheat className="h-5 w-5 text-orange-500" />,
      raised: 32000,
      target: 45000,
      funded: 71,
      category: "Welfare",
      urgency: "medium"
    },
    {
      id: "disaster",
      title: "Disaster Relief Aid & Management",
      description: "Emergency packet delivery during natural disasters and crisis management support.",
      icon: <Package className="h-5 w-5 text-purple-500" />,
      raised: 18750,
      target: 35000,
      funded: 53,
      category: "Emergency",
      urgency: "high"
    },
    {
      id: "events",
      title: "Event Management Fund Collection",
      description: "Support community events, cultural festivals, and social gatherings organization.",
      icon: <Calendar className="h-5 w-5 text-pink-500" />,
      raised: 12000,
      target: 30000,
      funded: 40,
      category: "Events"
    },
    {
      id: "workshops",
      title: "Student Workshops & Training",
      description: "Fund educational workshops, skill development programs for students and professionals.",
      icon: <GraduationCap className="h-5 w-5 text-indigo-500" />,
      raised: 22500,
      target: 40000,
      funded: 56,
      category: "Education"
    },
    {
      id: "exhibition",
      title: "Funds for Exhibition",
      description: "Support art exhibitions, science fairs, and showcase platforms for creative talents.",
      icon: <Building className="h-5 w-5 text-teal-500" />,
      raised: 9200,
      target: 25000,
      funded: 37,
      category: "Culture"
    }
  ];

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetail(true);
  };

  const handleBackToCampaigns = () => {
    setShowCampaignDetail(false);
    setSelectedCampaign(null);
    setDonationAmount("");
  };

  const connectWallet = async (walletType: string) => {
    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          toast({
            title: "MetaMask Connected! 🦊",
            description: `Connected account: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "Please install MetaMask browser extension.",
            variant: "destructive",
          });
        }
      } else if (walletType === 'phantom') {
        toast({
          title: "Phantom Wallet",
          description: "Connecting to Phantom wallet for Solana transactions...",
        });
      } else {
        toast({
          title: `${walletType} Wallet`,
          description: `Connecting to ${walletType} wallet...`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDonation = async () => {
    if (!selectedCampaign || !donationAmount) {
      toast({
        title: "Invalid Input",
        description: "Please select a campaign and enter donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (selectedCurrency === "INR") {
      await handleINRPayment();
    } else if (selectedCurrency === "USD") {
      await handleUSDPayment();
    } else {
      await handleCryptoPayment();
    }
  };

  const handleINRPayment = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag",
        amount: parseInt(donationAmount) * 100,
        currency: "INR",
        name: "Eventrix Crowdfunding",
        description: `Donation to ${selectedCampaign?.title}`,
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "7550293777" // Updated phone number
        },
        handler: function (response: any) {
          toast({
            title: "Payment Successful! 🎉",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          setDonationAmount("");
        },
        theme: { color: "#8B5CF6" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    document.body.appendChild(script);
  };

  const handleUSDPayment = async () => {
    toast({
      title: "Processing USD Payment",
      description: `Processing $${donationAmount} donation via payment gateway...`,
    });
    
    setTimeout(() => {
      toast({
        title: "USD Donation Successful! 🎉",
        description: `Successfully donated $${donationAmount}`,
      });
      setDonationAmount("");
    }, 2000);
  };

  const handleCryptoPayment = async () => {
    toast({
      title: "Processing Crypto Payment",
      description: `Processing ${donationAmount} ${selectedCurrency} donation via blockchain...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Crypto Donation Successful! 🎉",
        description: `Successfully donated ${donationAmount} ${selectedCurrency}`,
      });
      setDonationAmount("");
    }, 2000);
  };

  if (showCampaignDetail && selectedCampaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={handleBackToCampaigns}
            variant="ghost"
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedCampaign.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {selectedCampaign.icon}
              <span>Support Our {selectedCampaign.category} Initiative</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {selectedCampaign.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {selectedCampaign.detailedDescription || "Your contribution helps us make a real difference in the community and create lasting positive impact."}
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Choose Payment Method
                </h3>
                
                {/* Fiat Currency Options */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Fiat Currency</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedCurrency("USD")}
                      className={`p-4 rounded-lg border-2 ${
                        selectedCurrency === "USD" 
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <span className="text-sm font-medium">USD</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedCurrency("INR")}
                      className={`p-4 rounded-lg border-2 ${
                        selectedCurrency === "INR" 
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <IndianRupee className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <span className="text-sm font-medium">INR</span>
                    </button>
                  </div>
                </div>

                {/* Cryptocurrency Options */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cryptocurrency</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedCurrency("ETH")}
                      className={`p-4 rounded-lg border-2 ${
                        selectedCurrency === "ETH" 
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mx-auto mb-2">Ξ</div>
                      <span className="text-sm font-medium">ETH</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedCurrency("BTC")}
                      className={`p-4 rounded-lg border-2 ${
                        selectedCurrency === "BTC" 
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Bitcoin className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                      <span className="text-sm font-medium">BTC</span>
                    </button>
                  </div>
                </div>

                {/* Wallet Connection for Crypto */}
                {(selectedCurrency === "ETH" || selectedCurrency === "BTC") && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Connect Wallet</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => connectWallet('metamask')}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <div className="text-2xl">🦊</div>
                        <span className="text-xs">MetaMask</span>
                      </Button>
                      <Button
                        onClick={() => connectWallet('phantom')}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <div className="text-2xl">👻</div>
                        <span className="text-xs">Phantom</span>
                      </Button>
                      <Button
                        onClick={() => connectWallet('coinbase')}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <div className="text-2xl">💼</div>
                        <span className="text-xs">Coinbase</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount ({selectedCurrency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {selectedCurrency === "INR" ? "₹" : selectedCurrency === "USD" ? "$" : ""}
                    </span>
                    <Input
                      type="number"
                      placeholder={selectedCurrency === "INR" ? "800" : "100"}
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="pl-8 h-12 text-lg"
                    />
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {selectedCurrency === "INR" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("500")}>₹500</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("1000")}>₹1000</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("5000")}>₹5000</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("10000")}>₹10000</Button>
                      </>
                    ) : selectedCurrency === "USD" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("10")}>$10</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("50")}>$50</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("100")}>$100</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("500")}>$500</Button>
                      </>
                    ) : selectedCurrency === "ETH" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.01")}>0.01 ETH</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.05")}>0.05 ETH</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.1")}>0.1 ETH</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.5")}>0.5 ETH</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.001")}>0.001 BTC</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.005")}>0.005 BTC</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.01")}>0.01 BTC</Button>
                        <Button variant="outline" size="sm" onClick={() => setDonationAmount("0.05")}>0.05 BTC</Button>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleDonation}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!donationAmount}
                >
                  Donate {donationAmount} {selectedCurrency} to {selectedCampaign.title}
                </Button>
              </div>
            </div>

            {/* Sidebar - Static Campaign Details */}
            <div className="space-y-6">
              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Raised</span>
                      <span className="font-semibold">${selectedCampaign.raised.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Goal</span>
                      <span>${selectedCampaign.target.toLocaleString()}</span>
                    </div>
                    <Progress value={selectedCampaign.funded} className="h-3 mt-2" />
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedCampaign.funded}% funded
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Impact of Your Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Every contribution makes a difference</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">100% transparent fund usage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Regular progress updates</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Crowdfunding & Donation Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Support meaningful causes and make a difference in your community through our secure donation platform
          </p>
        </div>

        {/* Campaign Grid - Static Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="cursor-pointer hover:shadow-lg relative"
              onClick={() => handleCampaignSelect(campaign)}
            >
              {campaign.urgency === 'high' && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-red-600 text-white">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    URGENT
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {campaign.icon}
                  </div>
                  <Badge variant="secondary">{campaign.category}</Badge>
                </div>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                <CardDescription className="text-sm">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">${campaign.raised.toLocaleString()}</span>
                    <span className="text-gray-500">Goal: ${campaign.target.toLocaleString()}</span>
                  </div>
                  <Progress value={campaign.funded} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{campaign.funded}% funded</span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Donate Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Secure Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Multiple payment options including fiat currencies and cryptocurrencies with secure wallet integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Transparent Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Track exactly how your donations are being used with real-time updates and progress reports.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Quick & Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Donate in just a few clicks with our streamlined process and multiple payment options.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrowdfundingDapp;
