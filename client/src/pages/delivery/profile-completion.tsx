import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, FileText, CreditCard, CheckCircle, AlertCircle, Upload } from "lucide-react";

export default function ProfileCompletion() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"personal" | "address" | "documents" | "bank" | "review">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const partnerId = localStorage.getItem("deliveryPartnerId");

  // Redirect if no partner ID
  if (!partnerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Session expired. Please login again.</p>
          <Button onClick={() => navigate("/delivery/login")} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    profilePhoto: "",
    dob: "",
    gender: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhaarNumber: "",
    panNumber: "",
    licenseNumber: "",
    licenseValidity: "",
    vehicleNumber: "",
    bankAccount: "",
    bankIfsc: "",
    bankName: "",
    bankHolder: "",
    agreeDocuments: false,
    agreeTerms: false,
  });

  const [uploads, setUploads] = useState<Record<string, string>>({
    profilePhoto: "",
    aadhaarFront: "",
    aadhaarBack: "",
    panFront: "",
    licenseFront: "",
    licenseBack: "",
    vehicleRC: "",
    bankProof: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (field: string, file: File) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 5MB", variant: "destructive" });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploads((prev) => ({ ...prev, [field]: base64 }));
      toast({ title: "✅ File uploaded successfully", description: file.name });
    };
    reader.onerror = () => {
      toast({ title: "Error", description: "Failed to read file", variant: "destructive" });
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.dob) {
      toast({ title: "Error", description: "Date of birth is required", variant: "destructive" });
      return false;
    }
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      toast({ title: "Error", description: "Valid 12-digit Aadhaar required", variant: "destructive" });
      return false;
    }
    if (!formData.panNumber || formData.panNumber.length !== 10) {
      toast({ title: "Error", description: "Valid 10-character PAN required", variant: "destructive" });
      return false;
    }
    if (!formData.licenseNumber) {
      toast({ title: "Error", description: "License number required", variant: "destructive" });
      return false;
    }
    if (!formData.bankAccount || formData.bankAccount.length < 10) {
      toast({ title: "Error", description: "Valid bank account required", variant: "destructive" });
      return false;
    }
    if (!formData.agreeDocuments || !formData.agreeTerms) {
      toast({ title: "Error", description: "Please agree to all declarations", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmitProfile = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Combine form data with uploads
      const submitData = {
        ...formData,
        profileImageUrl: uploads.profilePhoto,
        aadhaarFrontUrl: uploads.aadhaarFront,
        aadhaarBackUrl: uploads.aadhaarBack,
        panImageUrl: uploads.panFront,
        licenseImageUrl: uploads.licenseFront,
        licenseBackUrl: uploads.licenseBack,
        vehicleRcUrl: uploads.vehicleRC,
        bankPassbookUrl: uploads.bankProof,
      };

      const res = await fetch(`/api/delivery/${partnerId}/submit-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
        credentials: "include",
      });

      if (res.ok) {
        toast({ title: "✅ Profile submitted for verification!" });
        setTimeout(() => navigate("/delivery/dashboard"), 2000);
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message || "Submission failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Submission failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-emerald-600 mb-2">📋</div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Submit required documents for verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-4">
          {["Personal", "Address", "Documents", "Bank", "Review"].map((step, idx) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 cursor-pointer ${
                  activeTab === step.toLowerCase().replace(" ", "")
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setActiveTab(step.toLowerCase().replace(" ", "") as any)}
              >
                {idx + 1}
              </div>
              <span className="text-xs font-medium text-gray-600">{step}</span>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <CardTitle className="flex items-center gap-2">
              {activeTab === "personal" && <User className="w-5 h-5" />}
              {activeTab === "address" && <MapPin className="w-5 h-5" />}
              {activeTab === "documents" && <FileText className="w-5 h-5" />}
              {activeTab === "bank" && <CreditCard className="w-5 h-5" />}
              {activeTab === "review" && <CheckCircle className="w-5 h-5" />}
              {activeTab === "personal" && "Personal Details"}
              {activeTab === "address" && "Address Information"}
              {activeTab === "documents" && "Government Documents"}
              {activeTab === "bank" && "Bank Details"}
              {activeTab === "review" && "Review & Submit"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Personal Details Tab */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition block">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload photo</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => e.target.files && handleFileUpload("profilePhoto", e.target.files[0])} 
                    />
                    {uploads.profilePhoto ? <p className="text-xs text-green-600 mt-2">✓ Uploaded</p> : null}
                    {!uploads.profilePhoto && <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>}
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    placeholder="+91"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea
                    name="address"
                    placeholder="Street, area, locality"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Aadhaar Card</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      placeholder="12-digit number"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Front</p>
                      {uploads.aadhaarFront && <p className="text-xs text-green-600">✓</p>}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFileUpload("aadhaarFront", e.target.files[0])} 
                      />
                    </label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Back</p>
                      {uploads.aadhaarBack && <p className="text-xs text-green-600">✓</p>}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFileUpload("aadhaarBack", e.target.files[0])} 
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">PAN Card</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                  <input
                    type="text"
                    name="panNumber"
                    placeholder="10-character PAN"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-3"
                  />
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Upload PAN Image</p>
                    {uploads.panFront && <p className="text-xs text-green-600">✓</p>}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => e.target.files && handleFileUpload("panFront", e.target.files[0])} 
                    />
                  </label>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Driving License</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Validity Date *</label>
                      <input
                        type="date"
                        name="licenseValidity"
                        value={formData.licenseValidity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Front</p>
                      {uploads.licenseFront && <p className="text-xs text-green-600">✓</p>}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFileUpload("licenseFront", e.target.files[0])} 
                      />
                    </label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Back</p>
                      {uploads.licenseBack && <p className="text-xs text-green-600">✓</p>}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFileUpload("licenseBack", e.target.files[0])} 
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number Plate *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="e.g., MH01AB1234"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-3"
                  />
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-500">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">RC Book</p>
                    {uploads.vehicleRC && <p className="text-xs text-green-600">✓</p>}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => e.target.files && handleFileUpload("vehicleRC", e.target.files[0])} 
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Bank Tab */}
            {activeTab === "bank" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number *</label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      name="bankIfsc"
                      value={formData.bankIfsc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    name="bankHolder"
                    value={formData.bankHolder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Passbook/Cancelled Cheque</label>
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 block">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                    {uploads.bankProof && <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>}
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      className="hidden" 
                      onChange={(e) => e.target.files && handleFileUpload("bankProof", e.target.files[0])} 
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Review Tab */}
            {activeTab === "review" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Review:</span> Please carefully review all information before submitting. Once submitted, your documents will be sent for admin verification.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeDocuments"
                      checked={formData.agreeDocuments}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-0.5 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      I confirm that all documents provided are genuine and accurate.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-0.5 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      I agree to Divine Naturals terms and privacy policies.
                    </label>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>After submission, your profile will be reviewed by our admin team. You'll receive a notification once verified.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                onClick={() => {
                  const tabs = ["personal", "address", "documents", "bank", "review"];
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1] as any);
                }}
                disabled={activeTab === "personal"}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>

              {activeTab !== "review" && (
                <Button
                  onClick={() => {
                    const tabs = ["personal", "address", "documents", "bank", "review"];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1] as any);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Next
                </Button>
              )}

              {activeTab === "review" && (
                <Button
                  onClick={handleSubmitProfile}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
