const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// Define source and destination folders
const sourceFolder = "./source"; // Replace with your source folder path
const destinationFolder = "./zipped"; // Replace with your destination folder path

// Ensure destination folder exists
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

// Group files by name (ignoring extension)
fs.readdir(sourceFolder, (err, files) => {
  if (err) {
    console.error("Error reading source folder:", err);
    return;
  }

  // Create a map to group files by their base name (without extension)
  const fileGroups = files.reduce((groups, file) => {
    const baseName = path.parse(file).name; // Extract base name (e.g., "example" from "example.txt")
    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(file); // Add the file to its group
    return groups;
  }, {});

  // Process each group and create a zip file
  Object.keys(fileGroups).forEach((groupName) => {
    const zip = new AdmZip();
    const zipName = `${groupName}.zip`;

    fileGroups[groupName].forEach((file) => {
      const filePath = path.join(sourceFolder, file);
      zip.addLocalFile(filePath); // Add each file in the group to the zip
    });

    // Write the zip file to the destination folder
    const zipPath = path.join(destinationFolder, zipName);
    zip.writeZip(zipPath);

    console.log(
      `Zipped: ${groupName}.zip -> Includes: ${fileGroups[groupName].join(
        ", "
      )}`
    );
  });
});
