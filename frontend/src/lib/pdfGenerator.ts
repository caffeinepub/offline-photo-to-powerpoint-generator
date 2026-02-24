import type { PhotoItem } from '../App';

// Load jsPDF from CDN
function loadJsPDF(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).jspdf) {
      resolve((window as any).jspdf.jsPDF);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).jspdf && (window as any).jspdf.jsPDF) {
        resolve((window as any).jspdf.jsPDF);
      } else {
        reject(new Error('jsPDF failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load jsPDF library'));
    };

    document.head.appendChild(script);
  });
}

// Helper function to render DeKriminators template slide to canvas
async function renderDeKriminatorsSlideToCanvas(
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Load and draw background image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calculate aspect ratio fit
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        // Image is wider
        drawHeight = width / imgAspect;
        drawY = (height - drawHeight) / 2;
      } else {
        // Image is taller
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Add text overlays for DeKriminators slide
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Facility Name
      ctx.fillText('Cummins India Ltd', width * 0.15, height * 0.82);

      // Contact Person
      ctx.fillText('Mr. Vikrant sir', width * 0.15, height * 0.88);

      // Inspected by
      ctx.fillText('Chittaranjan Kadam', width * 0.6, height * 0.82);

      // Date of Inspection
      ctx.fillText('30/10/2025', width * 0.6, height * 0.88);

      // Convert canvas to compressed image
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      resolve(imageData);
    };
    img.onerror = () => {
      reject(new Error('Failed to load DeKriminators template image'));
    };
    img.src = '/assets/IMG_20260113_141006.jpg';
  });
}

// Helper function to render Global Pest Solutions template slide to canvas
async function renderGlobalPestSlideToCanvas(
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Load and draw background image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Calculate aspect ratio fit
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        // Image is wider
        drawHeight = width / imgAspect;
        drawY = (height - drawHeight) / 2;
      } else {
        // Image is taller
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Add text overlays for Global Pest Solutions slide
      // Main title (GRAND SHERATON PUNE)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GRAND SHERATON PUNE', width / 2, height * 0.35);

      // Activity type (PEST CONTROL ACTIVITY)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px Arial, sans-serif';
      ctx.fillText('PEST CONTROL ACTIVITY', width / 2, height * 0.52);

      // Facility Name detail
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Facility Name: GRAND SHERATON PUNE', width * 0.08, height * 0.75);

      // Convert canvas to compressed image
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      resolve(imageData);
    };
    img.onerror = () => {
      reject(new Error('Failed to load Global Pest Solutions template image'));
    };
    img.src = '/assets/IMG_20260113_140013-2.jpg';
  });
}

// Helper function to render slide to canvas
async function renderSlideToCanvas(
  photos: PhotoItem[],
  width: number,
  height: number
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Render photo slide with 4x2 grid
      const cols = 4;
      const rows = 2;
      const padding = 40;
      const gap = 20;
      const textHeight = 40;
      const textGap = 10;

      const availableWidth = width - (padding * 2) - (gap * (cols - 1));
      const availableHeight = height - (padding * 2) - (gap * (rows - 1)) - (textHeight + textGap) * rows;

      const imageWidth = availableWidth / cols;
      const imageHeight = availableHeight / rows;

      for (let i = 0; i < photos.length && i < 8; i++) {
        const photo = photos[i];
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = padding + col * (imageWidth + gap);
        const y = padding + row * (imageHeight + textHeight + textGap + gap);

        // Load and draw image
        await new Promise<void>((resolveImg) => {
          const img = new Image();
          img.onload = () => {
            // Calculate aspect ratio fit
            const imgAspect = img.width / img.height;
            const boxAspect = imageWidth / imageHeight;

            let drawWidth = imageWidth;
            let drawHeight = imageHeight;
            let drawX = x;
            let drawY = y;

            if (imgAspect > boxAspect) {
              // Image is wider
              drawHeight = imageWidth / imgAspect;
              drawY = y + (imageHeight - drawHeight) / 2;
            } else {
              // Image is taller
              drawWidth = imageHeight * imgAspect;
              drawX = x + (imageWidth - drawWidth) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

            // Draw location name
            ctx.fillStyle = '#363636';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            // Truncate text if too long
            let locationText = photo.locationName;
            const maxWidth = imageWidth - 10;
            const metrics = ctx.measureText(locationText);
            
            if (metrics.width > maxWidth) {
              while (ctx.measureText(locationText + '...').width > maxWidth && locationText.length > 0) {
                locationText = locationText.slice(0, -1);
              }
              locationText += '...';
            }

            ctx.fillText(locationText, x + imageWidth / 2, y + imageHeight + textGap);

            resolveImg();
          };
          img.onerror = () => {
            console.error('Failed to load image for PDF');
            resolveImg();
          };
          img.src = photo.imageData;
        });
      }

      // Convert canvas to compressed image
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      resolve(imageData);
    } catch (error) {
      reject(error);
    }
  });
}

export async function generatePDF(photos: PhotoItem[]): Promise<void> {
  try {
    const jsPDF = await loadJsPDF();

    // Create PDF in landscape orientation for better photo display
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4',
      compress: true,
    });

    // A4 landscape dimensions in pixels at 96 DPI
    const pageWidth = 1122;
    const pageHeight = 794;

    // Add first template slide: DeKriminators Inspection Report
    const deKriminatorsSlideImage = await renderDeKriminatorsSlideToCanvas(pageWidth, pageHeight);
    pdf.addImage(deKriminatorsSlideImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    // Add second template slide: Global Pest Solutions
    pdf.addPage();
    const globalPestSlideImage = await renderGlobalPestSlideToCanvas(pageWidth, pageHeight);
    pdf.addImage(globalPestSlideImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    // Group photos into slides (8 per slide)
    const slidesData: PhotoItem[][] = [];
    for (let i = 0; i < photos.length; i += 8) {
      slidesData.push(photos.slice(i, i + 8));
    }

    // Generate photo slides
    for (let slideIndex = 0; slideIndex < slidesData.length; slideIndex++) {
      const slidePhotos = slidesData[slideIndex];

      // Add new page
      pdf.addPage();

      // Render slide to canvas
      const slideImage = await renderSlideToCanvas(
        slidePhotos,
        pageWidth,
        pageHeight
      );

      // Add slide image to PDF
      pdf.addImage(slideImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    // Generate and download the file
    const fileName = `photos-presentation-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF presentation');
  }
}
