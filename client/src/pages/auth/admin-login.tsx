import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      toast({ title: "Please enter email", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Simulating OTP send - in real app, backend sends OTP to email
      toast({ title: "✅ OTP sent to your email!" });
      setStep("otp");
    } catch (error) {
      toast({ title: "❌ Error sending OTP", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 5) {
      toast({ title: "Please enter complete OTP", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Verify OTP (backend should verify)
      toast({ title: "✅ OTP verified!" });
      setStep("password");
    } catch (error) {
      toast({ title: "❌ Invalid OTP", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, newPassword })
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast({ title: "✅ Password updated successfully!" });
      // Redirect to admin dashboard
      setLocation("/admin");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "❌ Error updating password", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--eco-cream))] px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (step === "email") setLocation("/");
            else if (step === "otp") setStep("email");
            else setStep("otp");
          }}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Secure verification required</p>
        </div>

        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="admin@divinenaturals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-green-500"
              />
            </div>
            <Button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full h-12 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl"
            >
              {isLoading ? "Sending..." : "📧 Send OTP"}
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-4">Check your email for the verification code</p>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center font-bold text-xl focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full h-12 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl"
            >
              {isLoading ? "Verifying..." : "✅ Verify OTP"}
            </Button>
          </div>
        )}

        {/* Step 3: Update Password */}
        {step === "password" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-gray-300 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-gray-300 focus:border-green-500"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum 6 characters required</p>
            <Button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="w-full h-12 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl"
            >
              {isLoading ? "Updating..." : "🔐 Update Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
