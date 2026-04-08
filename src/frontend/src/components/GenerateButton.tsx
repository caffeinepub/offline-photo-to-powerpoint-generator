import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PhotoItem } from "../App";
import { generatePDF } from "../lib/pdfGenerator";
import { generatePowerPoint } from "../lib/pptxGenerator";

interface GenerateButtonProps {
  photos: PhotoItem[];
  onComplete?: () => void;
}

export default function GenerateButton({ photos }: GenerateButtonProps) {
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGeneratePPT = async () => {
    if (photos.length === 0) {
      toast.error("No photos to generate presentation");
      return;
    }

    setIsGeneratingPPT(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      await generatePowerPoint(photos);

      clearInterval(progressInterval);
      setProgress(100);

      toast.success("PowerPoint generated successfully!");

      // Reset after a short delay
      setTimeout(() => {
        setIsGeneratingPPT(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error generating PowerPoint:", error);
      toast.error("Failed to generate PowerPoint. Please try again.");
      setIsGeneratingPPT(false);
      setProgress(0);
    }
  };

  const handleGeneratePDF = async () => {
    if (photos.length === 0) {
      toast.error("No photos to generate PDF");
      return;
    }

    setIsGeneratingPDF(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      await generatePDF(photos);

      clearInterval(progressInterval);
      setProgress(100);

      toast.success("PDF generated successfully!");

      // Reset after a short delay
      setTimeout(() => {
        setIsGeneratingPDF(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
      setIsGeneratingPDF(false);
      setProgress(0);
    }
  };

  const slideCount = Math.ceil(photos.length / 8);
  const isGenerating = isGeneratingPPT || isGeneratingPDF;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Download Options
              </h3>
              <p className="text-sm text-muted-foreground">
                {photos.length} {photos.length === 1 ? "photo" : "photos"} will
                be organized into {slideCount}{" "}
                {slideCount === 1 ? "slide" : "slides"} (8 photos per slide)
              </p>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {isGeneratingPPT ? "Generating PowerPoint" : "Generating PDF"}
                ... {progress}%
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleGeneratePPT}
              disabled={isGenerating}
              className="w-full h-12 text-base"
              size="lg"
              variant="default"
            >
              {isGeneratingPPT ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PPT
                </>
              )}
            </Button>

            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="w-full h-12 text-base"
              size="lg"
              variant="secondary"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            PPT: Editable presentation • PDF: Compressed, high-quality images
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
