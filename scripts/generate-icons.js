const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 64, 192, 512];

async function generateIcons() {
  const svgBuffer = await fs.readFile('public/money-icon.svg');
  
  await Promise.all(sizes.map(async (size) => {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/money-icon-${size}.png`);
    console.log(`Generated ${size}x${size} icon`);
  }));
}

generateIcons().catch(console.error);
module.exports = generateIcons;
