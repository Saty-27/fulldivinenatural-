import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  User, 
  Phone, 
  Calendar,
  Save,
  Send,
  AlertCircle,
  FileImage,
  X,
  Milk,
  TrendingUp,
  CheckCircle,
  Info
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation schema according to prompt requirements
const inwardEntrySchema = z.object({
  litersArrived: z.number().min(0, "Cannot be negative").max(10000, "Exceeds maximum limit"),
  litersDelivered: z.number().min(0, "Cannot be negative"),
  litersPending: z.number().min(0, "Cannot be negative"),
  driverId: z.string().min(1, "Driver selection is required"),
  driverInfo: z.object({
    name: z.string().min(1, "Driver name is required"),
    age: z.number().min(18, "Driver must be at least 18 years old"),
    phone: z.string().min(10, "Valid phone number required"),
    aadharUrl: z.string().optional(),
    panUrl: z.string().optional(),
  }),
  notes: z.string().optional(),
});

interface InwardEntryModalProps {
  trigger: React.ReactNode;
}

export default function InwardEntryModal({ trigger }: InwardEntryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    litersArrived: "",
    litersDelivered: "",
    litersPending: "",
    driverId: "",
    driverInfo: {
      name: "",
      age: "",
      phone: "",
      aadharUrl: "",
      panUrl: "",
    },
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingNewDriver, setIsAddingNewDriver] = useState(false);

  // Fetch drivers for selection
  const { data: drivers } = useQuery({
    queryKey: ["/api/vendor/drivers"],
    retry: false,
  });

  // Auto-calculate pending liters
  const calculatePendingLiters = () => {
    const arrived = parseFloat(formData.litersArrived) || 0;
    const delivered = parseFloat(formData.litersDelivered) || 0;
    const pending = Math.max(0, arrived - delivered);
    setFormData(prev => ({ ...prev, litersPending: pending.toString() }));
  };

  // Handle driver selection
  const handleDriverSelect = (driverId: string) => {
    if (driverId === "new") {
      setIsAddingNewDriver(true);
      setFormData(prev => ({ 
        ...prev, 
        driverId: "",
        driverInfo: { name: "", age: "", phone: "", aadharUrl: "", panUrl: "" }
      }));
    } else {
      const selectedDriver = Array.isArray(drivers) ? drivers.find((d: any) => d.id.toString() === driverId) : null;
      if (selectedDriver) {
        setFormData(prev => ({ 
          ...prev, 
          driverId,
          driverInfo: {
            name: selectedDriver.name,
            age: selectedDriver.age.toString(),
            phone: selectedDriver.phone,
            aadharUrl: selectedDriver.aadharUrl || "",
            panUrl: selectedDriver.panUrl || "",
          }
        }));
        setIsAddingNewDriver(false);
      }
    }
  };

  // File upload simulation (in real app, would upload to cloud storage)
  const handleFileUpload = (type: 'aadhar' | 'pan', file: File) => {
    // Simulate file upload
    const mockUrl = `https://example.com/${type}_${Date.now()}.jpg`;
    setFormData(prev => ({
      ...prev,
      driverInfo: {
        ...prev.driverInfo,
        [`${type}Url`]: mockUrl
      }
    }));
    toast({
      title: "🎉 File Uploaded Successfully!",
      description: `${type.toUpperCase()} document uploaded and ready for submission`,
    });
  };

  // Validate form
  const validateForm = (isDraft = false) => {
    const newErrors: Record<string, string> = {};

    if (!isDraft) {
      // Full validation for sending to admin
      try {
        const numericData = {
          litersArrived: parseFloat(formData.litersArrived),
          litersDelivered: parseFloat(formData.litersDelivered),
          litersPending: parseFloat(formData.litersPending),
          driverId: formData.driverId || "temp",
          driverInfo: {
            name: formData.driverInfo.name,
            age: parseInt(formData.driverInfo.age),
            phone: formData.driverInfo.phone,
            aadharUrl: formData.driverInfo.aadharUrl,
            panUrl: formData.driverInfo.panUrl,
          },
          notes: formData.notes,
        };

        inwardEntrySchema.parse(numericData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            const field = err.path.join('.');
            newErrors[field] = err.message;
          });
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit mutations
  const saveDraftMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/vendor/inward", { ...data, sentToAdmin: false });
    },
    onSuccess: () => {
      toast({
        title: "💾 Draft Saved Successfully!",
        description: "Your inward entry has been saved and can be edited later",
      });
      setIsOpen(false);
      resetForm();
    },
  });

  const sendToAdminMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/vendor/inward", { ...data, sentToAdmin: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/inward"] });
      toast({
        title: "🚀 Sent to Admin Successfully!",
        description: "Your inward entry has been submitted for admin approval",
      });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "❌ Submission Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      litersArrived: "",
      litersDelivered: "",
      litersPending: "",
      driverId: "",
      driverInfo: { name: "", age: "", phone: "", aadharUrl: "", panUrl: "" },
      notes: "",
    });
    setErrors({});
    setIsAddingNewDriver(false);
  };

  const handleSaveDraft = () => {
    if (validateForm(true)) {
      saveDraftMutation.mutate({
        ...formData,
        litersArrived: parseFloat(formData.litersArrived) || 0,
        litersDelivered: parseFloat(formData.litersDelivered) || 0,
        litersPending: parseFloat(formData.litersPending) || 0,
      });
    }
  };

  const handleSendToAdmin = () => {
    if (validateForm(false)) {
      sendToAdminMutation.mutate({
        ...formData,
        litersArrived: parseFloat(formData.litersArrived) || 0,
        litersDelivered: parseFloat(formData.litersDelivered) || 0,
        litersPending: parseFloat(formData.litersPending) || 0,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto eco-dialog">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
            <div className="w-12 h-12 eco-gradient rounded-2xl flex items-center justify-center mr-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            📋 Inward Entry Submission
          </DialogTitle>
          <p className="text-lg text-[hsl(var(--eco-text-muted))] font-medium">Submit your daily milk delivery report with complete details</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Enhanced Milk Quantities Section */}
          <Card className="kpi-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                🥛 Milk Quantities
                <Info className="w-5 h-5 ml-2 eco-icon-primary" />
              </CardTitle>
              <p className="text-[hsl(var(--eco-text-muted))] font-medium">Enter the exact milk quantities for accurate tracking</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="litersArrived" className="eco-form-label text-lg">🚛 Liters Arrived *</Label>
                  <Input
                    id="litersArrived"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.litersArrived}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, litersArrived: e.target.value }));
                      setTimeout(calculatePendingLiters, 100);
                    }}
                    className={`eco-input text-lg font-semibold ${errors["litersArrived"] ? "border-red-500" : ""}`}
                    placeholder="e.g., 500"
                  />
                  {errors["litersArrived"] && (
                    <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["litersArrived"]}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="litersDelivered" className="eco-form-label text-lg">✅ Liters Delivered *</Label>
                  <Input
                    id="litersDelivered"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.litersDelivered}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, litersDelivered: e.target.value }));
                      setTimeout(calculatePendingLiters, 100);
                    }}
                    className={`eco-input text-lg font-semibold ${errors["litersDelivered"] ? "border-red-500" : ""}`}
                    placeholder="e.g., 480"
                  />
                  {errors["litersDelivered"] && (
                    <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["litersDelivered"]}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="litersPending" className="eco-form-label text-lg">⏳ Liters Pending</Label>
                  <Input
                    id="litersPending"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.litersPending}
                    onChange={(e) => setFormData(prev => ({ ...prev, litersPending: e.target.value }))}
                    className="eco-input text-lg font-semibold bg-gradient-to-r from-gray-50 to-blue-50"
                    placeholder="Auto-calculated"
                  />
                  <p className="text-sm text-[hsl(var(--eco-text-muted))] mt-1 font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
                    Auto-calculated: Arrived - Delivered
                  </p>
                </div>
              </div>

              {/* Visual Progress Indicator */}
              {formData.litersArrived && formData.litersDelivered && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[hsl(var(--eco-secondary))]">📊 Delivery Progress</span>
                    <span className="text-lg font-black text-[hsl(var(--eco-primary))]">
                      {Math.round((parseFloat(formData.litersDelivered) / parseFloat(formData.litersArrived)) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, Math.round((parseFloat(formData.litersDelivered) / parseFloat(formData.litersArrived)) * 100) || 0)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Driver Information Section */}
          <Card className="kpi-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                👤 Driver Information
                <Info className="w-5 h-5 ml-2 eco-icon-primary" />
              </CardTitle>
              <p className="text-[hsl(var(--eco-text-muted))] font-medium">Select existing driver or add new team member with KYC details</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAddingNewDriver ? (
                <div className="space-y-4">
                  <Label htmlFor="driverSelect" className="eco-form-label text-lg">🚗 Select Driver *</Label>
                  <Select value={formData.driverId} onValueChange={handleDriverSelect}>
                    <SelectTrigger className={`eco-input text-lg font-semibold ${errors["driverId"] ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Choose a driver or add new member" />
                    </SelectTrigger>
                    <SelectContent className="eco-dialog">
                      {Array.isArray(drivers) && drivers.map((driver: any) => (
                        <SelectItem key={driver.id} value={driver.id.toString()} className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-[hsl(var(--eco-secondary))]">{driver.name}</span>
                              <p className="text-sm text-[hsl(var(--eco-text-muted))]">{driver.phone}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="new" className="p-4">
                        <div className="flex items-center space-x-3 text-[hsl(var(--eco-primary))]">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold">➕ Add New Driver</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors["driverId"] && (
                    <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["driverId"]}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6 border-2 border-dashed border-[hsl(var(--eco-primary))] rounded-2xl p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <Label className="eco-form-label text-xl">➕ New Driver Details</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingNewDriver(false)}
                      className="eco-button-outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="driverName" className="eco-form-label">👤 Driver Name *</Label>
                      <Input
                        id="driverName"
                        value={formData.driverInfo.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          driverInfo: { ...prev.driverInfo, name: e.target.value }
                        }))}
                        className={`eco-input text-lg font-semibold ${errors["driverInfo.name"] ? "border-red-500" : ""}`}
                        placeholder="e.g., Ramesh Kumar"
                      />
                      {errors["driverInfo.name"] && (
                        <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors["driverInfo.name"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="driverAge" className="eco-form-label">📅 Age *</Label>
                      <Input
                        id="driverAge"
                        type="number"
                        min="18"
                        max="70"
                        value={formData.driverInfo.age}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          driverInfo: { ...prev.driverInfo, age: e.target.value }
                        }))}
                        className={`eco-input text-lg font-semibold ${errors["driverInfo.age"] ? "border-red-500" : ""}`}
                        placeholder="e.g., 32"
                      />
                      {errors["driverInfo.age"] && (
                        <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors["driverInfo.age"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="driverPhone" className="eco-form-label">📱 Phone Number *</Label>
                      <Input
                        id="driverPhone"
                        type="tel"
                        value={formData.driverInfo.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          driverInfo: { ...prev.driverInfo, phone: e.target.value }
                        }))}
                        className={`eco-input text-lg font-semibold ${errors["driverInfo.phone"] ? "border-red-500" : ""}`}
                        placeholder="+91-9876543210"
                      />
                      {errors["driverInfo.phone"] && (
                        <p className="text-sm text-red-500 mt-1 font-semibold flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors["driverInfo.phone"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced KYC Document Uploads */}
              {(formData.driverInfo.name || formData.driverId) && (
                <div className="space-y-6 border border-[hsl(var(--eco-light))] rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <Label className="eco-form-label text-xl flex items-center">
                    📄 KYC Documents (Optional)
                    <Badge className="eco-badge ml-3">Secure Upload</Badge>
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="eco-form-label text-lg">🆔 Aadhar Card</Label>
                      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-white">
                        {formData.driverInfo.aadharUrl ? (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 text-sm font-bold">
                              <FileImage className="w-4 h-4 mr-2" />
                              ✅ Uploaded Successfully
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                driverInfo: { ...prev.driverInfo, aadharUrl: "" }
                              }))}
                              className="eco-button-outline"
                            >
                              🗑️ Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <Button
                              type="button"
                              className="eco-button-secondary"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,.pdf';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload('aadhar', file);
                                };
                                input.click();
                              }}
                            >
                              <Upload className="w-5 h-5 mr-2" />
                              📤 Upload Aadhar
                            </Button>
                            <p className="text-sm text-[hsl(var(--eco-text-muted))] font-medium">JPG, PNG, PDF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="eco-form-label text-lg">💳 PAN Card</Label>
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-white">
                        {formData.driverInfo.panUrl ? (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 text-sm font-bold">
                              <FileImage className="w-4 h-4 mr-2" />
                              ✅ Uploaded Successfully
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                driverInfo: { ...prev.driverInfo, panUrl: "" }
                              }))}
                              className="eco-button-outline"
                            >
                              🗑️ Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <Button
                              type="button"
                              className="eco-button-secondary"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,.pdf';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload('pan', file);
                                };
                                input.click();
                              }}
                            >
                              <Upload className="w-5 h-5 mr-2" />
                              📤 Upload PAN
                            </Button>
                            <p className="text-sm text-[hsl(var(--eco-text-muted))] font-medium">JPG, PNG, PDF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Notes Section */}
          <Card className="kpi-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                📝 Additional Notes
                <Info className="w-5 h-5 ml-2 eco-icon-primary" />
              </CardTitle>
              <p className="text-[hsl(var(--eco-text-muted))] font-medium">Add any important observations or remarks about today's delivery</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="📋 Any additional remarks or observations about today's delivery..."
                className="eco-input min-h-[120px] text-lg font-medium resize-none"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Enhanced Validation Warnings */}
          {Object.keys(errors).length > 0 && (
            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-black text-red-800 mb-2">⚠️ Please fix the following errors:</p>
                <ul className="text-red-700 space-y-2">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="flex items-center font-semibold">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t-2 border-[hsl(var(--eco-light))]">
            <Button
              type="button"
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending}
              className="flex-1 eco-button-outline h-16 text-lg font-bold"
            >
              <Save className="w-6 h-6 mr-3" />
              {saveDraftMutation.isPending ? "💾 Saving..." : "💾 Save Draft"}
            </Button>
            
            <Button
              type="button"
              onClick={handleSendToAdmin}
              disabled={sendToAdminMutation.isPending}
              className="flex-1 eco-button h-16 text-lg font-bold"
            >
              <Send className="w-6 h-6 mr-3" />
              {sendToAdminMutation.isPending ? "🚀 Sending..." : "🚀 Send to Admin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}