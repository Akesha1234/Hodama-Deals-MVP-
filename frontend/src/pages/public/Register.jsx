import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    ShieldCheck,
    Loader2,
    Check,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ReCAPTCHA from "react-google-recaptcha";
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') === 'client' ? 'Client' : 'Buyer';

    // Context methods
    const { register } = useAuth();

    // Multi-step state
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(initialRole);

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [strength, setStrength] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(true); // Default true for mock or implement if needed
    const [regMessage, setRegMessage] = useState(null);
    const [newsletter, setNewsletter] = useState(false);
    const [helpManaging, setHelpManaging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);

    // Form data states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('Individual');
    const [category, setCategory] = useState('');
    const [websiteLink, setWebsiteLink] = useState('');

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setStrength('');
            return;
        }
        if (password.length < 6) {
            setStrength('weak');
        } else if (password.length >= 6 && password.length < 10) {
            setStrength('medium');
        } else {
            setStrength('strong');
        }
    }, [password]);

    const handleEmailBlur = () => {
        if (!email) return;
        // Simple regex frontend validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (emailError) {
            setRegMessage({ type: 'error', text: 'Please resolve the errors before submitting.' });
            return;
        }

        if (password !== confirmPassword) {
            setRegMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setIsLoading(true);
        setRegMessage(null);

        try {
            const fullName = role === 'Client' ? businessName.trim() : `${firstName.trim()} ${lastName.trim()}`.trim();
            
            const apiPayload = {
                name: fullName,
                email: email.trim(),
                password,
                phone: phone.trim(),
                role: role === 'Client' ? 'seller' : 'customer',
                captchaToken,
            };

            if (role === 'Client') {
                apiPayload.sellerProfile = {
                    businessName: businessName.trim(),
                    businessType: businessType,
                    category: category,
                    websiteLink: websiteLink.trim()
                };
            }

            const result = await register(apiPayload);

            setIsLoading(false);
            setRegMessage({
                type: 'success',
                text: result.message || 'Account created successfully! Please log in.'
            });

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setIsLoading(false);
            let errorMessage = 'Registration failed. Please try again.';
            
            // Comprehensive error extraction from backend response
            if (error.response && error.response.data) {
                const data = error.response.data;
                
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.map(e => e.message || e).join(', ');
                }
                
                // Add specific hint for reCAPTCHA if message includes it
                if (errorMessage.toLowerCase().includes('recaptcha')) {
                    errorMessage += ' — Please make sure you checked "I\'m not a robot".';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setRegMessage({ type: 'error', text: errorMessage });
        }
    };

    const nextStep = () => {
        if (step === 1) {
            setStep(2);
            setRegMessage(null);
        }
    };

    const prevStep = () => {
        if (step === 2) {
            setStep(1);
            setRegMessage(null);
        }
    };

    // Images paths
    const userImg = '/assets/images/user_signup.png';
    const businessImg = '/assets/images/business_signup.png';

    return (
        <div className="register-container">
            <div className="register-card-modern">
                {/* Top Design Banner (Moved inside the card) */}
                <div className="register-top-banner">
                    <div className="blue-triangle"></div>
                    <div className="yellow-strip"></div>
                </div>

                <div className="register-content-wrapper">

                    {/* Step Indicator */}
                    <div className="step-indicator-modern">
                        <span className="step-text-main">Step {step} Of 2:</span>
                        <span className="step-title-description">Choose Your Account Type</span>
                    </div>

                    <div className="step-progress-bar-container">
                        <div className="step-progress-fill-active" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                    </div>

                    {step === 1 && (
                        <div className="step-1-container fade-in">
                            <div className="role-cards">

                                {/* User Role Card */}
                                <div
                                    className={`role-select-card-new ${role === 'Buyer' ? 'selected' : ''}`}
                                    onClick={() => setRole('Buyer')}
                                >
                                    {role === 'Buyer' && (
                                    <div className="checkmark-badge-custom">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="40" height="40" rx="10" fill="white"/>
                                            <path d="M12 21.5L17.5 27L28.5 13" stroke="#1339E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <rect x="7" y="7" width="26" height="26" rx="4" stroke="#1339E5" strokeWidth="5" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                )}

                                    <div className="card-image-main">
                                        <img src={userImg} alt="Sign Up as a User" className="role-full-img" />
                                    </div>
                                </div>

                                {/* Business Role Card */}
                                <div
                                    className={`role-select-card-new ${role === 'Client' ? 'selected' : ''}`}
                                    onClick={() => setRole('Client')}
                                >
                                    {role === 'Client' && (
                                    <div className="checkmark-badge-custom">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="40" height="40" rx="10" fill="white"/>
                                            <path d="M12 21.5L17.5 27L28.5 13" stroke="#1339E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <rect x="7" y="7" width="26" height="26" rx="4" stroke="#1339E5" strokeWidth="5" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                )}

                                    <div className="card-image-main">
                                        <img src={businessImg} alt="Sign Up as a Business" className="role-full-img" />
                                    </div>
                                </div>

                            </div>

                            <div className="continue-wrapper">
                                <button className="continue-btn" onClick={nextStep} disabled={!role}>
                                    Continue <ArrowRight size={18} strokeWidth={4} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-2-container-new fade-in">
                            <div className="form-header-modern">
                                <button className="back-btn-circle" onClick={prevStep}>
                                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="20" cy="20" r="18.5" stroke="#1D3182" strokeWidth="3"/>
                                        <path d="M24 12L16 20L24 28" stroke="#1D3182" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <h1 className="form-main-title">Create Your {role === 'Client' ? 'Business' : ''} Account</h1>
                                <p className="form-sub-title">Join Hodama Deals and start trading today!</p>
                            </div>

                            {regMessage && (
                                <div className={`reg-message ${regMessage.type}`}>
                                    {regMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    {regMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="register-form-modern">
                                {role === 'Client' ? (
                                    <>
                                        <div className="input-block-labeled">
                                            <label>Business Name</label>
                                            <input
                                                type="text"
                                                className="reg-input-new"
                                                placeholder="Tech Store"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="input-block-labeled">
                                            <label>Category</label>
                                            <select
                                                className="reg-input-new select-custom-arrow"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            >
                                                <option value="" disabled>Select category</option>
                                                <option value="salon">{t('salon').charAt(0).toUpperCase() + t('salon').slice(1)}</option>
                                                <option value="restaurant">{t('restaurant').charAt(0).toUpperCase() + t('restaurant').slice(1)}</option>
                                                <option value="hotel">{t('hotel').charAt(0).toUpperCase() + t('hotel').slice(1)}</option>
                                                <option value="electronics">{t('electronics')}</option>
                                                <option value="healthBeauty">{t('healthBeauty')}</option>
                                                <option value="groceries">{t('groceries')}</option>
                                                <option value="spa">{t('spa').charAt(0).toUpperCase() + t('spa').slice(1)}</option>
                                                <option value="fashion">{t('fashion')}</option>
                                                <option value="other">Other Services</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="form-row-modern">
                                        <div className="input-block-labeled">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                className="reg-input-new"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="input-block-labeled">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                className="reg-input-new"
                                                placeholder="Deo"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="input-block-labeled">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className={`reg-input-new ${emailError ? 'error-border' : ''}`}
                                        placeholder="john@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={handleEmailBlur}
                                        required
                                        disabled={isLoading}
                                    />
                                    {emailError && <p className="error-text">{emailError}</p>}
                                </div>

                                <div className="input-block-labeled">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="reg-input-new"
                                        placeholder="07XXXXXXXX"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="input-block-labeled">
                                    <label>Password</label>
                                    <div className="pass-input-wrapper-new">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="reg-input-new"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="pass-toggle-modern"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-block-labeled">
                                    <label>Confirm Password</label>
                                    <div className="pass-input-wrapper-new">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`reg-input-new ${(confirmPassword && password !== confirmPassword) ? 'error-border' : ''}`}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="pass-toggle-modern"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="error-text" style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>Passwords do not match</p>
                                    )}
                                </div>

                                {/* Official Google ReCAPTCHA */}
                                <div className="recaptcha-wrapper-hd">
                                    <ReCAPTCHA
                                        sitekey="6LdXSZ8sAAAAAHbCUl6hOgaxb61rCByVWhMBpYwO"
                                        onChange={(token) => setCaptchaToken(token)}
                                        onExpired={() => setCaptchaToken(null)}
                                    />
                                </div>

                                <div className="terms-check-group">
                                    {role === 'Client' ? (
                                        <div className="check-row-modern">
                                            <input
                                                type="checkbox"
                                                id="helpCheck"
                                                checked={helpManaging}
                                                onChange={(e) => setHelpManaging(e.target.checked)}
                                                disabled={isLoading}
                                            />
                                            <label htmlFor="helpCheck">I need help managing my deals (Design Team Support)</label>
                                        </div>
                                    ) : (
                                        <div className="check-row-modern">
                                            <input
                                                type="checkbox"
                                                id="newsletterCheck"
                                                checked={newsletter}
                                                onChange={(e) => setNewsletter(e.target.checked)}
                                                disabled={isLoading}
                                            />
                                            <label htmlFor="newsletterCheck">Subscribe to our newsletter for best deals and offers.</label>
                                        </div>
                                    )}

                                    <div className="check-row-modern">
                                        <input
                                            type="checkbox"
                                            id="agreeCheck"
                                            required
                                            disabled={isLoading}
                                        />
                                        <label htmlFor="agreeCheck">
                                            I agree to Hodama Deals <Link to="/terms">Terms of Use</Link> and <Link to="/privacy">Privacy Policy</Link>.
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="create-account-btn-major"
                                    disabled={isLoading || (confirmPassword && password !== confirmPassword) || emailError || !captchaToken}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" /> PROCESSING...
                                        </>
                                    ) : (
                                        'CREATE ACCOUNT'
                                    )}
                                </button>
                            </form>

                            <div className="form-footer-modern-alt">
                                <p>
                                    Already have an account? <Link to="/login" className="login-link-bold">Log In</Link>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;


