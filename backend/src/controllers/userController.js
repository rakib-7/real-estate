// backend/src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const prisma = new PrismaClient();
//const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --- User Profile Management ---
exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true, updatedAt: true },
    // });
   const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true, phoneNumber: true,
              location: true, avatarUrl: true, subscription:true, listingResetDate: true, createdAt: true, updatedAt: true },
   });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const now = new Date();
        let cycleStartDate;

        // If the user's reset date is in the past or doesn't exist, the cycle starts from their creation date.
        if (!user.listingResetDate || new Date(user.listingResetDate) < now) {
            cycleStartDate = user.createdAt;
        } else {
            // Otherwise, the cycle started one month before the next reset date.
            cycleStartDate = new Date(user.listingResetDate);
            cycleStartDate.setMonth(cycleStartDate.getMonth() - 1);
        }

        const propertiesPostedThisMonth = await prisma.property.count({
            where: {
                userId: userId,
                createdAt: { gte: cycleStartDate }, // "gte" means "greater than or equal to"
            }
        });

    res.status(200).json({
        ...user,
    propertiesPostedThisMonth ,
  });
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
      select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true,avatarUrl: true, createdAt: true, updatedAt: true },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
};

exports.uploadAvatar = async (req, res) => {
    const userId = req.user.userId;

    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }

    // try {
    //     // 1. Find the user to get the path of their old avatar, if it exists.
    //     const user = await prisma.user.findUnique({ where: { id: userId } });
        
    //     // 2. If an old avatar exists, delete it from the server to save space.
    //     if (user && user.avatarUrl) {
    //         const oldAvatarPath = path.join(__dirname, '..', '..', user.avatarUrl);
    //         if (fs.existsSync(oldAvatarPath)) {
    //             fs.unlinkSync(oldAvatarPath);
    //         }
    //     }

    //     // 3. Construct the new avatar's URL.
    //     const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    //     // 4. Update the user's record in the database with the new URL.
    //     const updatedUser = await prisma.user.update({
    //         where: { id: userId },
    //         data: { avatarUrl: avatarUrl },
    //         select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, avatarUrl: true }
    //     });

    //     res.status(200).json({ message: 'Avatar updated successfully', user: updatedUser });
    // } catch (error) {
    //     console.error('Error uploading avatar:', error);
    //     res.status(500).json({ error: 'Failed to upload avatar.' });
    // }

    //supabase
     try {
        const file = req.file;
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
       const fileName = `avatars/avatar-${userId}-${Date.now()}`;

        // 1. Upload the file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('real_estate_storage')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) throw uploadError;

        // 2. Get the permanent public URL for the file
        const { data: urlData } = supabase.storage
            .from('real_estate_storage')
            .getPublicUrl(uploadData.path);

        const avatarUrl = urlData.publicUrl;

        // 3. Save the permanent Supabase URL to your Neon database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
            select: { id: true, email: true, role: true, name: true, avatarUrl: true }
        });
        res.status(200).json({ message: 'Avatar updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Failed to upload avatar.' });
    }
};


exports.getOrCreateUserChat = async (req, res) => {
    const userId = req.user.userId;
    try {
        let chat = await prisma.chat.findUnique({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: { select: { id: true, name: true, role: true, avatarUrl: true } }
                    }
                }
            }
        });

        // If the user has never chatted before, create a new chat thread for them.
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    userId: userId
                },
                include: { messages: true } // Include empty messages array
            });
        }
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error getting or creating user chat:', error);
        res.status(500).json({ error: 'Failed to retrieve chat.' });
    }
};

/**
 * A user (or admin) posts a new message to a chat.
 */
