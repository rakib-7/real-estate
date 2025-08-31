//It will be run once to create the first admin user.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123';

   

    // Check if the admin user already exists to avoid errors
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin user already exists. No action taken.');
        return;
    }

    // If the admin does not exist, create them
    console.log('Admin user not found. Creating new admin user...');
    
    // We must hash the password, just like in the registration function
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            phoneNumber: '01871602487',
            role: 'ADMIN',
            isEmailVerified: true, 
        },
    });

    console.log(`Successfully created new admin user: ${adminEmail}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
