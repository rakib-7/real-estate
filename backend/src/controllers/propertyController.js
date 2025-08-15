// backend/src/controllers/propertyController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Helper to calculate distance (simplified - for actual geo-search use PostGIS or dedicated services)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// --- Public Property Methods ---
exports.getAllProperties = async (req, res) => {
  //const { division, district, city, area, minPrice, maxPrice, type, category, suggestedByBookmarks } = req.query;
  const { location, minPrice, maxPrice, type, category, isFeatured,suggestedByBookmarks } = req.query;
  const userId = req.user ? req.user.userId : null;
  const user = req.user;
  const where = {
    status: 'approved'
  };

  // if (location) {
  //   where.location = { contains: location, mode: 'insensitive' };
  // }
  // if (division) where.division = { equals: division, mode: 'insensitive' };
  // if (district) where.district = { equals: district, mode: 'insensitive' };
  // if (city) where.city = { equals: city, mode: 'insensitive' };
  // //if (area) where.area = { contains: area, mode: 'insensitive' }; // 'contains' is good for area search
  // if (area) {
  //       where.OR = [
  //           { area: { contains: area, mode: 'insensitive' } },
  //           { city: { contains: area, mode: 'insensitive' } },
  //           { district: { contains: area, mode: 'insensitive' } },
  //           { division: { contains: area, mode: 'insensitive' } }
  //       ];
  //   }
  if (location) {
        // This tells Prisma to search for the 'location' text in any of the
        // structured address fields, making the search powerful and flexible.
        where.OR = [
            { address: { contains: location, mode: 'insensitive' } },
            { area: { contains: location, mode: 'insensitive' } },
            { city: { contains: location, mode: 'insensitive' } },
            { district: { contains: location, mode: 'insensitive' } },
            { division: { contains: location, mode: 'insensitive' } },
        ];
    }
  if (minPrice) {
    where.price = { gte: parseFloat(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...where.price, lte: parseFloat(maxPrice) };
  }
  if (type) {
    where.type = type;
  }
  if (category) {
    where.category = category;
  }

  try {
    let properties = await prisma.property.findMany({ where, include: { images: true } });

    // if (nearLocation) {
    //     properties = properties.filter(p => p.location.toLowerCase().includes(nearLocation.toLowerCase()));
    // }

    if (suggestedByBookmarks === 'true' && userId) {
        const bookmarkedProperties = await prisma.bookmark.findMany({
            where: { userId },
            include: { property: true }
        });

        const bookmarkedTypes = [...new Set(bookmarkedProperties.map(b => b.property.type))];
        const bookmarkedCategories = [...new Set(bookmarkedProperties.map(b => b.property.category))];

        const suggested = await prisma.property.findMany({
            where: {
                OR: [
                    { type: { in: bookmarkedTypes } },
                    { category: { in: bookmarkedCategories } }
                ],
                NOT: {
                    bookmarks: {
                        some: { userId: userId }
                    }
                },
                status: 'approved'
            },
            take: 10,
            include: { images: true }
        });
        const uniqueProperties = new Map();
        [...properties, ...suggested].forEach(p => uniqueProperties.set(p.id, p));
        properties = Array.from(uniqueProperties.values());
    }
    if (!user || user.role !== 'ADMIN') {
            properties.forEach(p => {delete p.contactInfo});
        }

    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to retrieve properties.' });
  }
};

exports.getPropertyById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id)},
      include: { images: true } // CORRECTED: Use include to fetch related images
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const isOwner = user && user.userId === property.userId;
    const isAdmin = user && user.role === 'ADMIN';

    if (property.status !== 'approved' && (!req.user || req.user.role !== 'ADMIN')) {
        return res.status(404).json({ error: 'Property not found or not yet approved.' });
    }
// ADDED: Hide contactInfo from non-admins, as per business plan.
    if (!isAdmin) {
        delete property.contactInfo;
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve property details.' });
  }
};

// --- Admin Property Methods (Corrected to handle nested Image model) ---
exports.createProperty = async (req, res) => {
  // Get text fields from req.body
  const {userId} = req.user; // Get userId from authenticated user
  
  //const { title, description, price, location, type, category, contactInfo, isFeatured,status } = req.body;
  const { title, description, price, address, area, city, district, division, type, category, contactInfo, isFeatured, status } = req.body;
  // Get image URLs from req.files
  const imageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

  // if (!title || !price || !location || !type) {
  //   return res.status(400).json({ error: 'Title, price, location, and type are required.' });
  // }
  if (!title || !price || !type || !area || !city || !district || !division) {
        return res.status(400).json({ error: 'Title, price, type, and full location details are required.' });
    }
  
  try {
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
        contactInfo, 
        isFeatured: isFeatured === 'true' || isFeatured === true,
        status: status || 'approved', // Admin-added properties can be approved by default
        // CORRECTED: Use a nested 'create' to add image records
        images: {
          create: imageUrls.map(url => ({ url }))
        },
        user: {
          connect: { id: userId } // Associate property with the user who created it  
        }
      
      },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property.' });
  }
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  //const { title, description, price, location, type, category, contactInfo, isFeatured, status } = req.body;
  const { title, description, price, address, area, city, district, division, type, category, contactInfo, isFeatured, status } = req.body;
    
  // Get image URLs from req.files if new files are uploaded
  const newImageUrls = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

  try {
    const oldProperty = await prisma.property.findUnique({ where: { id: parseInt(id) }, include: { images: true } });

    if (newImageUrls.length > 0 && oldProperty.images) {
      oldProperty.images.forEach(image => {
        const filePath = path.join(__dirname, '..', '..', image.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      await prisma.image.deleteMany({ where: { propertyId: parseInt(id) } });
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
        status,
        // CORRECTED: If new images exist, use nested create to add them
        images: newImageUrls.length > 0 ? {
          create: newImageUrls.map(url => ({ url }))
        } : undefined // If no new images, don't touch the images relation
      },
    });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property.' });
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id: parseInt(id) }, include: { images: true } });
    if (property && property.images) {
      property.images.forEach(image => {
        const filePath = path.join(__dirname, '..', '..', image.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      await prisma.image.deleteMany({ where: { propertyId: parseInt(id) } });
    }
    await prisma.property.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property.' });
  }
};