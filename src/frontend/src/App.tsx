import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "./components/Footer";
import GenerateButton from "./components/GenerateButton";
import Header from "./components/Header";
import PhotoCapture from "./components/PhotoCapture";
import PhotoList from "./components/PhotoList";

export interface PhotoItem {
  id: string;
  imageData: string; // base64 data URL
  locationName: string;
  timestamp: number;
}

const STORAGE_KEY = "pptx-photos";

function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load photos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPhotos(parsed);
      }
    } catch (error) {
      console.error("Error loading photos from storage:", error);
      toast.error("Failed to load saved photos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
      } catch (error) {
        console.error("Error saving photos to storage:", error);
        toast.error("Failed to save photos. Storage may be full.");
      }
    }
  }, [photos, isLoading]);

  const addPhoto = (imageData: string, locationName: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newPhoto: PhotoItem = {
      id,
      imageData,
      locationName,
      timestamp: Date.now(),
    };
    setPhotos((prev) => [...prev, newPhoto]);
    toast.success("Photo added successfully");
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Photo removed");
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Photo to PowerPoint Generator
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                  Capture or upload photos with location names and generate a
                  PowerPoint presentation offline
                </p>
              </div>

              <PhotoCapture onPhotoAdd={addPhoto} />

              {photos.length > 0 && (
                <>
                  <PhotoList photos={photos} onRemove={removePhoto} />
                  <GenerateButton photos={photos} onComplete={clearAllPhotos} />
                </>
              )}

              {photos.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                    >
                      <title>Camera icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    No photos added yet. Start by capturing or uploading your
                    first photo above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
