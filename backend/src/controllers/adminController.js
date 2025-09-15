const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --- User Management (Admin) ---
exports.createAdminUser = async (req, res) => {
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
                name: name || null,
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

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true, subscription: true, listingResetDate: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    const { id } = req.params;
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
            select: { id: true, email: true, role: true, name: true, phoneNumber: true, location: true, createdAt: true, subscription: true, listingResetDate: true },
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

exports.deleteUserByAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user by admin:', error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};

// --- Chat Management (Admin) ---
exports.getAllChatsForAdmin = async (req, res) => {
    try {
        const chats = await prisma.chat.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatarUrl: true }
                },
                _count: {
                    select: { messages: true }
                }
            }
        });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching all chats for admin:', error);
        res.status(500).json({ error: 'Failed to retrieve chats.' });
    }
};

exports.getChatMessagesForAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const chat = await prisma.chat.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: { select: { id: true, name: true, role: true, avatarUrl: true } }
                    }
                }
            }
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found for this user.' });
        }
        res.status(200).json(chat.messages);
    } catch (error) {
        console.error('Error fetching chat messages for admin:', error);
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
};


// --- Property Management (Admin) ---
exports.getAllPropertiesAdmin = async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            include: { images: true, user: { select: { name: true, email: true }} }
        });
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching all properties for admin:', error);
        res.status(500).json({ error: 'Failed to retrieve properties for admin view.' });
    }
};

exports.updatePropertyStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be "approved", "rejected", or "pending".' });
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

// --- Banner Management (Admin) ---

exports.uploadBanner = async (req, res) => {
    const { title, description, linkUrl, isActive, position } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ error: 'Banner image is required.' });
    }
    
    try {
        const file = req.file;
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `banners/banner-${Date.now()}-${sanitizedOriginalName}`;

        // 1. Upload to Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('real_estate_storage') // Make sure this bucket name is correct
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });
        
        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from('real_estate_storage')
            .getPublicUrl(uploadData.path);
        
        const imageUrl = urlData.publicUrl;

        // 3. Save to Database
        const banner = await prisma.banner.create({
            data: {
                title,
                description,
                imageUrl,
                linkUrl,
                isActive: isActive === 'true',
                position
            }
        });
        res.status(201).json(banner);
    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({ error: 'Failed to create banner.' });
    }
};

exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    const { title, description, linkUrl, isActive, position } = req.body;

    try {
        const updateData = { title, description, linkUrl, isActive: isActive === 'true', position };

        if (req.file) {
            // 1. Find old banner to get its image path for deletion
            const existingBanner = await prisma.banner.findUnique({ where: { id: parseInt(id) } });

            // 2. Delete old image from Supabase Storage
            if (existingBanner && existingBanner.imageUrl) {
                const oldImagePath = existingBanner.imageUrl.substring(existingBanner.imageUrl.indexOf('/banners/'));
                await supabase.storage.from('real_estate_storage').remove([oldImagePath]);
            }
            
            // 3. Upload new image to Supabase
            const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const fileName = `banners/banner-${Date.now()}-${sanitizedOriginalName}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('real_estate_storage')
                .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

            if (uploadError) throw uploadError;

            // 4. Get new public URL and add to update data
            const { data: urlData } = supabase.storage.from('real_estate_storage').getPublicUrl(uploadData.path);
            updateData.imageUrl = urlData.publicUrl;
        }

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
        const banner = await prisma.banner.findUnique({ where: { id: parseInt(id) } });

        if (!banner) {
            return res.status(404).json({ error: 'Banner not found.' });
        }

        // 1. Delete image from Supabase Storage
        if (banner.imageUrl) {
            const imagePath = banner.imageUrl.substring(banner.imageUrl.indexOf('/banners/'));
            await supabase.storage.from('real_estate_storage').remove([imagePath]);
        }

        // 2. Delete banner record from database
        await prisma.banner.delete({ where: { id: parseInt(id) } });
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ error: 'Failed to delete banner.' });
    }
};


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

exports.getPublicBanners = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
        });
        res.status(200).json(banners);
    } catch (error) {
        console.error('Error fetching public banners:', error);
        res.status(500).json({ error: 'Failed to retrieve public banners.' });
    }
};


// --- Site Analytics ---
exports.getSiteAnalytics = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalProperties = await prisma.property.count();
        const totalChats = await prisma.chat.count();
        const totalBanners = await prisma.banner.count();
        const featuredProperties = await prisma.property.count({ where: { isFeatured: true } });

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

        const recentChats = await prisma.chat.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { email: true, name: true } },
                _count: { select: { messages: true } }
            }
        });

        res.status(200).json({
            totalUsers,
            totalProperties,
            totalChats,
            totalBanners,
            featuredPropertiesCount: featuredProperties,
            recentActivity: {
                users: recentUsers,
                properties: recentProperties,
                chats: recentChats
            }
        });
    } catch (error) {
        console.error('Error fetching site analytics:', error);
        res.status(500).json({ error: 'Failed to retrieve analytics data.' });
    }
};
