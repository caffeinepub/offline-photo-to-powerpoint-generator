# Offline Photo to PowerPoint Generator

## Overview
A mobile-friendly web application that allows users to capture photos using their device's camera or select from local storage, pair them with location names, and generate downloadable PowerPoint presentations or compressed PDF files entirely offline using browser-side functionality.

## Core Features

### Photo Capture and Upload
- Users can capture photos directly using their device's camera
- Users can alternatively select photos from local storage
- Users can bulk upload multiple photos in a single action
- For each photo (individual or bulk), users must provide a location name via text input
- Photos are displayed in a list showing the capture/upload order
- Users can see a preview of captured/uploaded photos with their location names
- Users can remove individual photos before generating the presentation

### Offline Functionality
- Complete offline operation using browser-side local storage
- Service workers enable functionality in non-network zones
- All photo processing, PowerPoint generation, and PDF generation happens client-side
- No internet connection required after initial app load

### PowerPoint Generation
- "Generate PPT" button compiles the presentation locally
- Generated presentation begins with two predefined template slides that are automatically included as the first and second slides
- The first slide uses the DeKriminators inspection report template with the layout image as background and every word as a separate editable text box including: "DEKRIMINATORS" (title), "INSPECTION REPORT" (subtitle), facility name, contact person, inspector name, and inspection date
- The second slide uses the Global Pest Solutions layout with the layout image as background and every word as a separate editable text box including: "Global Pest Solutions" (company name), "GRAND SHERATON PUNE" (facility name), "PEST CONTROL ACTIVITY" (activity type), and "Facility Name" (field label)
- Both template slides use their respective layout images as background images with transparent editable text layers overlaid on top
- All text elements on both template slides are fully editable and positioned to match the original layout
- After the two template slides, photo slides follow containing exactly 8 photos arranged in a clear 4x2 grid layout
- Location names are displayed directly beneath each respective photo as editable text boxes
- Photos appear in slides following their capture/upload sequence
- Generated file is in .ppt format with fully editable images and text boxes
- Slide numbers are completely removed from the generated presentation
- Users can download the generated PowerPoint file using device storage APIs, even offline
- PowerPoint files remain fully modifiable in PowerPoint applications with editable location text boxes and editable template slide content

### PDF Generation
- "Generate PDF" button creates a compressed PDF version of the presentation
- PDF generation converts all slides (two template slides and photo slides) to high-resolution images
- PDF maintains the same layout as PowerPoint: two template slides followed by photo slides with 8 photos per slide in 4x2 grid
- Location names appear below photos in the PDF as rendered text
- Template slide content is rendered as text in the PDF
- Local compression logic reduces file size while maintaining readable quality
- PDF generation works entirely offline using browser-side functionality
- Users can download the generated PDF file using device storage APIs, even offline

### Download Options Interface
- After photo upload and processing, users are presented with two download options
- "Download PPT" button generates and downloads the editable PowerPoint presentation in .ppt format
- "Download PDF" button generates and downloads the compressed PDF version
- Both options work independently and can be used multiple times
- Clear button interface distinguishing between the two download formats

### Mobile-Friendly Interface
- Optimized for mobile camera capture
- Clear, prominent buttons for "Take Photo," "Bulk Upload," "Add Location," "Download PPT," and "Download PDF"
- Touch-friendly interface elements
- Responsive design for various screen sizes
- Simple, intuitive navigation
- App content language: English

## Frontend Requirements

### Camera Integration
- Access device camera for photo capture
- Handle camera permissions and fallbacks
- Support both front and rear cameras where available

### Bulk Upload Functionality
- Support multiple photo selection in a single action
- Handle bulk photo processing and location name assignment
- Maintain proper sequencing for bulk uploaded photos

### Local Storage Management
- Store captured/uploaded photos in browser local storage
- Store location names associated with each photo
- Maintain capture/upload order for proper sequencing
- Handle storage cleanup and management

### Client-Side PowerPoint Generation
- Generate .ppt files entirely in the browser with fully editable content
- Create first slide using DeKriminators inspection report template with layout image as background and separate editable text boxes for every word: "DEKRIMINATORS", "INSPECTION REPORT", facility name, contact person, inspector name, and inspection date
- Create second slide using Global Pest Solutions layout with layout image as background and separate editable text boxes for every word: "Global Pest Solutions", "GRAND SHERATON PUNE", "PEST CONTROL ACTIVITY", and "Facility Name"
- Position all text boxes to precisely match the original layout positioning while maintaining transparency over background images
- Handle photo resizing and positioning within slides using clear 4x2 grid layout with exactly 8 photos per slide
- Add location text labels directly beneath photos as fully editable text boxes
- Organize photos into slides with exactly 8 photos per slide
- Remove all slide numbers from the generated presentation
- Provide download functionality using device storage APIs for offline operation
- Ensure generated PowerPoint files maintain full editability in PowerPoint applications
- Preserve editable text boxes for location names and template slide content for post-download modification

### Client-Side PDF Generation
- Generate compressed PDF files entirely in the browser
- Convert all slides (including both template slides) to high-resolution images for PDF inclusion
- Maintain layout consistency with PowerPoint version (two template slides followed by 8 photos per slide in 4x2 grid)
- Render location names and template slide content directly into PDF images
- Apply compression algorithms to reduce file size while preserving readability
- Provide download functionality using device storage APIs for offline operation
- Handle large image processing efficiently in browser memory

### Service Worker Implementation
- Enable offline functionality
- Cache necessary resources for offline operation
- Handle offline/online state management

## Technical Considerations
- Support common image formats from camera and local storage
- Handle large photo files efficiently in browser memory
- Generate PowerPoint files client-side using JavaScript libraries in .ppt format with full editability and no slide numbers
- Generate compressed PDF files client-side using JavaScript libraries with image conversion and compression
- Mobile-optimized camera capture interface
- Responsive design for various device sizes
- Browser compatibility for camera API, file generation, and PDF creation
- Device storage API integration for offline download functionality
- Efficient memory management for handling both PowerPoint and PDF generation processes
- Handle template slide generation with DeKriminators and Global Pest Solutions layouts using background images with transparent editable text overlays in both PowerPoint and PDF outputs
- Precise text positioning to match original template layouts while maintaining editability
