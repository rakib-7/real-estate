'use client';
import React from 'react';

// Team member data - in a real app, this might come from an API
const teamMembers = [
    { 
        name: 'Rakib',
        role: 'Project Lead & Backend Developer',
        imageUrl: '/images/rakib.jpg',
        socialUrl: 'https://github.com/rakib-7' },
    { 
        name: 'Primon',
        role: 'Frontend & UI/UX Designer',
        imageUrl: '/images/primon.jpg',
        socialUrl: ''},
    { 
        name: 'Akib',
        role: 'Frontend & UI/UX Designer',
        imageUrl: 'https://placehold.co/400x400/8b5cf6/ffffff?text=M3',
        socialUrl: ''},
];

export default function AboutUsPage() {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-indigo-800 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold drop-shadow-lg">About RealEstate</h1>
                    <p className="text-xl mt-4 text-indigo-200 max-w-2xl mx-auto">Your trusted partner in finding the perfect property in Bangladesh.</p>
                </div>
            </section>

            {/* Mission and Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our mission is to simplify the real estate experience in Bangladesh by connecting buyers, sellers, and renters with transparency and efficiency. We leverage technology to make every property transaction smooth, secure, and hassle-free.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Founded by a passionate team of developers, RealEstate was born from the desire to solve the common challenges in the local property market. We aim to build a platform that is not only powerful but also trustworthy and easy for everyone to use.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-10">Meet the Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {teamMembers.map((member) => (
                            // <div key={member.name} className="bg-gray-50 p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                            //     <img className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md" src={member.imageUrl} alt={member.name} />
                            //     <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                            //     <p className="text-indigo-600">{member.role}</p>
                            // </div>
                            <a 
                                key={member.name} 
                                href={member.socialUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-gray-50 p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 block"
                            >
                                <img className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover" src={member.imageUrl} alt={member.name} />
                                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                                <p className="text-indigo-600">{member.role}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}