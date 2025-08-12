// backend/src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// --- User Profile Management ---
exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true, updatedAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, phoneNumber, location } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        phoneNumber: phoneNumber,
        location: location,
        updatedAt: new Date(),
      },
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true, updatedAt: true },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
};

// --- Inquiry Management ---
exports.submitInquiry = async (req, res) => {
  const { propertyId, message } = req.body;
  const userId = req.user.userId;

  if (!propertyId || !message) {
    return res.status(400).json({ error: 'Property ID and message are required.' });
  }

  try {
    const newInquiry = await prisma.inquiry.create({
      data: {
        userId,
        propertyId: parseInt(propertyId),
        message,
      },
    });
    res.status(201).json(newInquiry);
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
};

exports.getUserInquiries = async (req, res) => {
  const userId = req.user.userId;
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true, images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    res.status(500).json({ error: 'Failed to retrieve your inquiries.' });
  }
};

// --- Bookmark Management ---
exports.bookmarkProperty = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.userId;

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required.' });
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        propertyId: parseInt(propertyId),
      },
    });
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Property already bookmarked.' });
    }
    console.error('Error bookmarking property:', error);
    res.status(500).json({ error: 'Failed to bookmark property.' });
  }
};

exports.removeBookmark = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.userId;
  try {
    await prisma.bookmark.deleteMany({
      where: {
        userId,
        propertyId: parseInt(propertyId),
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
};

exports.getBookmarkedProperties = async (req, res) => {
  const userId = req.user.userId;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        property: { include: { images: true } }
      }
    });
    const bookmarkedProperties = bookmarks.map(b => b.property);
    res.status(200).json(bookmarkedProperties);
  } catch (error) {
    console.error('Error fetching bookmarked properties:', error);
    res.status(500).json({ error: 'Failed to retrieve bookmarked properties.' });
  }
};

// --- User-Added Properties ---
exports.createPropertyByUser = async (req, res) => {
    const { title, description, price, location, type, category, contactInfo, isFeatured } = req.body;
    const userId = req.user.userId; // Get user ID from the authenticated token
    const imageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

    if (!title || !price || !location || !type) {
        return res.status(400).json({ error: 'Title, price, location, and type are required.' });
    }

    try {
        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                location,
                type,
                category,
                contactInfo: contactInfo || req.user.email, // Can still store public contact info
                isFeatured: isFeatured === 'true',
                status: 'pending', // All user-submitted properties must be approved by an admin
                // CORRECTED: Associate the property with the user by their ID
                user: {
                    connect: {
                        id: userId
                    }
                },
                images: {
                    create: imageUrls.map(url => ({ url }))
                }
            },
        });
        res.status(201).json(newProperty);
    } catch (error) {
        console.error('Error creating property by user:', error);
        res.status(500).json({ error: 'Failed to create property.' });
    }
};

/**
 * Gets all properties created by the currently logged-in user.
 */
exports.getPropertiesCreatedByUser = async (req, res) => {
    const userId = req.user.userId;
    try {
        const properties = await prisma.property.findMany({
            // CORRECTED: Query by the 'userId' foreign key
            where: {
                userId: userId
            },
            orderBy: { createdAt: 'desc' },
            include: { images: true }
        });
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties created by user:', error);
        res.status(500).json({ error: 'Failed to retrieve your listed properties.' });
    }
};

/**
 * Updates a property owned by the logged-in user.
 */
// exports.updatePropertyByUser = async (req, res) => {
//     const { id } = req.params;
//     const { title, description, price, location, type, category, contactInfo, isFeatured } = req.body;
//     const userId = req.user.userId;
//     const newImageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

//     try {
//         const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });

//         if (!property) {
//             return res.status(404).json({ error: 'Property not found.' });
//         }
//         // CORRECTED: Check ownership using the reliable userId
//         if (property.userId !== userId) {
//             return res.status(403).json({ error: 'Forbidden: You can only update your own properties.' });
//         }

//         // Image handling logic remains the same...

//         const updatedProperty = await prisma.property.update({
//             where: { id: parseInt(id) },
//             data: {
//                 title,
//                 description,
//                 price: parseFloat(price),
//                 location,
//                 type,
//                 category,
//                 contactInfo,
//                 isFeatured: isFeatured === 'true',
//                 status: 'pending', // Re-submit for approval after an update
//                 // Image update logic remains the same...
//             },
//         });
//         res.status(200).json(updatedProperty);
//     } catch (error) {
//         console.error('Error updating property by user:', error);
//         res.status(500).json({ error: 'Failed to update property.' });
//     }
// };

// /**
//  * Deletes a property owned by the logged-in user.
//  */
// exports.deletePropertyByUser = async (req, res) => {
//     const { id } = req.params;
//     const userId = req.user.userId;

//     try {
//         const property = await prisma.property.findUnique({ where: { id: parseInt(id) }, include: { images: true } });
//         if (!property) {
//             return res.status(404).json({ error: 'Property not found.' });
//         }
//         // CORRECTED: Check ownership using userId
//         if (property.userId !== userId) {
//             return res.status(403).json({ error: 'Forbidden: You can only delete your own properties.' });
//         }

//         // File deletion logic remains the same...
//         if (property.images && property.images.length > 0) {
//            // ... logic to delete files from server ...
//         }

//         // Deletion is now cascaded by the schema, so we only need to delete the property.
//         await prisma.property.delete({ where: { id: parseInt(id) } });

//         res.status(204).send();
//     } catch (error) {
//         console.error('Error deleting property by user:', error);
//         res.status(500).json({ error: 'Failed to delete property.' });
//     }
// };
exports.updatePropertyByUser = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, type, category, contactInfo, isFeatured } = req.body;
    const userId = req.user.userId;
    const newImageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

    try {
        // Find the property to ensure it exists and the user owns it.
        const propertyToUpdate = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true } // Include old images for deletion.
        });

        if (!propertyToUpdate) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        if (propertyToUpdate.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only update your own properties.' });
        }

        // ADDED: Logic to delete old images if new ones are uploaded.
        if (newImageUrls.length > 0 && propertyToUpdate.images) {
            // 1. Delete old image files from the server's filesystem.
            propertyToUpdate.images.forEach(image => {
                const oldImagePath = path.join(__dirname, '..', '..', image.url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            });
            // 2. Delete old image records from the database.
            await prisma.image.deleteMany({ where: { propertyId: parseInt(id) } });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                price: parseFloat(price),
                location,
                type,
                category,
                contactInfo,
                isFeatured: isFeatured === 'true',
                status: 'pending',
                // CORRECTED: Conditionally update images.
                // If new images exist, create new records. Otherwise, do nothing.
                images: newImageUrls.length > 0 ? {
                    create: newImageUrls.map(url => ({ url }))
                } : undefined
            },
        });
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property by user:', error);
        res.status(500).json({ error: 'Failed to update property.' });
    }
};

/**
 * Deletes a property owned by the logged-in user.
 */
exports.deletePropertyByUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // Find the property to ensure it exists and the user owns it.
        const propertyToDelete = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true } // Include images to delete them from the disk.
        });

        if (!propertyToDelete) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        if (propertyToDelete.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only delete your own properties.' });
        }

        // ADDED: Logic to delete image files from the server's filesystem.
        // Prisma's 'onDelete: Cascade' handles the database records, but not the physical files.
        if (propertyToDelete.images && propertyToDelete.images.length > 0) {
            propertyToDelete.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', '..', image.url);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Now, delete the property record from the database.
        await prisma.property.delete({ where: { id: parseInt(id) } });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting property by user:', error);
        res.status(500).json({ error: 'Failed to delete property.' });
    }
};