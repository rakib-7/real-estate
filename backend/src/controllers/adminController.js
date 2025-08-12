// backend/src/controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// --- User Management ---
// Admin can create other users (including other admins)
exports.createAdminUser = async (req, res) => {
  // const { email, password, role, name, phoneNumber, location } = req.body;
  // if (!['USER', 'ADMIN'].includes(role)) {
  //   return res.status(400).json({ error: 'Email, password, and role are required.' });
  // }
  // if (!['user', 'admin'].includes(role)) {
  //   return res.status(400).json({ error: 'Invalid role specified. Role must be "user" or "admin".' });
  // }
  const { email, password, name, phoneNumber, location } = req.body;
    const role = req.body.role ? req.body.role.toUpperCase() : null;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
    }
    if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified. Must be "USER" or "ADMIN".' });
    }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name: name || null, // Optional fields
        phoneNumber: phoneNumber || null,
        location: location || null,
      },
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true },
    });
    res.status(201).json({ message: `User ${newUser.email} created successfully with role ${newUser.role}.`, user: newUser });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error('Error creating user by admin:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

// Update user (admin can change role, name, etc.)
exports.updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  // const { email, role, name, phoneNumber, location } = req.body;
  //  if (!['USER', 'ADMIN'].includes(role)) { // Email and role are essential for update
  //   return res.status(400).json({ error: 'Email and role are required for update.' });
  // }
  // if (!['user', 'admin'].includes(role)) {
  //   return res.status(400).json({ error: 'Invalid role specified. Role must be "user" or "admin".' });
  // }
  const { email, name, phoneNumber, location } = req.body;
    const role = req.body.role ? req.body.role.toUpperCase() : undefined;

    if (role && !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified. Must be "USER" or "ADMIN".' });
    }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        role,
        name: name || null,
        phoneNumber: phoneNumber || null,
        location: location || null,
        updatedAt: new Date(),
      },
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists for another user.' });
    }
    console.error('Error updating user by admin:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// Delete user
exports.deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Implement cascade delete or manual deletion of related records if necessary
    // Prisma's onDelete('CASCADE') in schema.prisma handles this automatically if set up.
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting user by admin:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// --- Inquiry Management ---
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        property: { select: { id: true, title: true, location: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to retrieve inquiries.' });
  }
};

exports.respondToInquiry = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  if (!response) {
    return res.status(400).json({ error: 'Response message is required.' });
  }
  try {
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: { response },
    });
    res.status(200).json(updatedInquiry);
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry response.' });
  }
};

// --- Banner Management ---
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to retrieve banners.' });
  }
};

exports.getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id) }
    });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found.' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to retrieve banner.' });
  }
};

exports.uploadBanner = async (req, res) => {
  const { title, description, linkUrl, isActive, position } = req.body;
  let imageUrl = req.body.imageUrl;

  // Handle file upload
  if (req.file) {
    // In production, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll use the local file path
    imageUrl = `/uploads/banners/${req.file.filename}`;
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'Banner image is required.' });
  }

  try {
    const banner = await prisma.banner.create({
      data: {
        title: title || 'Untitled Banner',
        description: description || '',
        imageUrl,
        linkUrl: linkUrl || '',
        isActive: isActive === 'true' || isActive === true,
        position: position || 'top'
      }
    });
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Failed to create banner.' });
  }
};



// exports.updateBanner = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, linkUrl, isActive, position } = req.body;
//   let imageUrl = req.body.imageUrl;

//   // Handle file upload
//   if (req.file) {
//     imageUrl = `/uploads/banners/${req.file.filename}`;
//   }

//   try {
//     const updateData = {
//       title: title || 'Untitled Banner',
//       description: description || '',
//       linkUrl: linkUrl || '',
//       isActive: isActive === 'true' || isActive === true,
//       position: position || 'top'
//     };

//     if (imageUrl) {
//       updateData.imageUrl = imageUrl;
//     }

//     const banner = await prisma.banner.update({
//       where: { id: parseInt(id) },
//       data: updateData
//     });
//     res.status(200).json(banner);
//   } catch (error) {
//     console.error('Error updating banner:', error);
//     res.status(500).json({ error: 'Failed to update banner.' });
//   }
// };

