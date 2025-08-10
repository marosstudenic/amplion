# Image Processing Script

This script processes images from the `podklady` folder, converting them to WebP format and resizing them to two different sizes.

## Features

- Interactive subfolder selection
- Converts images to WebP format (100% quality)
- Resizes images to two sizes:
  - 1600x1600 pixels (large)
  - 600x600 pixels (small)
- Maintains aspect ratio (fits inside dimensions)
- Creates organized output structure
- Supports multiple image formats (JPG, PNG, GIF, BMP, TIFF, WebP)
- Shows detailed folder statistics (total files, image files, non-image files)
- Displays processing progress and final results summary

## Prerequisites

1. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

2. Make sure you have a `podklady` folder in your project root with subfolders containing images.

## Usage

### Option 1: Using npm/yarn script

```bash
yarn process-images
# or
npm run process-images
```

### Option 2: Direct execution

```bash
node scripts/process-images.js
```

## How it works

1. **Folder Selection**: The script scans the `podklady` folder and lists all available subdirectories
2. **User Input**: You select which subfolder to process by entering a number
3. **Image Discovery**: The script finds all image files in the selected subfolder
4. **Statistics Display**: Shows total files, image files, and non-image files in the selected folder
5. **Confirmation**: You confirm the processing operation
6. **Processing**: Images are converted to WebP and resized to both dimensions
7. **Output**: Processed images are saved to `processed-images/[subfolder-name]/` with organized subfolders
8. **Final Summary**: Displays comprehensive statistics including success/failure counts

## Output Structure

```
processed-images/
└── [subfolder-name]/
    ├── 1600x1600/
    │   ├── image1.webp
    │   ├── image2.webp
    │   └── ...
    └── 600x600/
        ├── image1.webp
        ├── image2.webp
        └── ...
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tiff)
- WebP (.webp)

## Notes

- The script maintains aspect ratio by fitting images inside the specified dimensions
- Images are not enlarged if they're smaller than the target size
- WebP quality is set to 80% for good balance between quality and file size
- Original images are not modified or deleted
- The script creates output directories automatically

## Troubleshooting

- **"podklady folder not found"**: Make sure the `podklady` folder exists in your project root
- **"No subdirectories found"**: Ensure your `podklady` folder contains subfolders
- **"No image files found"**: Check that the selected subfolder contains supported image files
- **Sharp library errors**: Run `yarn install` to ensure the sharp dependency is installed
