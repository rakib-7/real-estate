'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';
import ChatInterface from '@/components/ChatInterface'; // ADDED: Import the new chat component

export default function UserChatPage() { // RENAMED: from UserInquiriesPage
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
    const [chatData, setChatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || isAdmin) {
            router.push('/login');
        } else {
            fetchUserChat();
        }
    }, [isAuthenticated, isAdmin, authLoading, router]);

    const fetchUserChat = async () => {
        setLoading(true);
        setError(null);
        try {
            // CORRECTED: Fetch the user's chat thread from the new endpoint
            const data = await fetcher('/chats');
            setChatData(data);
        } catch (err)  {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="text-center p-8 text-xl text-gray-700">Loading your chat...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
    }

    return (
        <>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Chat with Admin</h2>
            {chatData ? (
                <ChatInterface
                    chatId={chatData.id}
                    initialMessages={chatData.messages}
                    recipientName="Admin Support"
                />
            ) : (
                <p>Could not load chat.</p>
            )}
        </>
    );
}


/*
// --- OLD USER INQUIRIES PAGE CODE COMMENTED OUT ---

export default function UserInquiriesPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth status to load
    if (!isAuthenticated || isAdmin) { // Ensure it's a regular user
      router.push('/login');
    } else {
      fetchUserInquiries();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchUserInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher('/user/inquiries');
      setInquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center p-8 text-xl text-gray-700">Loading your inquiries...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Sent Inquiries</h2>
      {inquiries.length === 0 ? (
        <p className="text-gray-600 text-lg">You have not sent any inquiries yet. Browse properties to submit one!</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map(inquiry => (
            <div key={inquiry.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <p className="text-lg font-semibold text-gray-800 mb-2">Regarding: <Link href={`/properties/${inquiry.property?.id}`} className="text-indigo-600 hover:underline">{inquiry.property?.title || 'N/A'} ({inquiry.property?.location})</Link></p>
              <p className="text-gray-700 text-base leading-relaxed">Your message: "<span className="italic">{inquiry.message}</span>"</p>
              <p className="text-gray-500 text-sm mt-4">Sent on: {new Date(inquiry.createdAt).toLocaleString()}</p>
              {inquiry.response ? (
                <div className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-lg">
                  <p className="font-semibold text-xl mb-2">Seller Response:</p>
                  <p className="text-base">{inquiry.response}</p>
                </div>
              ) : (
                <p className="text-gray-500 mt-6 text-base">No response yet from seller.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
*/