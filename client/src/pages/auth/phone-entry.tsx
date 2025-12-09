import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import krishnaVectorArt from "@assets/juhu Dow 1_1753442733006.png";

export default function PhoneEntry() {
  const [, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check if this is first time opening the app
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setIsFirstTime(false);
    } else {
      // Mark as seen after animation
      setTimeout(() => {
        localStorage.setItem("hasSeenIntro", "true");
      }, 2000);
    }
  }, []);

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      setLocation("/auth/otp");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Divine Naturals Vector Art - Full Design */}
      <div className="flex-1 flex items-center justify-center pt-8 pb-80">
        <img 
          src={krishnaVectorArt} 
          alt="Divine Naturals - Complete design with logo and illustration"
          className={`w-full max-w-sm h-auto object-contain px-6 transition-all duration-1000 ${
            isFirstTime 
              ? 'opacity-0 transform scale-95 translate-y-4' 
              : 'opacity-100 transform scale-100 translate-y-0'
          }`}
          style={{
            animation: isFirstTime ? 'fadeInScale 1.5s ease-out forwards' : 'none'
          }}
        />
      </div>
      
      {/* Form Section at Bottom - Fixed Position */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white px-6 py-8 rounded-t-3xl shadow-2xl border-t border-gray-100"
        style={{
          animation: isFirstTime ? 'slideUpForm 1s ease-out 0.5s forwards' : 'none',
          opacity: isFirstTime ? 0 : 1,
          transform: isFirstTime ? 'translateY(100px)' : 'translateY(0)'
        }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get started</h2>
        
        {/* Phone Input */}
        <div className="relative mb-6">
          <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
            <div className="flex items-center px-4 py-3 border-r border-gray-200">
              <div className="w-6 h-4 bg-gradient-to-b from-orange-400 via-white to-green-400 rounded-sm mr-2"></div>
              <span className="text-gray-600 text-sm">+91</span>
            </div>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-0 flex-1 text-base placeholder:text-gray-400 focus:ring-0"
              maxLength={10}
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={phoneNumber.length < 10}
          className="w-full h-14 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl disabled:opacity-50"
        >
          Continue
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By Signing up you agree to{" "}
          <span className="text-[#52B574]">TnC and Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}