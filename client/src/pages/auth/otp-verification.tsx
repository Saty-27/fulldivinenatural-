import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OTPVerification() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(28);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    // STAGE 1: OTP verified, now go to Personal Details (required before app)
    if (otpValue.length === 5) {
      setLocation("/auth/personal-details");
    }
  };

  const handleRetry = () => {
    setCountdown(28);
    setOtp(["", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--eco-cream))] px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/auth/phone")}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">OTP Verification</h1>
        
        <p className="text-gray-600 mb-8">
          We have sent a verification code to <span className="font-semibold">+91-8928794211</span>
        </p>

        {/* OTP Input */}
        <div className="flex justify-between mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="number"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold focus:border-[#52B574] focus:outline-none bg-white"
            />
          ))}
        </div>

        {/* Retry */}
        <p className="text-center text-gray-600 mb-12">
          Didn't receive the OTP?{" "}
          {countdown > 0 ? (
            <span>Retry in 00:{countdown.toString().padStart(2, "0")}</span>
          ) : (
            <button
              onClick={handleRetry}
              className="text-[#52B574] font-semibold"
            >
              Retry
            </button>
          )}
        </p>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={otp.join("").length !== 5}
          className="w-full h-14 bg-gray-400 hover:bg-gray-500 text-white text-lg font-semibold rounded-xl disabled:opacity-50 data-[disabled=false]:bg-[#52B574] data-[disabled=false]:hover:bg-[#459963]"
          data-disabled={otp.join("").length !== 5}
        >
          Verify and Proceed
        </Button>
      </div>
    </div>
  );
}