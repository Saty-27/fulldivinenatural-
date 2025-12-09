import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PersonalDetails() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    dob: ""
  });

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ 
        title: "Please fill all required fields", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/personal-details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save personal details");
      }

      toast({ title: "✅ Personal details saved successfully!" });
      // STAGE 1: Navigate to address setup after saving personal details
      setLocation("/auth/address");
    } catch (error) {
      console.error("Error:", error);
      toast({ 
        title: "❌ Error saving details", 
        variant: "destructive" 
      });
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
          onClick={() => setLocation("/auth/address")}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Details</h1>
          <p className="text-gray-600">
            Help us know you better. This information is required to proceed.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="border-gray-300 focus:border-green-500"
            />
            <p className="text-xs text-gray-500">Optional</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-8 border-t mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl"
          >
            {isLoading ? "Saving..." : "✅ Continue"}
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Your personal information is secure and will be kept confidential.
        </p>
      </div>
    </div>
  );
}
