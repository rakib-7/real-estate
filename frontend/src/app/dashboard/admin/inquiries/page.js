'use client';
import React, { useState, useEffect } from 'react';
import fetcher from '@/lib/api';
import ChatInterface from '@/components/ChatInterface';

export default function AdminChatPage() { 
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        setLoading(true);
        setError(null);
        try {
            // This now calls the correct endpoint for the admin chat list
            const data = await fetcher('/chats/admin/all');
            setChats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        try {
            // This calls the correct endpoint for a specific user's messages
            const messageData = await fetcher(`/chats/admin/${chat.userId}`);
            setMessages(messageData);
        } catch (err) {
            setError(`Failed to load messages for ${chat.user.name}: ${err.message}`);
            setMessages([]);
        }
    };

    if (loading) {
        return <p className="text-center p-8 text-xl text-gray-700">Loading user chats...</p>;
    }

    if (error) {
        return <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>;
    }

    return (
        <>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Live Chat Support</h2>
            <div className="flex h-[75vh] border rounded-lg bg-white">
                {/* Sidebar with a list of user chats */}
                <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
                    {chats.length === 0 ? (
                        <p className="p-4 text-gray-500">No active chats.</p>
                    ) : (
                        <ul>
                            {chats.map(chat => (
                                <li
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat)}
                                    className={`p-4 cursor-pointer hover:bg-indigo-100 transition-colors duration-200 ${selectedChat?.id === chat.id ? 'bg-indigo-200 font-semibold' : ''}`}
                                >
                                    <p className="text-gray-800">{chat.user.name || chat.user.email}</p>
                                    <p className="text-sm text-gray-600">{chat._count.messages} messages</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Main chat window */}
                <div className="w-2/3 flex flex-col">
                    {selectedChat ? (
                        <ChatInterface
                            chatId={selectedChat.id}
                            initialMessages={messages}
                            recipientName={selectedChat.user.name || selectedChat.user.email}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-lg">Select a chat to view messages</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/*
// --- OLD ADMIN INQUIRIES PAGE CODE COMMENTED OUT ---

import InquiryItem from '@/components/InquiryItem';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]); // Re-fetch on filter change

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher('/admin/inquiries');
      let filteredData = data;
      if (filterStatus === 'responded') {
        filteredData = data.filter(inq => inq.response !== null && inq.response !== '');
      } else if (filterStatus === 'pending') {
        filteredData = data.filter(inq => inq.response === null || inq.response === '');
      }
      setInquiries(filteredData);
    } catch (err) => {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center p-8 text-xl text-gray-700">Loading inquiries...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Customer Inquiries</h2>

      <div className="mb-8 flex justify-end">
        <label htmlFor="inquiry-filter" className="sr-only">Filter Inquiries</label>
        <select
          id="inquiry-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
        >
          <option value="all">All Inquiries</option>
          <option value="pending">Pending Inquiries</option>
          <option value="responded">Responded Inquiries</option>
        </select>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-gray-600 text-lg">No inquiries found for the selected filter.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {inquiries.map(inquiry => (
            <InquiryItem key={inquiry.id} inquiry={inquiry} onRespond={fetchInquiries} />
          ))}
        </div>
      )}
    </>
  );
}
*/