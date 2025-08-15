'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
        return (
        <footer className="w-full bg-gray-800 text-gray-400">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-6">
                {/* Left Side: Copyright */}
                <p className="text-sm mb-4 sm:mb-0">
                    &copy; {new Date().getFullYear()} RealEstatePro. All rights reserved.
                </p>
                
                {/* Center: Legal & About Links */}
                <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                    <Link href="/about-us" className="text-sm hover:text-white transition-colors">
                        About Us
                    </Link>
                    <Link href="/terms-and-conditions" className="text-sm hover:text-white transition-colors">
                        Terms
                    </Link>
                    <Link href="/privacy-policy" className="text-sm hover:text-white transition-colors">
                        Privacy
                    </Link>
                </div>

                {/* Right Side: Contact Info */}
                <div className="flex items-center space-x-4 text-sm">
                    <span>realestate@gmail.com</span>
                    <span>|</span>
                    <span>+8801871602487</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;