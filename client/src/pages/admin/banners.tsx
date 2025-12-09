import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Image, Monitor, Tablet, Smartphone, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  imageUrlTablet: string | null;
  imageUrlMobile: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  badgeText: string | null;
  displayOrder: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageUrlTablet: string;
  imageUrlMobile: string;
  ctaText: string;
  ctaLink: string;
  badgeText: string;
  displayOrder: number;
  isActive: boolean;
}

const defaultFormData: BannerFormData = {
  title: "",
  subtitle: "",
  imageUrl: "",
  imageUrlTablet: "",
  imageUrlMobile: "",
  ctaText: "Shop Now",
  ctaLink: "/shop",
  badgeText: "",
  displayOrder: 0,
  isActive: true,
};

export default function AdminBanners() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(defaultFormData);
  const [previewTab, setPreviewTab] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const res = await fetch("/api/banners", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BannerFormData) => {
      const res = await fetch("/api/banners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Success", description: "Banner created successfully" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create banner", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BannerFormData }) => {
      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Success", description: "Banner updated successfully" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update banner", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Success", description: "Banner deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete banner", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const banner = banners.find(b => b.id === id);
      if (!banner) throw new Error("Banner not found");
      
      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, isActive }),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
    },
  });

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingBanner(null);
    setIsDialogOpen(false);
    setPreviewTab("desktop");
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      imageUrlTablet: banner.imageUrlTablet || "",
      imageUrlMobile: banner.imageUrlMobile || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      badgeText: banner.badgeText || "",
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const availableDesktopImages = [
    { url: "/banners/fresh_milk_pour_splash_banner.png", name: "Fresh Milk Pour" },
    { url: "/banners/farm_milk_bottles_pastoral_scene.png", name: "Farm Pastoral" },
    { url: "/banners/premium_dairy_products_showcase.png", name: "Premium Products" },
  ];

  const getPreviewImage = () => {
    if (previewTab === "mobile" && formData.imageUrlMobile) return formData.imageUrlMobile;
    if (previewTab === "tablet" && formData.imageUrlTablet) return formData.imageUrlTablet;
    return formData.imageUrl;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-500">Manage homepage hero banners with responsive images</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Edit Banner" : "Create New Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter banner title"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter banner subtitle/description"
                    rows={2}
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Responsive Images</Label>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewTab("desktop")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          previewTab === "desktop" ? "bg-white shadow text-green-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab("tablet")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          previewTab === "tablet" ? "bg-white shadow text-green-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Tablet className="w-3.5 h-3.5" />
                        Tablet
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab("mobile")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          previewTab === "mobile" ? "bg-white shadow text-green-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`space-y-2 p-3 rounded-lg border-2 transition-colors ${previewTab === "desktop" ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-600" />
                        <Label className="text-sm font-medium">Desktop Image *</Label>
                      </div>
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="/banners/desktop.png"
                        required
                        className="text-xs"
                      />
                      <p className="text-[10px] text-gray-500">1920x700px recommended</p>
                    </div>

                    <div className={`space-y-2 p-3 rounded-lg border-2 transition-colors ${previewTab === "tablet" ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4 text-gray-600" />
                        <Label className="text-sm font-medium">Tablet Image</Label>
                      </div>
                      <Input
                        value={formData.imageUrlTablet}
                        onChange={(e) => setFormData({ ...formData, imageUrlTablet: e.target.value })}
                        placeholder="/banners/tablet.png"
                        className="text-xs"
                      />
                      <p className="text-[10px] text-gray-500">1024x600px recommended</p>
                    </div>

                    <div className={`space-y-2 p-3 rounded-lg border-2 transition-colors ${previewTab === "mobile" ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-600" />
                        <Label className="text-sm font-medium">Mobile Image</Label>
                      </div>
                      <Input
                        value={formData.imageUrlMobile}
                        onChange={(e) => setFormData({ ...formData, imageUrlMobile: e.target.value })}
                        placeholder="/banners/mobile.png"
                        className="text-xs"
                      />
                      <p className="text-[10px] text-gray-500">640x400px recommended</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <p className="w-full text-xs text-gray-500">Quick select (Desktop):</p>
                    {availableDesktopImages.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                        className={`text-xs px-2 py-1 rounded border ${formData.imageUrl === img.url ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-green-400'}`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>

                  {getPreviewImage() && (
                    <div className="rounded-lg overflow-hidden border bg-gray-100">
                      <div className="bg-gray-200 px-3 py-1.5 text-xs text-gray-600 flex items-center gap-2">
                        {previewTab === "desktop" && <Monitor className="w-3.5 h-3.5" />}
                        {previewTab === "tablet" && <Tablet className="w-3.5 h-3.5" />}
                        {previewTab === "mobile" && <Smartphone className="w-3.5 h-3.5" />}
                        Preview: {previewTab.charAt(0).toUpperCase() + previewTab.slice(1)}
                        {previewTab !== "desktop" && !getPreviewImage().includes(previewTab) && (
                          <span className="text-amber-600 ml-2">(using desktop fallback)</span>
                        )}
                      </div>
                      <img 
                        src={getPreviewImage()} 
                        alt="Preview" 
                        className={`w-full object-cover ${
                          previewTab === "mobile" ? "h-32" : previewTab === "tablet" ? "h-36" : "h-40"
                        }`}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Shop Now"
                  />
                </div>

                <div>
                  <Label>CTA Link</Label>
                  <Input
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/shop"
                  />
                </div>

                <div>
                  <Label>Badge Text</Label>
                  <Input
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="25% OFF, New, etc."
                  />
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingBanner ? "Update Banner" : "Create Banner"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{banners.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Active Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{banners.filter(b => b.isActive).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">With Mobile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{banners.filter(b => b.imageUrlMobile).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">With Tablet Image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{banners.filter(b => b.imageUrlTablet).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            All Banners
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading banners...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No banners yet. Create your first banner to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell className="font-medium text-gray-500">
                      <GripVertical className="w-4 h-4 inline mr-1" />
                      {banner.displayOrder}
                    </TableCell>
                    <TableCell>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        {banner.subtitle && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">{banner.subtitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          <Monitor className="w-3 h-3" />
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${banner.imageUrlTablet ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-400'}`}>
                          <Tablet className="w-3 h-3" />
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${banner.imageUrlMobile ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>
                          <Smartphone className="w-3 h-3" />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {banner.badgeText ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {banner.badgeText}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: banner.id, isActive: checked })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this banner?")) {
                              deleteMutation.mutate(banner.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
