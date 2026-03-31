import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [logMessage, setLogMessage] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLogMessage(null);

        try {
            const user = await login(email, password);
            setIsLoading(false);
            setLogMessage({ type: 'success', text: 'Login successful!' });

            setTimeout(() => {
                if (user.role === 'Business Account' || user.role === 'Client' || user.role === 'Seller' || user.role === 'Partner') navigate('/client/dashboard');
                else if (user.role === 'Admin') navigate('/admin/dashboard');
                else navigate('/');
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            setLogMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="hd-login-card">
                <div className="hd-login-content">
                    
                    <div className="hd-login-header">
                        <h1>Welcome Back!</h1>
                        <p>Sign in to your Hodama Deals account.</p>
                    </div>

                    {logMessage && (
                        <div className={`message-banner ${logMessage.type}`} style={{ 
                            padding: '15px', 
                            borderRadius: '8px', 
                            marginBottom: '30px',
                            backgroundColor: logMessage.type === 'error' ? '#FFF5F5' : '#F0FFF4',
                            color: logMessage.type === 'error' ? '#C53030' : '#2F855A',
                            textAlign: 'center',
                            border: `1px solid ${logMessage.type === 'error' ? '#FEB2B2' : '#9AE6B4'}`,
                            fontWeight: '600'
                        }}>
                            {logMessage.text}
                        </div>
                    )}

                    <form className="hd-login-form" onSubmit={handleLogin}>
                        <div className="hd-input-group">
                            <label className="hd-label">Email Address</label>
                            <div className="hd-input-wrapper">
                                <input
                                    type="email"
                                    className="hd-login-input"
                                    placeholder="e.g.kamal@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="hd-input-group">
                            <label className="hd-label">Password</label>
                            <div className="hd-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="hd-login-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <div className="hd-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                </div>
                            </div>
                        </div>

                        <div className="hd-login-options">
                            <label className="hd-remember-me">
                                <input type="checkbox" disabled={isLoading} />
                                Remember Me
                            </label>
                            <a href="#" className="hd-forgot-password" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="hd-login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'LOG IN TO MY ACCOUNT'}
                        </button>
                    </form>

                    <div className="hd-social-divider">
                        <div className="hd-divider-line"></div>
                        <span className="hd-divider-text">or Sign in with</span>
                        <div className="hd-divider-line"></div>
                    </div>

                    <div className="hd-social-icons">
                        {/* Google Icon */}
                        <div className="hd-social-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="45px" height="45px">
                                <path fill="#FFC107" d="M43.611 20.083c.35 1.571.556 3.222.556 4.917 0 11.046-8.954 20-20 20S4.167 36.046 4.167 25c0-11.046 8.954-20 20-20 5.418 0 10.323 2.146 13.911 5.617L31.812 16.89C29.673 14.881 26.83 13.667 23.667 13.667c-6.262 0-11.333 5.071-11.333 11.333s5.071 11.333 11.333 11.333c4.156 0 7.788-2.235 9.803-5.583l-9.803-.001v-10.666h20.144z"/>
                                <path fill="#FF3D00" d="M6.306 14.691L13.842 20.35C15.684 16.393 19.782 13.667 24.5 13.667c3.161 0 6.002 1.213 8.139 3.223l6.545-6.545C34.823 6.146 29.917 4 24.5 4c-7.901 0-14.717 4.354-18.194 10.691z"/>
                                <path fill="#4CAF50" d="M24.5 44c5.166 0 9.86-1.977 13.414-5.195l-6.422-6.422C29.679 34.346 27.214 35.333 24.5 35.333c-5.264 0-9.814-3.411-11.411-8.125l-7.771 5.959C8.784 39.537 16.113 44 24.5 44z"/>
                                <path fill="#1976D2" d="M43.611 20.083H24.5v10.667h10.315c-.808 2.044-2.221 3.751-4 4.883l6.422 6.422C41.366 38.648 44 32.148 44 25c0-1.695-.206-3.346-.556-4.917z"/>
                            </svg>
                        </div>

                        {/* Facebook Icon */}
                        <div className="hd-social-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="45px" height="45px">
                                <circle cx="24" cy="24" r="23" fill="#1877F2"/>
                                <path fill="#fff" d="M30 16h-3c-1.3 0-2 .6-2 1.8V21h5l-.6 5H25v13h-5V26h-3v-5h3v-3.7c0-3 1.9-4.3 4.8-4.3 1.4 0 2.6.1 3 .1V16z"/>
                            </svg>
                        </div>

                        {/* Apple Icon */}
                        <div className="hd-social-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="45px" height="45px">
                                <path d="M35.6,27.1c0,3.3,1.9,6.1,4.7,7.4c-2.3,3.4-5.9,5.7-9.5,5.7c-2.3,0-3.9-0.8-5.6-0.8c-1.8,0-3.6,0.8-5.5,0.8 c-3.2,0-7.3-3.4-9.3-8.8c-2-5.4-0.1-10.4,2.9-13c1.7-1.5,4-2.4,6.4-2.4c1.9,0,3.5,0.6,5,0.6c1.2,0,3-0.8,5.4-0.8 c2,0,4.5,0.7,6.3,2C33.8,19,35.6,22.6,35.6,27.1z M28.7,11c0,0.1,0,0.1,0,0.2c0,3-2.5,5.5-5.5,5.5c-0.1,0-0.2,0-0.2,0 c0-3.1,2.5-5.6,5.6-5.6C28.6,11.1,28.7,11.1,28.7,11z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="hd-login-footer">
                        New to Hodama Deals?
                        <Link to="/register">Create an Account</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

