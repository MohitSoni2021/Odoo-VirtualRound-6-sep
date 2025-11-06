import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email, name, otp) => {
    try {
        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello ${name || 'there'},</h2>
                    <p>Thank you for registering! Please use the following OTP to verify your email address:</p>
                    
                    <div style="background: #f4f4f4; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 2px;">
                        <strong>${otp}</strong>
                    </div>
                    
                    <p>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello ${name || 'there'},</h2>
                    <p>You requested to reset your password. Please click the button below to set a new password:</p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${resetUrl}" 
                           style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href="${resetUrl}" style="color: #4CAF50; word-break: break-all;">${resetUrl}</a></p>
                    
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

export default {
    sendVerificationEmail,
    sendPasswordResetEmail
};
