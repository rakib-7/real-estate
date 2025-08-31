'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import fetcher, { API_BASE_URL } from '@/lib/api';
import Button from '@/components/ui/Button';

// CORRECTED: The component now accepts a prop for the recipient's avatar URL.
const ChatInterface = ({ chatId, initialMessages = [], recipientName = 'Admin', recipientAvatarUrl }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // --- All your existing logic for state and effects remains the same ---
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (data) => {
            if (data.chatId === chatId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };
        socket.on('receive_message', handleReceiveMessage);
        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, chatId]);

    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (!newMessage.trim() || !socket) return;
    //     // const messageContent = newMessage;
    //     // setNewMessage('');

    //     const messageData = {
    //         content: newMessage,
    //         chatId: chatId,
    //         senderId: user.userId,
    //         // ADDED: Include the sender's avatarUrl in the optimistic update.
    //         sender: { 
    //             id: user.userId, 
    //             name: user.name || user.email, 
    //             role: user.role,
    //             avatarUrl: user.avatarUrl 
    //         },
    //         createdAt: new Date().toISOString(),
    //     };

    //     setMessages((prevMessages) => [...prevMessages, messageData]);
    //     setNewMessage('');
        
    //     try {
    //         const savedMessage = await fetcher('/chats/messages', {
    //             method: 'POST',
    //             body: JSON.stringify({ content: newMessage, chatId }),
    //         });
    //         socket.emit('send_message', savedMessage);
    //     } catch (error) {
    //         console.error("Failed to send message:", error);
    //     }
    // };
    // --- End of existing logic ---


    // new function waits for the server's response before updating the UI.
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        // Keep a copy of the message text and clear the input immediately for a responsive feel.
        const messageContent = newMessage;
        setNewMessage('');
        
        try {
            // 1. Send the message to the API to save it. The server will return the
            //    final, correct message object, including the updated sender avatarUrl.
            const savedMessage = await fetcher('/chats/messages', {
                method: 'POST',
                body: JSON.stringify({ content: messageContent, chatId }),
            });
    
            // 2. Update the local UI with the correct message returned from the server.
            setMessages((prevMessages) => [...prevMessages, savedMessage]);

            // 3. Emit the correct message via Socket.IO for real-time delivery to the admin.
            socket.emit('send_message', savedMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optional: Add logic here to show the user that the message failed to send.
            setNewMessage(messageContent); // Restore the message to the input on failure
        }
    };

    // COMMENTED OUT: Your entire old return statement is replaced by the new redesigned version below.
    /*
    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-xl font-semibold text-gray-800">Chat with {recipientName}</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.sender.id === user.userId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender.id === user.userId ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-75 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    // ... old form ...
                </form>
            </div>
        </div>
    );
    */

    // CORRECTED: The new, redesigned UI with profile pictures.
    return (
        <div className="flex flex-col h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg flex items-center">
                <img 
                    src={recipientAvatarUrl ? `${API_BASE_URL.replace('/api', '')}${recipientAvatarUrl}` : `https://placehold.co/40x40/e0e7ff/6366f1?text=${recipientName.charAt(0)}`}
                    alt={recipientName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Chat with {recipientName}</h3>
            </div>

            {/* Messages Display */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end mb-4 gap-3 ${msg.sender.id === user.userId ? 'justify-end' : 'justify-start'}`}>
                        {/* Avatar (for received messages) */}
                        {msg.sender.id !== user.userId && (
                            <img 
                                src={msg.sender?.avatarUrl ? `${API_BASE_URL.replace('/api', '')}${msg.sender.avatarUrl}` : `https://placehold.co/40x40/d1d5db/4b5563?text=${msg.sender.name?.charAt(0)}`}
                                alt={msg.sender?.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender.id === user.userId ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-75 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        {/* Avatar (for sent messages) */}
                        {msg.sender.id === user.userId && (
                             <img 
                                src={msg.sender?.avatarUrl ? `${API_BASE_URL.replace('/api', '')}${msg.sender.avatarUrl}` : `https://placehold.co/40x40/c7d2fe/4338ca?text=${user.email?.charAt(0)}`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-r-lg">
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;