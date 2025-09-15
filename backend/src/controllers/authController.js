const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const sgMail = require('@sendgrid/mail');
const prisma = new PrismaClient();
const SibApiV3Sdk = require('@sendinblue/client');


const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail(to, subject, textContent) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL, name: "RealEstatePro Support" };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.textContent = textContent;

  try {
    await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.body ? error.body.message : error.message);
    throw new Error('Email sending service failed.');
  }
}

exports.register = async (req, res) => {
    const { email, password, name, phoneNumber, location } = req.body;
    if (!email || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Email, password and phone number are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER',
                name,
                phoneNumber: phoneNumber,
                location: location || null,
                emailVerificationToken,
                isEmailVerified: false, 
            },
        });

        const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
        // const transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     secure: false, 
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });

        // await transporter.sendMail({
        //     from: `"Real Estate Support" <${process.env.SENDER_EMAIL}>`,
        //     to: user.email,
        //     subject: 'Please verify your email address',
        //     text: `Welcome! Please verify your email by clicking the following link: ${verificationURL}`,
        // });
        await sendEmail(
            user.email,
            'Please verify your email address',
            `Welcome! Please verify your email by clicking the following link: ${verificationURL}`
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

       

        if( user.role === 'USER' && !user.isEmailVerified){
            return res.status(403).json({ error: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect Password.' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email, avatarUrl: user.avatarUrl },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === 'production',
            secure: true,
            sameSite: 'None',
            maxAge: 3600000,
        });

        res.status(200).json({ 
            userId: user.id, 
            email: user.email, 
            role: user.role, 
            avatarUrl: user.avatarUrl 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in.' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                isEmailVerified: true,
                emailVerificationToken: null 
            },
        });
        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Error verifying email.' });
    }   
};

exports.logout = (req, res) => {
    res.clearCookie('token',{
        secure: process.env.NODE_ENV ==='production',
        sameSite: 'Lax',
    });
    res.status(200).json({ message: 'Logged out successfully.' });
};

exports.status = async (req, res) => {
    const userIdFromToken = req.user.userId;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userIdFromToken },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                avatarUrl: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const { id, ...userData } = user;
        res.status(200).json({ userId: user.id, ...userData });
    } catch (error) {
        console.error('Auth status error:', error);
        res.status(500).json({ error: 'Failed to fetch user status.' });
    }
};

/**
 * Handles the "Forgot Password" request.
 * Generates a reset token and emails a reset link to the user.
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // To prevent attackers from checking which emails are registered,
            // we send a success message even if the user doesn't exist.
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been generated.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // Token is valid for 10 minutes

        await prisma.user.update({
            where: { email: user.email },
            data: {
                passwordResetToken,
                passwordResetTokenExpires,
            },
        });

        // This is the link that would normally be emailed.
        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        // const transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });

        // await transporter.sendMail({
        //     from: `"Real Estate Support" <${process.env.SENDER_EMAIL}>`,
        //     to: user.email,
        //     subject: 'Your Password Reset Link',
        //     text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
        // });
        await sendEmail(
      user.email,
      'Your Password Reset Link',
      `You requested a password reset. Click here: ${resetURL}`
    );
        
        // COMMENTED OUT: The old email sending logic.
        /*
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.email,
            from: 'your-verified-email@example.com',
            subject: 'Your Password Reset Link',
            text: `Here is your reset link: ${resetURL}`,
        };
        await sgMail.send(msg);
        */

        res.status(200).json({ message: 'A password reset link has been sent to your email.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'There was an error processing the password reset request.' });
    }
};


// The resetPassword function remains exactly the same.
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    try {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetTokenExpires: {
                    gte: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetTokenExpires: null,
            },
        });

        await sendEmail(
            user.email,
            'Your password has been changed',
            `Hello ${user.name || ''},\n\nYour password was successfully changed. If this wasn’t you, please contact support immediately.`
        );

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
};
