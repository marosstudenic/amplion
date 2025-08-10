#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to get all subdirectories in a directory
function getSubdirectories(dirPath) {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((item) => item.name);
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

// Function to get all image files in a directory
function getImageFiles(dirPath) {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".tiff",
      ".webp",
    ];

    return items
      .filter((item) => !item.isDirectory())
      .filter((item) => {
        const ext = path.extname(item.name).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((item) => item.name);
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

// Function to process a single image
async function processImage(inputPath, outputDir, filename) {
  try {
    const nameWithoutExt = path.parse(filename).name;

    // Create output directories if they don't exist
    const largeDir = path.join(outputDir, "1600x1600");
    const smallDir = path.join(outputDir, "600x600");

    fs.mkdirSync(largeDir, { recursive: true });
    fs.mkdirSync(smallDir, { recursive: true });

    // Process image to 1600x1600
    await sharp(inputPath)
      .resize(1600, 1600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 100 })
      .toFile(path.join(largeDir, `${nameWithoutExt}.webp`));

    // Process image to 600x600
    await sharp(inputPath)
      .resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 100 })
      .toFile(path.join(smallDir, `${nameWithoutExt}.webp`));

    console.log(`✓ Processed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log("🖼️  Image Processing Script");
  console.log("============================\n");

  const podkladyPath = path.join(process.cwd(), "podklady");

  // Check if podklady folder exists
  if (!fs.existsSync(podkladyPath)) {
    console.error("❌ Error: podklady folder not found!");
    console.log(
      "Please make sure the podklady folder exists in the project root."
    );
    rl.close();
    return;
  }

  // Get subdirectories
  const subdirs = getSubdirectories(podkladyPath);

  if (subdirs.length === 0) {
    console.log("No subdirectories found in podklady folder.");
    rl.close();
    return;
  }

  // Display available subdirectories
  console.log("Available subdirectories:");
  subdirs.forEach((dir, index) => {
    console.log(`${index + 1}. ${dir}`);
  });

  // Ask user to select subdirectory
  const selection = await askQuestion(
    "\nEnter the number or name of the subdirectory to process: "
  );

  let selectedSubdir;
  let selectedIndex = parseInt(selection) - 1;

  // Check if user entered a number
  if (
    !isNaN(selectedIndex) &&
    selectedIndex >= 0 &&
    selectedIndex < subdirs.length
  ) {
    selectedSubdir = subdirs[selectedIndex];
  } else {
    // Check if user entered a folder name
    const folderName = selection.trim();
    if (subdirs.includes(folderName)) {
      selectedSubdir = folderName;
    } else {
      console.error(
        "❌ Invalid selection! Please enter a valid number or folder name."
      );
      rl.close();
      return;
    }
  }

  const selectedPath = path.join(podkladyPath, selectedSubdir);

  console.log(`\nSelected: ${selectedSubdir}`);

  // Get image files in selected subdirectory
  const imageFiles = getImageFiles(selectedPath);

  if (imageFiles.length === 0) {
    console.log("No image files found in the selected subdirectory.");
    rl.close();
    return;
  }

  // Get total file count in the selected subdirectory
  const allFiles = fs.readdirSync(selectedPath, { withFileTypes: true });
  const totalFileCount = allFiles.filter((item) => !item.isDirectory()).length;

  console.log(`\n📊 Folder Statistics:`);
  console.log(`Total files in folder: ${totalFileCount}`);
  console.log(`Image files found: ${imageFiles.length}`);
  console.log(`Non-image files: ${totalFileCount - imageFiles.length}`);

  console.log(`\n📁 Image files to process:`);
  imageFiles.forEach((file) => console.log(`  - ${file}`));

  // Ask for confirmation
  const confirm = await askQuestion("\nProceed with processing? (y/N): ");

  if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
    console.log("Operation cancelled.");
    rl.close();
    return;
  }

  // Create output directory
  const outputDir = path.join(
    process.cwd(),
    "processed-images",
    selectedSubdir
  );
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n🔄 Processing images...`);
  console.log(`Output directory: ${outputDir}\n`);

  // Process all images
  let successCount = 0;
  let totalCount = imageFiles.length;

  for (const imageFile of imageFiles) {
    const inputPath = path.join(selectedPath, imageFile);
    const success = await processImage(inputPath, outputDir, imageFile);
    if (success) successCount++;
  }

  console.log(`\n✅ Processing complete!`);
  console.log(`\n📊 Final Statistics:`);
  console.log(`Total files in folder: ${totalFileCount}`);
  console.log(`Image files processed: ${successCount}/${totalCount}`);
  console.log(`Failed to process: ${totalCount - successCount}`);
  console.log(`Output location: ${outputDir}`);

  rl.close();
}

// Handle errors and cleanup
process.on("SIGINT", () => {
  console.log("\n\nOperation cancelled by user.");
  rl.close();
  process.exit(0);
});

// Run the script
main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  rl.close();
  process.exit(1);
});
