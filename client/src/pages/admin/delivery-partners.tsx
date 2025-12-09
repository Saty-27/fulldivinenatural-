import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Lock, LockOpen, CheckCircle, XCircle, Plus, Search, Filter, Eye, MoreHorizontal, Phone, Mail, Navigation, Package, Timer, AlertCircle, Shield } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Hook to fetch real delivery partners data
function useDeliveryPartners() {
  return useQuery({
    queryKey: ["admin-delivery-partners"],
    queryFn: async () => {
      const res = await fetch("/api/admin/delivery-partners", { 
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch delivery partners");
      }
      return res.json();
    },
    retry: 2,
  });
}

// Hook to verify delivery partner
function useVerifyPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partnerId, action, username, tempPassword }: any) => {
      const res = await fetch(`/api/admin/delivery-partners/${partnerId}/verify`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, username, tempPassword })
      });
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
    }
  });
}

// Hook to block/unblock delivery partner
function useBlockPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partnerId, action, reason }: any) => {
      const res = await fetch(`/api/admin/delivery-partners/${partnerId}/block`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason })
      });
      if (!res.ok) throw new Error("Block action failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
    }
  });
}

// Hook to add new delivery partner
function useAddPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/admin/delivery-partners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add partner");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
    }
  });
}

// Hook to approve partner documents
function useApproveDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partnerId, remarks }: any) => {
      const res = await fetch(`/api/admin/delivery-partners/${partnerId}/approve-documents`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks })
      });
      if (!res.ok) throw new Error("Approval failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
    }
  });
}

// Hook to reject partner documents
function useRejectDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ partnerId, remarks }: any) => {
      const res = await fetch(`/api/admin/delivery-partners/${partnerId}/reject-documents`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks })
      });
      if (!res.ok) throw new Error("Rejection failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
    }
  });
}