// CORRECTED: The new, flexible updateBanner function.
exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    const { title, description, linkUrl, isActive, position } = req.body;

    try {
        // 1. Prepare an object with only the text-based fields from the form.
        const updateData = {
            title,
            description,
            linkUrl,
            isActive: isActive === 'true' || isActive === true,
            position,
        };

        // 2. Check if a new image file was uploaded with the form.
        if (req.file) {
            // 3. If a new file exists, find the old banner to delete its image from the server.
            const existingBanner = await prisma.banner.findUnique({
                where: { id: parseInt(id) },
            });

            // This cleanup step prevents orphaned files from accumulating on your server.
            if (existingBanner && existingBanner.imageUrl) {
                const oldImagePath = path.join(__dirname, '..', '..', existingBanner.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            // 4. Add the new image URL to our update data.
            updateData.imageUrl = `/uploads/banners/${req.file.filename}`;
        }

        // 5. Pass the final updateData object to Prisma.
        // If no new file was uploaded, this object will NOT have an 'imageUrl' property,
        // and Prisma will not change the existing one in the database.
        const updatedBanner = await prisma.banner.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.status(200).json(updatedBanner);
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ error: 'Failed to update banner.' });
    }
};


exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(id) }
    });

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found.' });
    }

    // Delete the image file if it exists locally
    if (banner.imageUrl && banner.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', banner.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.banner.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner.' });
  }
};

// --- Site Analytics ---
exports.getSiteAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProperties = await prisma.property.count();
    const totalInquiries = await prisma.inquiry.count();
    const totalBanners = await prisma.banner.count();
    const featuredProperties = await prisma.property.count({ where: { isFeatured: true } });

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    const recentProperties = await prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, price: true, createdAt: true }
    });

    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
        property: { select: { title: true } }
      }
    });

    res.status(200).json({
      totalUsers,
      totalProperties,
      totalInquiries,
      totalBanners,
      featuredPropertiesCount: featuredProperties,
      recentActivity: {
        users: recentUsers,
        properties: recentProperties,
        inquiries: recentInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching site analytics:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics data.' });
  }
};

// NEW: Admin can get ALL properties (regardless of status)
exports.getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching all properties for admin:', error);
    res.status(500).json({ error: 'Failed to retrieve properties for admin view.' });
  }
};

// NEW: Admin can update property status (approve/reject)
exports.updatePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved', 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected".' });
  }

  try {
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ error: 'Failed to update property status.' });
  }
};

//gemini
// NEW: Get Publicly Visible Banners
// --- Banner Management (ROBUST IMPLEMENTATION) ---
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Prisma Error in getAllBanners:', error);
    res.status(500).json({ error: 'Failed to retrieve banners from database.' });
  }
};

exports.getPublicBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ position: 'asc'}, {createdAt: 'desc' }]
    });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Prisma Error in getPublicBanners:', error);
    res.status(500).json({ error: 'Failed to retrieve public banners.' });
  }
};

exports.createBanner = async (req, res) => {
  const { title, description, imageUrl, linkUrl, isActive, position } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Banner image URL is required.' });
  }
  try {
    const newBanner = await prisma.banner.create({
      data: {
        title: title || 'Untitled Banner',
        description: description || '',
        imageUrl,
        linkUrl: linkUrl || '',
        isActive: isActive === 'true' || isActive === true,
        position: position || 'top'
      }
    });
    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Prisma Error in createBanner:', error);
    res.status(500).json({ error: 'Failed to create banner in database.' });
  }
};

exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, linkUrl, isActive, position } = req.body;
  try {
    const updateData = {
      title: title || 'Untitled Banner',
      description: description || '',
      linkUrl: linkUrl || '',
      isActive: isActive === 'true' || isActive === true,
      position: position || 'top'
    };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }
    const banner = await prisma.banner.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.status(200).json(banner);
  } catch (error) {
    console.error('Prisma Error in updateBanner:', error);
    res.status(500).json({ error: 'Failed to update banner in database.' });
  }
};

exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.banner.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Prisma Error in deleteBanner:', error);
    res.status(500).json({ error: 'Failed to delete banner from database.' });
  }
};