exports.postMessage = async (req, res) => {
    const senderId = req.user.userId; // The person sending the message
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ error: 'Content and chatId are required.' });
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                chatId: parseInt(chatId),
                senderId: senderId
            },
            include: {
                sender: { select: { id: true, name: true, role: true, avatarUrl: true } }
            }
        });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error posting message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
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
    const userId = req.user.userId; // Get user ID from the authenticated token

     try {
        // The Monthly Limit Check Logic 
        let user = await prisma.user.findUnique({ where: { id: userId } });

        // Define limits based on subscription type
        const limits = {
            FREE: 3,
            PRO: 50
        };
        const userLimit = limits[user.subscription];
        
        let cycleStartDate = user.listingResetDate;
        const now = new Date();

        // If user has no reset date or it's in the past, start a new cycle.
        if (!cycleStartDate || cycleStartDate < now) {
            const lastReset = user.listingResetDate || user.createdAt; // For the very first cycle, start from registration date.
            
            // Set the next reset date to be one month from now.
            const nextResetDate = new Date();
            nextResetDate.setMonth(nextResetDate.getMonth() + 1);
            
            // Update the user's reset date in the database.
            user = await prisma.user.update({
                where: { id: userId },
                data: { listingResetDate: nextResetDate }
            });
            cycleStartDate = lastReset;
        }else {
            cycleStartDate = new Date(user.listingResetDate);
            cycleStartDate.setMonth(cycleStartDate.getMonth() - 1);
        }

        // Count properties created within the current monthly cycle.
        const propertyCountThisMonth = await prisma.property.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: cycleStartDate, // Greater than or equal to the start of the cycle
                }
            }
        });

        // Compare the count to the limit.
        if (propertyCountThisMonth >= userLimit) {
            return res.status(403).json({ error: 'You have reached your monthly property listing limit. Please upgrade your plan to add more.' });
        }

    
   
    //const userId = req.user.userId; // Get user ID from the authenticated token
   // const imageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

   //const imageUrls = req.files ? req.files.map(file => file.path) : []; // Cloudinary version
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const fileName = `properties/property-${userId}-${Date.now()}-${sanitizedOriginalName}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('real_estate_storage')
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                    });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('real_estate_storage')
                    .getPublicUrl(uploadData.path);
                
                imageUrls.push(urlData.publicUrl);
            }
        }

         const { title, description, price, address, area, city, district, division, type, category, contactInfo, isFeatured } = req.body;
        if (!title || !price || !type || !area || !city || !district || !division) {
             return res.status(400).json({ error: 'Title, price, type, area, city, district, and division are required.' });
       }

   
        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                // location,
                address,
                area,
                city,
                district,
                division,
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
                // images: {
                //     create: imageUrls.map(url => ({ url }))
                // }
                images: {
                    create: imageUrls.map(url => ({ url }))
                } // Cloudinary 
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


exports.updatePropertyByUser = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, address, area, city, district, division, type, category, contactInfo, isFeatured } = req.body;
    const userId = req.user.userId;
   // const newImageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

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

        const newImageUrls = [];
        if (req.files && req.files.length > 0) {
            // 1. Delete old images from Supabase Storage
            if (propertyToUpdate.images && propertyToUpdate.images.length > 0) {
                const oldImagePaths = propertyToUpdate.images.map(image => {
                    // Extract the path from the full URL (e.g., 'properties/image-name.jpg')
                    return image.url.substring(image.url.indexOf('/properties/')); 
                });

                await supabase.storage
                    .from('real_estate_storage')
                    .remove(oldImagePaths);
            }

            // 2. Upload new images to Supabase
            for (const file of req.files) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const fileName = `properties/property-${userId}-${Date.now()}-${sanitizedOriginalName}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('real_estate_storage')
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                    });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('real_estate_storage')
                    .getPublicUrl(uploadData.path);
                
                newImageUrls.push(urlData.publicUrl);
            }
        }

        const updatedProperty = await prisma.property.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                price: parseFloat(price),
                // location,
                address,
                area,
                city,
                district,
                division,
                type,
                category,
                contactInfo,
                isFeatured: isFeatured === 'true',
                status: 'pending',
                // CORRECTED: Conditionally update images.
                // If new images exist, create new records. Otherwise, do nothing.
                ...(newImageUrls.length > 0 && {
                    images: {
                        deleteMany: {}, // Delete old image records
                        create: newImageUrls.map(url => ({ url })) // Create new ones
                    }
                })
            },
        });
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property by user:', error);
        res.status(500).json({ error: 'Failed to update property.' });
    }
};



exports.deletePropertyByUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const propertyToDelete = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true }
        });

        if (!propertyToDelete) {
            return res.status(404).json({ error: 'Property not found.' });
        }

        if (propertyToDelete.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only delete your own properties.' });
        }

        // 1. Delete images from Supabase Storage
        if (propertyToDelete.images && propertyToDelete.images.length > 0) {
            const imagePaths = propertyToDelete.images.map(image => {
                 // Extract the path from the full URL
                return image.url.substring(image.url.indexOf('/properties/'));
            });
            
            await supabase.storage
                .from('real_estate_storage')
                .remove(imagePaths);
        }

        // 2. Delete the property record from the database (Prisma will cascade delete image records)
        await prisma.property.delete({ where: { id: parseInt(id) } });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting property by user:', error);
        res.status(500).json({ error: 'Failed to delete property.' });
    }
};