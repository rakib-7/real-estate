'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import fetcher from '@/lib/api';
import Button from '@/components/ui/Button';

const ChatInterface = ({ chatId, initialMessages = [], recipientName = 'Admin' }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    // Effect to scroll to the bottom of the chat window when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Effect to listen for incoming messages from the real-time server
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            // Only add the message if it belongs to the currently active chat
            if (data.chatId === chatId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        // const messageData = {
        //     content: newMessage,
        //     chatId: chatId,
        //     senderId: user.userId,
        //     sender: { id: user.userId, name: user.name || user.email, role: user.role }
        // };

        const messageData = {
            content: newMessage,
            chatId: chatId,
            senderId: user.userId,
            sender: { id: user.userId, name: user.name || user.email, role: user.role },
            createdAt: new Date().toISOString(), // This is the crucial addition
        };

        // 1. Update the local state immediately for a responsive UI.
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage('');

    //     // 1. Send the message via the API to save it to the database
    //     await fetcher('/chats/messages', {
    //         method: 'POST',
    //         body: JSON.stringify({ content: newMessage, chatId }),
    //     });

    //     // 2. Emit the message via Socket.IO for real-time delivery
    //     socket.emit('send_message', messageData);

    //     // 3. Update the local state immediately for a responsive UI
    //     setMessages((prevMessages) => [...prevMessages, messageData]);
    //     setNewMessage('');
    // };

    try {
            // 2. Send the message via the API to save it to the database.
            const savedMessage = await fetcher('/chats/messages', {
                method: 'POST',
                body: JSON.stringify({ content: newMessage, chatId }),
            });
    
            // 3. Emit the message via Socket.IO for real-time delivery to the other person.
            socket.emit('send_message', savedMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally, add logic here to show the user that the message failed to send.
        }
    };

    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md">
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-xl font-semibold text-gray-800">Chat with {recipientName}</h3>
            </div>

            {/* Messages Display */}
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

            {/* Message Input Form */}
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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