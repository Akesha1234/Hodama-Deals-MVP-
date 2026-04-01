import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if there is a logged-in user session
        const storedUser = localStorage.getItem('hd_current_user');
        const token = localStorage.getItem('hd_auth_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        } else {
            // Clear stale state if token is missing
            localStorage.removeItem('hd_current_user');
        }
        setLoading(false);
    }, []);

    // Real Backend Registration
    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            // Throw specific error message from the backend if available
            const msg = error.response?.data?.message || 'Registration failed.';
            throw new Error(msg);
        }
    };

    // Real Backend Login
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            const { token, user: userSession } = response.data;

            // Save session
            localStorage.setItem('hd_auth_token', token);
            localStorage.setItem('hd_current_user', JSON.stringify(userSession));
            setUser(userSession);

            return userSession;
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid email or password!';
            throw new Error(msg);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('hd_auth_token');
        localStorage.removeItem('hd_current_user');
        setUser(null);
    };

    // Google Login
    const loginWithGoogle = async (googleData) => {
        try {
            const response = await api.post('/auth/google', googleData);
            const { token, user: userSession } = response.data;

            localStorage.setItem('hd_auth_token', token);
            localStorage.setItem('hd_current_user', JSON.stringify(userSession));
            setUser(userSession);
            return userSession;
        } catch (error) {
            const msg = error.response?.data?.message || 'Google Login failed!';
            throw new Error(msg);
        }
    };

    // Facebook Login
    const loginWithFacebook = async (facebookData) => {
        try {
            const response = await api.post('/auth/facebook', facebookData);
            const { token, user: userSession } = response.data;

            localStorage.setItem('hd_auth_token', token);
            localStorage.setItem('hd_current_user', JSON.stringify(userSession));
            setUser(userSession);
            return userSession;
        } catch (error) {
            const msg = error.response?.data?.message || 'Facebook Login failed!';
            throw new Error(msg);
        }
    };

    // Upgrade to Seller
    const becomeSeller = async (sellerData) => {
        try {
            const response = await api.put('/auth/become-seller', sellerData);
            const { token, user: userSession } = response.data;

            localStorage.setItem('hd_auth_token', token);
            localStorage.setItem('hd_current_user', JSON.stringify(userSession));
            setUser(userSession);
            return userSession;
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to upgrade to seller!';
            throw new Error(msg);
        }
    };

    // Send Login OTP
    const sendLoginOTP = async (email) => {
        try {
            const response = await api.post('/auth/send-login-otp', { email });
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send login code!';
            throw new Error(msg);
        }
    };

    // Verify Login OTP
    const verifyLoginOTP = async (email, otp) => {
        try {
            const response = await api.post('/auth/verify-login-otp', { email, otp });
            const { token, user: userSession } = response.data;

            localStorage.setItem('hd_auth_token', token);
            localStorage.setItem('hd_current_user', JSON.stringify(userSession));
            setUser(userSession);
            return userSession;
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid or expired code!';
            throw new Error(msg);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, loginWithFacebook, becomeSeller, sendLoginOTP, verifyLoginOTP, loading }}>
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
