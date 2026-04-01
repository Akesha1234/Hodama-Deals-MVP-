import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const hasFetched = useRef(false);

    useEffect(() => {
        const verifyUserEmail = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            
            try {
                const response = await api.get(`/auth/verifyemail/${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Your email has been successfully verified.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Invalid or expired verification link.');
            }
        };

        if (token) {
            verifyUserEmail();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [token]);

    return (
        <div className="verify-email-container">
            <div className="verify-card">
                {status === 'verifying' && (
                    <div className="verify-content loading">
                        <Loader2 className="verify-icon spin" size={64} color="#1339E5" />
                        <h2>Verifying Your Email</h2>
                        <p>Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="verify-content success">
                        <CheckCircle className="verify-icon" size={64} color="#2F855A" />
                        <h2>Verification Successful!</h2>
                        <p>{message}</p>
                        <Link to="/login" className="verify-btn">Continue to Login</Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="verify-content error">
                        <XCircle className="verify-icon" size={64} color="#C53030" />
                        <h2>Verification Failed</h2>
                        <p>{message}</p>
                        <p className="verify-hint">The link may have expired or is incorrect. Please register again or request a new verification link.</p>
                        <Link to="/register" className="verify-btn btn-secondary">Go to Registration</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