// Documents Verification Modal Component
function DocumentsVerificationModal({ partner, onClose, onApprove, onReject }: any) {
  const [remarks, setRemarks] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verify Documents: {partner?.fullName}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Partner Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Phone</p>
              <p className="text-sm font-medium text-gray-900">{partner?.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Zone</p>
              <p className="text-sm font-medium text-gray-900">{partner?.zone || "Unassigned"}</p>
            </div>
          </div>

          {/* Documents Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Submitted Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-600">Aadhaar</p>
                <p className="font-mono text-gray-900">{partner?.aadhaarNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">PAN</p>
                <p className="font-mono text-gray-900">{partner?.panNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">License</p>
                <p className="font-mono text-gray-900">{partner?.licenseNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Bank Account</p>
                <p className="font-mono text-gray-900">{partner?.bankAccountNumber ? "✓ Submitted" : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Address</p>
                <p className="font-mono text-gray-900">{partner?.address ? "✓ Submitted" : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Submitted Date</p>
                <p className="font-mono text-gray-900">
                  {partner?.documentsSubmittedDate
                    ? new Date(partner.documentsSubmittedDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Uploaded Documents</h3>
            
            {/* Profile Photo */}
            {partner?.profileImageUrl && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Profile Photo</p>
                <img src={partner.profileImageUrl} alt="Profile" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {/* Aadhaar Documents */}
            {(partner?.aadhaarImageUrl) && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Aadhaar Document</p>
                <img src={partner.aadhaarImageUrl} alt="Aadhaar" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {/* PAN Document */}
            {partner?.panImageUrl && (
              <div>
                <p className="text-xs text-gray-600 mb-2">PAN Document</p>
                <img src={partner.panImageUrl} alt="PAN" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {/* License Documents */}
            {partner?.licenseImageUrl && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Driving License</p>
                <img src={partner.licenseImageUrl} alt="License" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {/* Vehicle RC */}
            {partner?.vehicleRcImageUrl && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Vehicle RC / Registration</p>
                <img src={partner.vehicleRcImageUrl} alt="Vehicle RC" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {/* Bank Passbook */}
            {partner?.bankPassbookImageUrl && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Bank Passbook</p>
                <img src={partner.bankPassbookImageUrl} alt="Bank Passbook" className="w-full max-h-40 object-cover rounded-lg border border-gray-300" />
              </div>
            )}

            {!partner?.profileImageUrl && !partner?.aadhaarImageUrl && !partner?.panImageUrl && !partner?.licenseImageUrl && !partner?.vehicleRcImageUrl && !partner?.bankPassbookImageUrl && (
              <p className="text-xs text-gray-500 italic">No document images uploaded yet</p>
            )}
          </div>

          {/* Verification Remarks */}
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">Verification Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add approval or rejection remarks..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setIsApproving(true);
                onApprove({ partnerId: partner.id, remarks });
              }}
              disabled={isApproving || isRejecting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isApproving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Verify
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                if (!remarks) {
                  alert("Please provide rejection reason");
                  return;
                }
                setIsRejecting(true);
                onReject({ partnerId: partner.id, remarks });
              }}
              disabled={isApproving || isRejecting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {isRejecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject & Request Resubmit
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              disabled={isApproving || isRejecting}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Verification Modal Component
function VerificationModal({ partner, onClose, onApprove, onReject }: any) {
  const [username, setUsername] = useState("");
  const [tempPassword, setTempPassword] = useState(generatePassword());

  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle>Verify Partner: {partner?.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900"><strong>Documents:</strong></p>
            <p className="text-xs text-amber-800 mt-1">• Aadhaar: {partner?.aadhaarNumber}</p>
            <p className="text-xs text-amber-800">• PAN: {partner?.panNumber}</p>
            <p className="text-xs text-amber-800">• License: {partner?.licenseNumber}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="auto-generate or enter"
              className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Temporary Password</label>
            <div className="flex gap-2 mt-1">
              <input 
                type="text" 
                value={tempPassword} 
                readOnly
                className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setTempPassword(generatePassword())}
              >
                Regenerate
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onApprove({ partnerId: partner.id, username, tempPassword })}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => onReject({ partnerId: partner.id })}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Block Modal Component
function BlockModal({ partner, isBlocked, onConfirm, onClose }: any) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm bg-white">
        <CardHeader>
          <CardTitle className={isBlocked ? "text-green-600" : "text-red-600"}>
            {isBlocked ? "Unblock" : "Block"} Partner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{partner?.fullName}</p>
          {!isBlocked && (
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for blocking..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
              rows={4}
            />
          )}
          <div className="flex gap-2">
            <Button 
              className={`flex-1 ${isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              onClick={() => onConfirm({ partnerId: partner.id, action: isBlocked ? "unblock" : "block", reason })}
            >
              {isBlocked ? <LockOpen className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              Confirm {isBlocked ? "Unblock" : "Block"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Partner Detail Modal Component
function PartnerDetailModal({ partner, onClose }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [initialPassword, setInitialPassword] = useState("");
  const [selectedZone, setSelectedZone] = useState(partner?.zone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(partner?.status);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const { toast } = useToast();
  
  const toggleStatus = async () => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setIsTogglingStatus(true);
    try {
      const response = await fetch(`/api/admin/delivery-partners/${partner.id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: newStatus === "blocked" ? "block" : "unblock",
          reason: newStatus === "blocked" ? "Toggled from modal" : ""
        }),
      });
      
      if (response.ok) {
        setCurrentStatus(newStatus);
        toast({ 
          title: "Success", 
          description: `Partner status changed to ${newStatus}`,
          variant: "default"
        });
      } else {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Unassigned"];

  // Get initial password from partner data (fetched from database)
  useEffect(() => {
    if (partner?.initialPassword) {
      setInitialPassword(partner.initialPassword);
    }
  }, [partner?.initialPassword]);

  const generatePassword = async () => {
    // Generate random password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pwd = "";
    for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    
    setIsGenerating(true);
    try {
      // Save password to database
      const response = await fetch(`/api/admin/delivery-partners/${partner.id}/generate-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempPassword: pwd }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewPassword(pwd);
        setShowPassword(true);
        toast({ title: "Success", description: "Password generated and saved!", variant: "default" });
      } else {
        toast({ title: "Error", description: "Failed to save password", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate password", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveZoneChange = async () => {
    if (selectedZone === partner.zone) {
      toast({ title: "No Change", description: "Zone is the same as current" });
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/delivery-partners/${partner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone: selectedZone }),
      });
      
      if (response.ok) {
        toast({ title: "Success", description: `Zone changed to ${selectedZone}` });
        // Reload after a short delay
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast({ title: "Error", description: "Failed to update zone", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update zone", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-100 pb-6 sticky top-0 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{partner.fullName}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">ID: #{partner.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={currentStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {currentStatus}
              </Badge>
              <Button
                size="sm"
                onClick={toggleStatus}
                disabled={isTogglingStatus}
                className={currentStatus === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isTogglingStatus ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : currentStatus === 'active' ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Block
                  </>
                ) : (
                  <>
                    <LockOpen className="w-3 h-3 mr-1" />
                    Unblock
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">{partner.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{partner.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Delivery Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-2">Reassign Zone</p>
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {zones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
                {selectedZone !== partner.zone && (
                  <Button 
                    size="sm" 
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveZoneChange}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Zone"}
                  </Button>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-600">Vehicle Type</p>
                <p className="text-sm font-medium text-gray-900">{partner.vehicleType || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-600">Address</p>
                <p className="text-sm font-medium text-gray-900">{partner.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          {partner.username && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Login Credentials
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Username</p>
                  <p className="text-sm font-mono font-medium text-gray-900 break-all bg-white p-2 rounded border border-blue-100 mt-1">{partner.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">Login Password</p>
                  {initialPassword ? (
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                      <p className="text-sm font-mono font-bold text-green-700 break-all p-3 bg-white rounded border border-green-200">
                        {initialPassword}
                      </p>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="w-full mt-3"
                        onClick={() => {
                          navigator.clipboard.writeText(initialPassword);
                          toast({ title: "Copied!", description: "Password copied to clipboard" });
                        }}
                      >
                        Copy Password
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded border border-gray-200">No password available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Verification Status
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Verified</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{partner.is_verified ? "✅ Yes" : "⏳ Pending"}</p>
            </div>
          </div>

          {/* Close Button */}
          <Button className="w-full bg-gray-900 hover:bg-gray-800" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Add Partner Modal Component
function AddPartnerModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    zone: "",
    vehicleType: "bike",
    licenseNumber: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<any>(null);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Generate username from phone
    const username = `driver_${formData.phone.replace(/\D/g, '').slice(-6)}`;
    
    // Set loading state BEFORE calling API
    setIsLoading(true);
    
    // Call onSuccess and wait for it to complete
    try {
      await onSuccess(formData);
      
      // Only show success screen if mutation succeeds
      setCreatedCredentials({
        fullName: formData.fullName,
        username: username,
        password: formData.password,
      });
    } catch (err) {
      // Error already handled by parent, just reset loading
      setIsLoading(false);
    }
  };

  // Show success screen with credentials
  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-6 flex-shrink-0">
            <div className="flex items-center gap-3 justify-center">
              <div className="bg-white/20 p-3 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center mt-4">✅ Partner Created Successfully!</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{createdCredentials.fullName}</span> has been registered with login credentials.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-2">Username</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-gray-900 flex-1 bg-white p-3 rounded border border-blue-100">
                    {createdCredentials.username}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.username);
                      toast({ title: "Copied!", description: "Username copied" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-2">Password</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-green-700 flex-1 bg-green-50 p-3 rounded border border-green-200">
                    {createdCredentials.password}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(createdCredentials.password);
                      toast({ title: "Copied!", description: "Password copied" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const creds = `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}`;
                  navigator.clipboard.writeText(creds);
                  toast({ title: "Copied!", description: "Both credentials copied to clipboard" });
                }}
              >
                Copy Both Credentials
              </Button>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">Important:</span> Save these credentials safely. Share them with the delivery partner for login.
              </p>
            </div>

            <Button 
              className="w-full bg-gray-900 hover:bg-gray-800"
              onClick={() => {
                setCreatedCredentials(null);
                setFormData({
                  fullName: "",
                  email: "",
                  phone: "",
                  zone: "",
                  vehicleType: "bike",
                  licenseNumber: "",
                  address: "",
                  password: "",
                });
                onClose();
              }}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl bg-white max-h-[90vh] flex flex-col">
        <CardHeader className="border-b border-gray-100 pb-6 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Add New Delivery Partner</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Register a new delivery partner for your network</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g., Ramesh Kumar"
                    className={`w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +91 98765 43210"
                    className={`w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., ramesh@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-600" />
                Delivery Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Zone/Area</label>
                  <input 
                    type="text" 
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    placeholder="e.g., Bandra, Santa Cruz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select 
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bike">🏍️ Bike</option>
                    <option value="scooter">🛵 Scooter</option>
                    <option value="auto">🚕 Auto</option>
                    <option value="van">🚐 Van</option>
                    <option value="car">🚗 Car</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, building name, locality"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* License Details Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600" />
                License Information
              </h3>
              <div>
                <label className="text-sm font-medium text-gray-700">License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., DL-XXXX1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Documents can be uploaded after approval</p>
              </div>
            </div>

            {/* Login Credentials Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-600" />
                Login Credentials
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Note:</span> Username will be auto-generated from phone number. Set a secure password for the delivery partner.
                </p>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password *</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="e.g., SecurePass123"
                    className={`w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-6 flex gap-3 flex-shrink-0">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 h-10 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner
                  </>
                )}
              </Button>
              <Button 
                className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 h-10"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DeliveryPartnersPage() {
  const { data: deliveryPartners = [], isLoading } = useDeliveryPartners();
  const verifyMutation = useVerifyPartner();
  const blockMutation = useBlockPartner();
  const addPartnerMutation = useAddPartner();
  const approveDocsMutation = useApproveDocuments();
  const rejectDocsMutation = useRejectDocuments();
  const { toast } = useToast();
  
  const [verificationModal, setVerificationModal] = useState<any>(null);
  const [documentsModal, setDocumentsModal] = useState<any>(null);
  const [blockModal, setBlockModal] = useState<any>(null);
  const [addPartnerModal, setAddPartnerModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<any>(null);

  // Calculate stats from REAL DATA
  const totalPartners = deliveryPartners.length;
  const activePartners = deliveryPartners.filter((p: any) => p.status === "active").length;
  const verifiedPartners = deliveryPartners.filter((p: any) => p.is_verified === true).length;
  const blockedPartners = deliveryPartners.filter((p: any) => p.status === "blocked").length;

  const stats = [
    { title: "Total Partners", value: String(totalPartners), color: "text-blue-600", bgColor: "bg-blue-50", icon: Truck },
    { title: "Active Today", value: String(activePartners), color: "text-green-600", bgColor: "bg-green-50", icon: MapPin },
    { title: "Verified", value: String(verifiedPartners), color: "text-purple-600", bgColor: "bg-purple-50", icon: Shield },
    { title: "Blocked", value: String(blockedPartners), color: "text-red-600", bgColor: "bg-red-50", icon: Lock },
  ];

  // Real columns using database fields
  const partnersColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm text-blue-600">#{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Partner Details',
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{row.getValue('fullName')}</div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {row.original.zone || "Unassigned"}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Package className="w-3 h-3 mr-1" />
            {row.original.vehicleType || "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
      cell: ({ row }: any) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-xs text-gray-600">
            <Phone className="w-3 h-3 mr-1" />
            {row.getValue('phone')}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-1" />
            {row.original.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'is_verified',
      header: 'Verified',
      cell: ({ row }: any) => (
        <Badge className={row.getValue('is_verified') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} variant="outline">
          {row.getValue('is_verified') ? '✓ Yes' : '⏳ Pending'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status') as string;
        const statusConfig: Record<string, any> = {
          active: { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
          blocked: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
          pending_verification: { bg: 'bg-amber-100', text: 'text-amber-800', icon: '🟡' },
          suspended: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🟠' },
        };
        const config = statusConfig[status] || statusConfig.active;
        return (
          <Badge className={`${config.bg} ${config.text} border-gray-200`} variant="outline">
            {config.icon} {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          {row.original.status === 'pending_verification' && (
            <Button
              size="sm"
              variant="outline"
              className="text-amber-600 border-amber-200"
              onClick={() => setDocumentsModal(row.original)}
            >
              <Shield className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className={row.original.status === 'blocked' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}
            onClick={() => setBlockModal(row.original)}
          >
            {row.original.status === 'blocked' ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" className={row.original.passwordHash ? "text-green-600 border-green-200" : "text-gray-600"} onClick={() => setDetailModal(row.original)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleApproveDocuments = async (data: any) => {
    try {
      await approveDocsMutation.mutateAsync(data);
      toast({
        title: "✅ Documents Approved",
        description: "Partner can now access the delivery dashboard",
      });
      setDocumentsModal(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectDocuments = async (data: any) => {
    try {
      await rejectDocsMutation.mutateAsync(data);
      toast({
        title: "❌ Documents Rejected",
        description: "Partner has been notified to resubmit",
      });
      setDocumentsModal(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleApprovePartner = async (data: any) => {
    try {
      await verifyMutation.mutateAsync({ ...data, action: "approve" });
      toast({
        title: "Partner Approved",
        description: `Credentials sent to partner`,
      });
      setVerificationModal(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectPartner = async (data: any) => {
    try {
      await verifyMutation.mutateAsync({ ...data, action: "reject" });
      toast({
        title: "Partner Rejected",
        description: "Partner account has been rejected",
      });
      setVerificationModal(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleBlock = async (data: any) => {
    try {
      await blockMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: `Partner has been ${data.action === "block" ? "blocked" : "unblocked"}`,
      });
      setBlockModal(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPartner = async (formData: any) => {
    try {
      await addPartnerMutation.mutateAsync(formData);
      // Don't close modal - let the success screen show first
      // User will click "Done" to close
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-8 h-8 text-green-600" />
              Delivery Partners
            </h1>
            <p className="text-gray-600 mt-1">Manage delivery network and partner verification</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAddPartnerModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="eco-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Directory Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Partners Directory</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Export
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading delivery partners...</div>
          ) : deliveryPartners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No delivery partners yet. Click "Add Partner" to create one.</p>
            </div>
          ) : (
            <DataTable
              columns={partnersColumns}
              data={filterStatus ? deliveryPartners.filter((p: any) => p.status === filterStatus) : deliveryPartners}
              searchPlaceholder="Search delivery partners..."
            />
          )}
        </div>

        {/* Real-time Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="eco-card hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pending Verification</h3>
                  <p className="text-gray-600 text-sm">{deliveryPartners.filter((p: any) => p.status === 'pending_verification').length} partners awaiting approval</p>
                  <Button variant="outline" size="sm" className="mt-2 text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => setFilterStatus('pending_verification')}>
                    Review Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-red-50">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Blocked Partners</h3>
                  <p className="text-gray-600 text-sm">{blockedPartners} partners currently blocked</p>
                  <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setFilterStatus('blocked')}>
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="eco-card hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-green-50">
                  <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Today</h3>
                  <p className="text-gray-600 text-sm">{activePartners} partners online and ready</p>
                  <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-200 hover:bg-green-50" onClick={() => setFilterStatus('active')}>
                    Assign Routes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {documentsModal && (
        <DocumentsVerificationModal
          partner={documentsModal}
          onClose={() => setDocumentsModal(null)}
          onApprove={handleApproveDocuments}
          onReject={handleRejectDocuments}
        />
      )}

      {verificationModal && (
        <VerificationModal
          partner={verificationModal}
          onClose={() => setVerificationModal(null)}
          onApprove={handleApprovePartner}
          onReject={handleRejectPartner}
        />
      )}
      
      {blockModal && (
        <BlockModal
          partner={blockModal}
          isBlocked={blockModal.status === 'blocked'}
          onConfirm={handleToggleBlock}
          onClose={() => setBlockModal(null)}
        />
      )}

      {addPartnerModal && (
        <AddPartnerModal
          onClose={() => setAddPartnerModal(false)}
          onSuccess={handleAddPartner}
        />
      )}

      {detailModal && (
        <PartnerDetailModal
          partner={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </AdminLayout>
  );
}
