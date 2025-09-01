'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '@/lib/api'; 

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Only establish a connection if the user is authenticated.
        if (isAuthenticated) {
            
            // const newSocket = io('http://localhost:5000');
            // setSocket(newSocket);
            const socketUrl = API_BASE_URL.replace('/api', '');
            const newSocket = io(socketUrl);

            // Join the user's personal chat room upon connection.
            newSocket.emit('join_chat', user.userId);

            // Cleanup function to disconnect when the component unmounts or user logs out.
            return () => newSocket.disconnect();
        } else {
            
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
