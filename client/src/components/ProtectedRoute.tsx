import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string;
}

export function ProtectedRoute({ component: Component, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOTP, setLoginOTP] = useState("");
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [isLoading2, setIsLoading2] = useState(false);
  const [signupPhone, setSignupPhone] = useState("");
  const [signupOTP, setSignupOTP] = useState("");
  const [signupStep, setSignupStep] = useState<"phone" | "otp">("phone");
  const [isLoading3, setIsLoading3] = useState(false);

  const handleLoginSendOTP = async () => {
    if (!loginPhone) {
      toast({ title: "Error", description: "Please enter phone number", variant: "destructive" });
      return;
    }
    setIsLoading2(true);
    setTimeout(() => {
      setLoginStep("otp");
      setIsLoading2(false);
      toast({ title: "OTP Sent", description: `OTP sent to ${loginPhone}` });
    }, 500);
  };

  const handleLoginVerifyOTP = async () => {
    if (!loginOTP) {
      toast({ title: "Error", description: "Please enter OTP", variant: "destructive" });
      return;
    }
    setIsLoading2(true);
    try {
      const response = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone, otp: loginOTP }),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Login successful!" });
        window.location.reload();
      } else {
        toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleSignupSendOTP = async () => {
    if (!signupPhone) {
      toast({ title: "Error", description: "Please enter phone number", variant: "destructive" });
      return;
    }
    setIsLoading3(true);
    setTimeout(() => {
      setSignupStep("otp");
      setIsLoading3(false);
      toast({ title: "OTP Sent", description: `OTP sent to ${signupPhone}` });
    }, 500);
  };

  const handleSignupVerifyOTP = async () => {
    if (!signupOTP) {
      toast({ title: "Error", description: "Please enter OTP", variant: "destructive" });
      return;
    }
    setIsLoading3(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: signupPhone, otp: signupOTP }),
      });
      if (response.ok) {
        toast({ title: "Success", description: "Signup successful!" });
        window.location.href = "/auth/personal-details";
      } else {
        toast({ title: "Error", description: "Signup failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Signup failed", variant: "destructive" });
    } finally {
      setIsLoading3(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--eco-cream))]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--eco-primary))]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--eco-cream)] to-[var(--eco-light)] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-green-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg p-2">
              <img 
                src={logoImage} 
                alt="Divine Naturals Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold eco-text mb-2">Divine Naturals</h1>
            <p className="eco-text-muted">Pure. Fresh. Daily.</p>
          </div>

          <div className="flex gap-2 mb-6 bg-green-50 p-1 rounded-xl">
            <button onClick={() => {setActiveTab("login"); setLoginStep("phone"); setLoginPhone(""); setLoginOTP("");}} className={`flex-1 py-2 px-4 font-semibold rounded-lg transition-all ${activeTab === "login" ? "bg-green-600 text-white" : "eco-text hover:bg-green-100"}`}>Login</button>
            <button onClick={() => {setActiveTab("signup"); setSignupStep("phone"); setSignupPhone(""); setSignupOTP("");}} className={`flex-1 py-2 px-4 font-semibold rounded-lg transition-all ${activeTab === "signup" ? "bg-green-600 text-white" : "eco-text hover:bg-green-100"}`}>Sign Up</button>
          </div>

          {activeTab === "login" && (
            <div className="space-y-4">
              {loginStep === "phone" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold eco-text mb-2">Phone Number</label>
                    <Input placeholder="Enter your phone number" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} className="rounded-xl border-green-200" type="tel" />
                  </div>
                  <Button onClick={handleLoginSendOTP} disabled={isLoading2} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-11">{isLoading2 ? "Sending..." : "Send OTP"}</Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold eco-text mb-2">Enter OTP</label>
                    <Input placeholder="Enter 4-digit OTP (demo: 1234)" value={loginOTP} onChange={(e) => setLoginOTP(e.target.value.slice(0, 4))} className="rounded-xl border-green-200 text-center text-2xl tracking-widest" type="text" />
                    <p className="text-xs eco-text-muted mt-2">OTP sent to {loginPhone}</p>
                  </div>
                  <Button onClick={() => setLoginStep("phone")} variant="outline" className="w-full rounded-xl border-green-200">Change Phone</Button>
                  <Button onClick={handleLoginVerifyOTP} disabled={isLoading2} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-11">{isLoading2 ? "Verifying..." : "Verify & Login"}</Button>
                  <p className="text-xs text-center eco-text-muted">Demo: Use OTP <span className="font-bold">1234</span></p>
                </>
              )}
            </div>
          )}

          {activeTab === "signup" && (
            <div className="space-y-4">
              {signupStep === "phone" ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold eco-text mb-2">Phone Number</label>
                    <Input placeholder="Enter your phone number" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className="rounded-xl border-green-200" type="tel" />
                  </div>
                  <Button onClick={handleSignupSendOTP} disabled={isLoading3} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-11">{isLoading3 ? "Sending..." : "Send OTP"}</Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold eco-text mb-2">Enter OTP</label>
                    <Input placeholder="Enter 4-digit OTP (demo: 1234)" value={signupOTP} onChange={(e) => setSignupOTP(e.target.value.slice(0, 4))} className="rounded-xl border-green-200 text-center text-2xl tracking-widest" type="text" />
                    <p className="text-xs eco-text-muted mt-2">OTP sent to {signupPhone}</p>
                  </div>
                  <Button onClick={() => setSignupStep("phone")} variant="outline" className="w-full rounded-xl border-green-200">Change Phone</Button>
                  <Button onClick={handleSignupVerifyOTP} disabled={isLoading3} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-11">{isLoading3 ? "Verifying..." : "Verify & Sign Up"}</Button>
                  <p className="text-xs text-center eco-text-muted">Demo: Use OTP <span className="font-bold">1234</span></p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--eco-cream))]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return <Component />;
}
