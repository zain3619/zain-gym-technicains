const fs = require('fs');
const https = require('https');

const videoUrl = 'https://videos.pexels.com/video-files/3125674/3125674-hd_1920_1080_25fps.mp4';
const outputPath = 'public/gym-hero-bg.mp4';

console.log('Downloading cinematic gym background video from Pexels...');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.pexels.com/',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  }
};

function download(url) {
  https.get(url, options, (res) => {
    // Handle redirects
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log(`Redirecting to: ${res.headers.location}`);
      download(res.headers.location);
      return;
    }

    if (res.statusCode !== 200) {
      console.error(`Failed to download. Status Code: ${res.statusCode}`);
      return;
    }

    const fileStream = fs.createWriteStream(outputPath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Premium cinematic gym video downloaded successfully to public/gym-hero-bg.mp4!');
    });
  }).on('error', (err) => {
    console.error('Download error:', err.message);
  });
}

download(videoUrl);
