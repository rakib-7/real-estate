/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows Next.js Image component to load images from these domains.
  // Crucial for placeholder images or any external image hosting.
  images: {
    domains: [
      'via.placeholder.com', // Used for dummy images in the provided code
      // Add any other domains where your property images might be hosted (e.g., 'res.cloudinary.com', 'your-image-cdn.com')
    ],
  },
  // Other Next.js configurations can go here if needed.
  // For example, if you were using a custom output directory:
  // distDir: 'build',
};

module.exports = nextConfig;