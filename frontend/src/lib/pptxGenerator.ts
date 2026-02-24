import type { PhotoItem } from '../App';

// Load PptxGenJS from CDN
function loadPptxGenJS(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).PptxGenJS) {
      resolve((window as any).PptxGenJS);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).PptxGenJS) {
        resolve((window as any).PptxGenJS);
      } else {
        reject(new Error('PptxGenJS failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PptxGenJS library'));
    };

    document.head.appendChild(script);
  });
}

// Load template slide images
async function loadTemplateImage(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Convert image to base64 data URL
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    img.onerror = () => {
      reject(new Error(`Failed to load template image: ${imagePath}`));
    };
    img.src = imagePath;
  });
}

export async function generatePowerPoint(photos: PhotoItem[]): Promise<void> {
  try {
    const PptxGenJS = await loadPptxGenJS();
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'Photo to PowerPoint Generator';
    pptx.company = 'caffeine.ai';
    pptx.title = 'Photo Presentation';
    pptx.subject = 'Generated Photo Presentation';

    // Disable slide numbers globally
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [],
      slideNumber: { x: 0, y: 0, w: 0, h: 0, fontSize: 0, color: 'FFFFFF' }, // Hide slide numbers
    });

    // Load template slide images
    let deKriminatorsImageData: string;
    let globalPestImageData: string;
    try {
      deKriminatorsImageData = await loadTemplateImage('/assets/IMG_20260113_141006-1.jpg');
      globalPestImageData = await loadTemplateImage('/assets/IMG_20260113_140013-3.jpg');
    } catch (error) {
      console.error('Failed to load template slide images:', error);
      throw new Error('Failed to load template slide images');
    }

    // Create first slide: DeKriminators Inspection Report
    const deKriminatorsSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    deKriminatorsSlide.background = { color: 'FFFFFF' };

    // Add background image
    deKriminatorsSlide.addImage({
      data: deKriminatorsImageData,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'contain', w: '100%', h: '100%' },
    });

    // Add editable text boxes for DeKriminators slide - every word separately
    // Title: "DEKRIMINATORS"
    deKriminatorsSlide.addText('DEKRIMINATORS', {
      x: 1.2,
      y: 1.8,
      w: 7.6,
      h: 0.7,
      fontSize: 44,
      bold: true,
      color: '4A4A4A',
      align: 'center',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Subtitle: "INSPECTION REPORT"
    deKriminatorsSlide.addText('INSPECTION REPORT', {
      x: 0.3,
      y: 3.2,
      w: 9.4,
      h: 1.0,
      fontSize: 56,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Left column - Facility Name label
    deKriminatorsSlide.addText('Facility Name:', {
      x: 0.4,
      y: 4.75,
      w: 1.5,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Facility Name value
    deKriminatorsSlide.addText('Cummins India Ltd', {
      x: 2.0,
      y: 4.75,
      w: 3.0,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Contact Person label
    deKriminatorsSlide.addText("Contact Person's:", {
      x: 0.4,
      y: 5.15,
      w: 1.8,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Contact Person value
    deKriminatorsSlide.addText('Mr. Vikrant sir', {
      x: 2.3,
      y: 5.15,
      w: 2.7,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Right column - Inspected by label
    deKriminatorsSlide.addText('Inspected by:', {
      x: 5.5,
      y: 4.75,
      w: 1.4,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Inspected by value
    deKriminatorsSlide.addText('Chittaranjan Kadam', {
      x: 7.0,
      y: 4.75,
      w: 2.6,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Date of Inspection label
    deKriminatorsSlide.addText('Date of Inspection:', {
      x: 5.5,
      y: 5.15,
      w: 1.8,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Date of Inspection value
    deKriminatorsSlide.addText('30/10/2025', {
      x: 7.4,
      y: 5.15,
      w: 2.2,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Create second slide: Global Pest Solutions
    const globalPestSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    globalPestSlide.background = { color: 'FFFFFF' };

    // Add background image
    globalPestSlide.addImage({
      data: globalPestImageData,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'contain', w: '100%', h: '100%' },
    });

    // Add editable text boxes for Global Pest Solutions slide - every word separately
    // Company name: "Global Pest Solutions"
    globalPestSlide.addText('Global Pest Solutions', {
      x: 1.9,
      y: 0.5,
      w: 6.2,
      h: 0.8,
      fontSize: 40,
      bold: true,
      color: '4A4A4A',
      align: 'center',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Facility name: "GRAND SHERATON PUNE"
    globalPestSlide.addText('GRAND SHERATON PUNE', {
      x: 2.1,
      y: 1.8,
      w: 5.8,
      h: 0.7,
      fontSize: 40,
      bold: true,
      color: '000000',
      align: 'center',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Activity type: "PEST CONTROL ACTIVITY"
    globalPestSlide.addText('PEST CONTROL ACTIVITY', {
      x: 0.3,
      y: 3.0,
      w: 9.4,
      h: 0.9,
      fontSize: 48,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Bottom section - Facility Name label
    globalPestSlide.addText('Facility Name:', {
      x: 0.7,
      y: 4.8,
      w: 1.5,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Facility Name value (bottom)
    globalPestSlide.addText('GRAND SHERATON PUNE', {
      x: 2.3,
      y: 4.8,
      w: 3.5,
      h: 0.3,
      fontSize: 13,
      bold: false,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
      isTextBox: true,
      fill: { transparency: 100 },
    });

    // Group photos into slides (8 per slide)
    const slidesData: PhotoItem[][] = [];
    for (let i = 0; i < photos.length; i += 8) {
      slidesData.push(photos.slice(i, i + 8));
    }

    // Create slides with consistent 4x2 grid layout
    for (let slideIndex = 0; slideIndex < slidesData.length; slideIndex++) {
      const slidePhotos = slidesData[slideIndex];
      const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

      // Set slide background
      slide.background = { color: 'FFFFFF' };

      // Calculate consistent 4x2 grid layout (2 rows x 4 columns)
      const cols = 4;
      const rows = 2;
      const imageWidth = 2.1;
      const imageHeight = 1.6;
      const startX = 0.6;
      const startY = 1.0;
      const gapX = 0.3;
      const gapY = 0.5;
      const textHeight = 0.35;
      const textGap = 0.08;

      // Add photos to slide in consistent 4x2 grid
      for (let i = 0; i < slidePhotos.length; i++) {
        const photo = slidePhotos[i];
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = startX + col * (imageWidth + gapX);
        const y = startY + row * (imageHeight + textHeight + gapY + textGap);

        // Add image (editable in PowerPoint)
        slide.addImage({
          data: photo.imageData,
          x: x,
          y: y,
          w: imageWidth,
          h: imageHeight,
          sizing: { type: 'cover', w: imageWidth, h: imageHeight },
        });

        // Add location name as editable text box directly below image
        slide.addText(photo.locationName, {
          x: x,
          y: y + imageHeight + textGap,
          w: imageWidth,
          h: textHeight,
          fontSize: 12,
          bold: true,
          color: '363636',
          align: 'center',
          valign: 'middle',
          isTextBox: true, // Ensure it's an editable text box
        });
      }
    }

    // Generate and download the file using device storage APIs
    // Note: PptxGenJS only supports .pptx format (modern XML-based format)
    // The .ppt format (legacy binary format) is not supported by JavaScript libraries
    const fileName = `photos-presentation-${new Date().toISOString().split('T')[0]}.pptx`;
    
    // writeFile uses browser's download API which works offline
    await pptx.writeFile({ fileName });
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    throw new Error('Failed to generate PowerPoint presentation');
  }
}
