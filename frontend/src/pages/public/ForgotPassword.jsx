import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ShieldCheck, Lock, EyeOff, Eye, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Form states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);
        try {
            const res = await api.post('/auth/forgotpassword', { email });
            setMessage({ type: 'success', text: res.data.message });
            setStep(2);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send OTP' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);
        try {
            const res = await api.post('/auth/verifyotp', { email, otp });
            setMessage({ type: 'success', text: res.data.message });
            setStep(3);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired OTP' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setMessage(null);
        setIsLoading(true);
        try {
            const res = await api.put('/auth/resetpassword', { email, otp, newPassword });
            setMessage({ type: 'success', text: res.data.message });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reset password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fp-container">
            <div className="fp-card">
                <Link to="/login" className="fp-back-link">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {step === 1 && (
                    <div className="fp-step fade-in">
                        <div className="fp-icon-wrap">
                            <Mail size={40} color="#1339E5" />
                        </div>
                        <h2>Forgot Password</h2>
                        <p>Enter your registered email address to receive a 6-digit OTP code.</p>

                        {message && <div className={`fp-msg ${message.type}`}>{message.text}</div>}

                        <form onSubmit={handleSendOTP}>
                            <div className="fp-input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <button type="submit" className="fp-btn" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spin" size={20} /> : 'Send OTP'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="fp-step fade-in">
                        <div className="fp-icon-wrap">
                            <ShieldCheck size={40} color="#1339E5" />
                        </div>
                        <h2>Verify OTP</h2>
                        <p>We've sent a 6-digit code to <strong>{email}</strong></p>

                        {message && <div className={`fp-msg ${message.type}`}>{message.text}</div>}

                        <form onSubmit={handleVerifyOTP}>
                            <div className="fp-input-group">
                                <label>Enter OTP Code</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    disabled={isLoading}
                                    className="fp-otp-input"
                                />
                            </div>
                            <button type="submit" className="fp-btn" disabled={isLoading || otp.length < 6}>
                                {isLoading ? <Loader2 className="spin" size={20} /> : 'Verify Code'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="fp-step fade-in">
                        <div className="fp-icon-wrap">
                            <Lock size={40} color="#1339E5" />
                        </div>
                        <h2>Reset Password</h2>
                        <p>Enter your new password below.</p>

                        {message && <div className={`fp-msg ${message.type}`}>
                            {message.type === 'success' && <CheckCircle size={16} />}
                            {message.text}
                        </div>}

                        <form onSubmit={handleResetPassword}>
                            <div className="fp-input-group">
                                <label>New Password</label>
                                <div className="fp-pass-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength="6"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="fp-input-group">
                                <label>Confirm Password</label>
                                <div className="fp-pass-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="fp-btn" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spin" size={20} /> : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
