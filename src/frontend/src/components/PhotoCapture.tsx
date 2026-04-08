import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Plus, SwitchCamera, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";

interface PhotoCaptureProps {
  onPhotoAdd: (imageData: string, locationName: string) => void;
}

interface BulkUploadItem {
  file: File;
  previewUrl: string;
  locationName: string;
}

export default function PhotoCapture({ onPhotoAdd }: PhotoCaptureProps) {
  const [locationName, setLocationName] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "bulk">(
    "camera",
  );
  const [bulkUploads, setBulkUploads] = useState<BulkUploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    width: 1920,
    height: 1080,
    quality: 0.92,
    format: "image/jpeg",
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBulkFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newBulkUploads: BulkUploadItem[] = [];
    let validFiles = 0;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB size limit`);
        continue;
      }

      validFiles++;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newBulkUploads.push({
          file,
          previewUrl: dataUrl,
          locationName: "",
        });

        // When all files are processed, update state
        if (newBulkUploads.length === validFiles) {
          setBulkUploads((prev) => [...prev, ...newBulkUploads]);
          toast.success(
            `${validFiles} photo${validFiles > 1 ? "s" : ""} added for bulk upload`,
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapturePhoto = async () => {
    const photoFile = await capturePhoto();
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCapturedImage(dataUrl);
      };
      reader.readAsDataURL(photoFile);
    }
  };

  const handleAddPhoto = () => {
    if (!locationName.trim()) {
      toast.error("Please enter a location name");
      return;
    }

    let imageData: string | null = null;

    if (activeTab === "camera" && capturedImage) {
      imageData = capturedImage;
    } else if (activeTab === "upload" && previewUrl) {
      imageData = previewUrl;
    }

    if (!imageData) {
      toast.error("Please capture or select a photo first");
      return;
    }

    onPhotoAdd(imageData, locationName.trim());

    // Reset form
    setLocationName("");
    setCapturedImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBulkLocationChange = (index: number, value: string) => {
    setBulkUploads((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, locationName: value } : item,
      ),
    );
  };

  const handleRemoveBulkItem = (index: number) => {
    setBulkUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAllBulkPhotos = () => {
    const itemsWithoutLocation = bulkUploads.filter(
      (item) => !item.locationName.trim(),
    );

    if (itemsWithoutLocation.length > 0) {
      toast.error(
        `Please enter location names for all ${itemsWithoutLocation.length} photo${itemsWithoutLocation.length > 1 ? "s" : ""}`,
      );
      return;
    }

    if (bulkUploads.length === 0) {
      toast.error("No photos to add");
      return;
    }

    for (const item of bulkUploads) {
      onPhotoAdd(item.previewUrl, item.locationName.trim());
    }

    toast.success(
      `${bulkUploads.length} photo${bulkUploads.length > 1 ? "s" : ""} added successfully`,
    );

    // Reset bulk uploads
    setBulkUploads([]);
    if (bulkFileInputRef.current) {
      bulkFileInputRef.current.value = "";
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
  };

  const handleRemoveUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "camera" | "upload" | "bulk")}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Take Photo</span>
              <span className="sm:hidden">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Photo</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
              <span className="sm:hidden">Bulk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            {isSupported === false && (
              <Alert variant="destructive">
                <AlertDescription>
                  Camera is not supported on this device or browser.
                </AlertDescription>
              </Alert>
            )}

            {cameraError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {cameraError.message}
                  {cameraError.type === "permission" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={retry}
                    >
                      Retry
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {!capturedImage ? (
                <>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button
                        onClick={startCamera}
                        disabled={cameraLoading || isSupported === false}
                        className="flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleCapturePhoto} className="flex-1">
                          <Camera className="w-4 h-4 mr-2" />
                          Capture Photo
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => switchCamera()}
                          disabled={cameraLoading}
                          className="hidden md:flex"
                        >
                          <SwitchCamera className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={stopCamera}
                          disabled={cameraLoading}
                        >
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRetakePhoto}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Retake Photo
                  </Button>
                </>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label
                  htmlFor="location-name"
                  className="text-base font-semibold"
                >
                  Location Name
                </Label>
                <Input
                  id="location-name"
                  placeholder="e.g., Paris, France"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleAddPhoto}
                disabled={!locationName.trim() || !capturedImage}
                className="w-full h-12 text-base"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Photo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="sr-only"
              />
              {previewUrl ? (
                <>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRemoveUpload}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </>
              ) : (
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </label>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label
                  htmlFor="location-name-upload"
                  className="text-base font-semibold"
                >
                  Location Name
                </Label>
                <Input
                  id="location-name-upload"
                  placeholder="e.g., Paris, France"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleAddPhoto}
                disabled={!locationName.trim() || !previewUrl}
                className="w-full h-12 text-base"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Photo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <input
                ref={bulkFileInputRef}
                id="bulk-photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleBulkFileInputChange}
                className="sr-only"
              />

              <label
                htmlFor="bulk-photo-upload"
                className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">
                  Click to select multiple photos
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 10MB each
                </p>
              </label>

              {bulkUploads.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      {bulkUploads.length} photo
                      {bulkUploads.length > 1 ? "s" : ""} selected
                    </p>
                  </div>

                  {bulkUploads.map((item, index) => (
                    <div
                      key={item.previewUrl}
                      className="flex gap-3 p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={item.previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-muted-foreground truncate">
                          {item.file.name}
                        </p>
                        <Input
                          placeholder="Enter location name"
                          value={item.locationName}
                          onChange={(e) =>
                            handleBulkLocationChange(index, e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBulkItem(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {bulkUploads.length > 0 && (
                <Button
                  onClick={handleAddAllBulkPhotos}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add All {bulkUploads.length} Photo
                  {bulkUploads.length > 1 ? "s" : ""}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
