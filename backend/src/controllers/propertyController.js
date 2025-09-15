const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {createClient} = require('@supabase/supabase-js');


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
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
    // where.category = category;
    where.category = { equals: category, mode: 'insensitive' };
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
      include: { images: true, user: {select: {name:true, email: true} } } // CORRECTED: Use include to fetch related images
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const isOwner = user && user.userId === property.userId;
    const isAdmin = user && user.role === 'ADMIN';

    if (property.status !== 'approved' && (!req.user || req.user.role !== 'ADMIN')) {
        return res.status(404).json({ error: 'Property not found or not yet approved.' });
    }
// Hide contactInfo from non-admins, as per business plan.
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
  
  const {userId} = req.user; // Get userId from authenticated user
  
  //const { title, description, price, location, type, category, contactInfo, isFeatured,status } = req.body;
  const { title, description, price, address, area, city, district, division, type, category, contactInfo, isFeatured, status } = req.body;
  
  if (!title || !price || !type || !area || !city || !district || !division) {
        return res.status(400).json({ error: 'Title, price, type, and full location details are required.' });
    }
  
  try {
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const fileName = `properties/property-${userId}-${Date.now()}-${sanitizedOriginalName}`;
                
                // 1. Upload to Supabase
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('real_estate_storage') // Your bucket name
                    .upload(fileName, file.buffer, { contentType: file.mimetype });

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: urlData } = supabase.storage
                    .from('real_estate_storage')
                    .getPublicUrl(uploadData.path);
                
                imageUrls.push(urlData.publicUrl);
            }
        }

         const newProperty = await prisma.property.create({
            data: {
                title, description, price: parseFloat(price), address, area, city, district, division, type, category, contactInfo,
                isFeatured: isFeatured === 'true',
                status: status || 'approved',
                images: {
                    create: imageUrls.map(url => ({ url }))
                },
                user: {
                    connect: { id: userId }
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
    
  
  try {
        // If new files are being uploaded, handle the replacement logic
        if (req.files && req.files.length > 0) {
            // 1. Find the old property to get its image URLs
            const oldProperty = await prisma.property.findUnique({
                where: { id: parseInt(id) },
                include: { images: true }
            });

            // 2. Delete old images from Supabase Storage
            if (oldProperty && oldProperty.images.length > 0) {
                const oldImagePaths = oldProperty.images.map(image => image.url.substring(image.url.indexOf('/properties/')));
                await supabase.storage.from('real_estate_storage').remove(oldImagePaths);
            }

            // 3. Upload new images to Supabase
            const newImageUrls = [];
            for (const file of req.files) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                const fileName = `properties/property-${req.user.userId}-${Date.now()}-${sanitizedOriginalName}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('real_estate_storage')
                    .upload(fileName, file.buffer, { contentType: file.mimetype });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('real_estate_storage').getPublicUrl(uploadData.path);
                newImageUrls.push(urlData.publicUrl);
            }

             // 4. Update property with new image URLs
            const updatedProperty = await prisma.property.update({
                where: { id: parseInt(id) },
                data: {
                    title, description, price: parseFloat(price), address, area, city, district, division, type, category, contactInfo, isFeatured: isFeatured === 'true', status,
                    images: {
                        deleteMany: {}, // Delete old image records from DB
                        create: newImageUrls.map(url => ({ url })) // Create new ones
                    }
                },
            });
            return res.status(200).json(updatedProperty);
        } else {
             // If no new files, just update the text fields
            const updatedProperty = await prisma.property.update({
                where: { id: parseInt(id) },
                data: { title, description, price: parseFloat(price), address, area, city, district, division, type, category, contactInfo, isFeatured: isFeatured === 'true', status },
            });
            return res.status(200).json(updatedProperty);
        }
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property.' });
    }
};


exports.deleteProperty = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Find the property to get its image URLs
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true }
        });

        // 2. Delete images from Supabase Storage
        if (property && property.images.length > 0) {
            const imagePaths = property.images.map(image => image.url.substring(image.url.indexOf('/properties/')));
            await supabase.storage.from('real_estate_storage').remove(imagePaths);
        }

        // 3. Delete property from the database (Prisma will cascade delete image records)
        await prisma.property.delete({ where: { id: parseInt(id) } });
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property.' });
    }
};
