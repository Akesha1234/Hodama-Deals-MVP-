import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if there is a logged-in user in localStorage
        const storedUser = localStorage.getItem('hd_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Registration Mock
    const register = (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('hd_users') || '[]');

                // Check if email already exists
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('Email already registered!'));
                    return;
                }

                // Append new user
                users.push(userData);
                localStorage.setItem('hd_users', JSON.stringify(users));

                // Auto login
                const { password, ...userSession } = userData;
                localStorage.setItem('hd_current_user', JSON.stringify(userSession));
                setUser(userSession);

                resolve(userData);
            }, 1000);
        });
    };

    // Login Mock
    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
                const foundUser = users.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    // Save session
                    const { password, ...userSession } = foundUser; // Don't store password in session
                    localStorage.setItem('hd_current_user', JSON.stringify(userSession));
                    setUser(userSession);
                    resolve(userSession);
                } else {
                    reject(new Error('Invalid email or password!'));
                }
            }, 1000);
        });
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('hd_current_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
