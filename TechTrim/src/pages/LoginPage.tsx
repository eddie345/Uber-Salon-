import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import RoleCard from '../components/RoleCard';
import ProgressIndicator from '../components/ProgressIndicator';
import TrustIndicator from '../components/TrustIndicator';
import PhoneInput from '../components/PhoneInput';
import PhoneTrustIndicators from '../components/PhoneTrustIndicators';
import OTPInput from '../components/OTPInput';
import { IconScissors, IconChevronRight, IconArrowLeft } from '@tabler/icons-react';

type LoginStep = 1 | 2 | 3 | 4;

export const LoginPage: React.FC = () => {
  const {
    setRole,
    sendOtp,
    verifyOtp,
    completeRegistration,
    selectedRole,
    currentPhone,
    isAuthenticated,
    user
  } = useAuth();

  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>(1);
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Step 2 Form
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Step 3 Form
  const [otpVal, setOtpVal] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Clear OTP error when user starts typing
  const handleOtpChange = (newOtp: string[]) => {
    setOtpVal(newOtp);
    if (otpError) {
      setOtpError('');
    }
  };

  // Step 4 Form
  const [nameInput, setNameInput] = useState('');
  const [shopNameInput, setShopNameInput] = useState('');
  const [cityInput, setCityInput] = useState<'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast'>('Accra');
  const [regError, setRegError] = useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'artisan') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // Enable resend after countdown
  useEffect(() => {
    if (countdown === 0) {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  // Step 1: Select Role
  const handleRoleSubmit = () => {
    if (!selectedRole) return;
    setStep(2);
  };

  // Handle login button click (existing user)
  const handleLoginClick = () => {
    setIsLoginMode(true);
    setStep(2);
  };

  // Handle signup button click (new user)
  const handleSignupClick = () => {
    setIsLoginMode(false);
    setStep(1);
  };

  const stepLabels = ['Role', 'Phone', 'Verify', 'Profile'];

  // Step 2: Submit Phone
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) {
      setPhoneError('Please enter your phone number');
      return;
    }
    // Simple Ghana phone validation (typically 9 digits after prefix, e.g. 24XXXXXXX)
    if (phoneInput.length < 9 || phoneInput.length > 10) {
      setPhoneError('Please enter a valid Ghana phone number');
      return;
    }
    setPhoneError('');

    const formattedPhone = phoneInput.startsWith('0') ? phoneInput.substring(1) : phoneInput;
    const fullPhone = `0${formattedPhone}`;

    setIsLoading(true);
    await sendOtp(fullPhone);
    setIsLoading(false);
    setStep(3);
    setCountdown(30);
    setOtpVal(Array(6).fill(''));
  };

  // Validate phone number in real-time
  useEffect(() => {
    const cleaned = phoneInput.replace(/\D/g, '');
    setIsPhoneValid(cleaned.length >= 9 && cleaned.length <= 10);
  }, [phoneInput]);

  // Step 3: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpVal.join('');
    if (fullOtp.length < 6) {
      setOtpError('Please enter the full 6-digit code');
      return;
    }

    setOtpError('');
    setIsLoading(true);
    const res = await verifyOtp(fullOtp);
    setIsLoading(false);
    
    if (res.success) {
      if (res.isNew) {
        setStep(4);
      } else {
        // Handled by useEffect redirect
      }
    } else {
      setOtpError('Incorrect code. Use 123456 to log in.');
    }
  };

  // Step 4: Complete Registration
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setRegError('Please enter your name');
      return;
    }
    if (selectedRole === 'artisan' && !shopNameInput.trim()) {
      setRegError('Please enter your shop name');
      return;
    }
    setRegError('');

    setIsLoading(true);
    completeRegistration(nameInput, cityInput, selectedRole === 'artisan' ? shopNameInput : undefined);
    setIsLoading(false);
    // Redirect handled by useEffect
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResendDisabled) return;
    
    // Limit resend attempts (max 3)
    if (resendAttempts >= 3) {
      setOtpError('Maximum resend attempts reached. Please try again later.');
      return;
    }

    setIsResendDisabled(true);
    setResendAttempts(prev => prev + 1);
    setIsLoading(true);
    
    await sendOtp(currentPhone);
    
    setIsLoading(false);
    setCountdown(30);
    setOtpVal(Array(6).fill(''));
    setOtpError('');
    
    alert('Mock OTP resent to ' + currentPhone + '. Use 123456.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 md:py-12 bg-gradient-to-br from-[#FAFAFA] to-[#F0F9F4]">
      <div className="w-full max-w-[480px]">
        {/* Enhanced Logo & Hero Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-gradient-to-br from-primary to-[#005230] text-white p-4 rounded-2xl flex items-center justify-center shadow-xl mb-4">
            <IconScissors className="w-10 h-10" />
          </div>
          <h1 className="text-[32px] md:text-[36px] font-heading font-extrabold text-primary tracking-tight mb-2">
            TrimConnect<span className="text-accent">GH</span>
          </h1>
          <p className="text-[16px] md:text-[17px] text-muted font-sans font-medium max-w-[320px] leading-relaxed">
            Book trusted barbers & hair dressers across Ghana in seconds
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={step} totalSteps={4} stepLabels={stepLabels} />

        <Card className="w-full p-6 md:p-8">
          {/* Back Buttons for navigation inside the flow */}
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep((prev) => (prev - 1) as LoginStep)}
              className="flex items-center gap-1.5 text-muted hover:text-dark text-[13px] font-bold mb-6 transition"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div>
              <h2 className="text-[24px] font-heading font-bold text-dark mb-2">
                How will you use TrimConnect?
              </h2>
              <p className="text-[15px] text-muted mb-6 leading-relaxed">
                Choose your role to get started with the right experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <RoleCard
                  role="customer"
                  selected={selectedRole === 'customer'}
                  onClick={() => setRole('customer')}
                />
                <RoleCard
                  role="artisan"
                  selected={selectedRole === 'artisan'}
                  onClick={() => setRole('artisan')}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                disabled={!selectedRole}
                onClick={handleRoleSubmit}
              >
                <span>Continue</span>
                <IconChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP 2: PHONE NUMBER ENTRY */}
          {step === 2 && (
            <form onSubmit={handlePhoneSubmit}>
              <h2 className="text-[24px] font-heading font-bold text-dark mb-2">
                {isLoginMode ? 'Log in to your account' : 'Enter your phone number'}
              </h2>
              <p className="text-[15px] text-muted mb-6 leading-relaxed">
                {isLoginMode 
                  ? 'Enter your phone number to access your account'
                  : "We'll send a secure 6-digit verification code to your phone."
                }
              </p>

              <PhoneInput
                value={phoneInput}
                onChange={setPhoneInput}
                error={phoneError}
                disabled={isLoading}
              />

              <PhoneTrustIndicators />

              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={isLoading}
                disabled={!isPhoneValid}
                className="mt-6"
              >
                {isLoading ? 'Sending...' : (isLoginMode ? 'Send Verification Code' : 'Send Verification Code')}
              </Button>

              <p className="text-[12px] text-muted text-center mt-4">
                Demo: <span className="font-bold">0501112222</span> (Customer) or <span className="font-bold">0201112222</span> (Artisan)
              </p>

              {/* Switch between login/signup */}
              <p className="text-center mt-4 text-[14px] text-muted">
                {isLoginMode ? (
                  <>
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={handleSignupClick}
                      className="text-primary font-bold hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={handleLoginClick}
                      className="text-primary font-bold hover:underline"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="text-[24px] font-heading font-bold text-dark mb-2">
                Enter verification code
              </h2>
              <p className="text-[15px] text-muted mb-6 leading-relaxed">
                Sent to <span className="font-bold text-dark">+233 {currentPhone.substring(1)}</span>
              </p>

              <OTPInput
                value={otpVal}
                onChange={handleOtpChange}
                error={otpError}
                disabled={isLoading}
              />

              {otpError && (
                <div className="bg-red-50 text-danger p-3 rounded-lg border border-red-100 text-[13px] font-semibold mb-4 text-center">
                  {otpError}
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth loading={isLoading}>
                Verify & Continue
              </Button>

              <div className="text-center mt-6 text-[14px]">
                {countdown > 0 ? (
                  <span className="text-muted">
                    Resend in <span className="font-bold text-dark">{countdown}s</span>
                    {resendAttempts > 0 && ` (${3 - resendAttempts} attempts left)`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled || resendAttempts >= 3}
                    className="text-primary font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendAttempts >= 3 ? 'Maximum attempts reached' : 'Resend Code'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 4: REGISTRATION */}
          {step === 4 && (
            <form onSubmit={handleRegistration}>
              <h2 className="text-[24px] font-heading font-bold text-dark mb-2">
                Complete your profile
              </h2>
              <p className="text-[15px] text-muted mb-6 leading-relaxed">
                Welcome to TrimConnect! Let's set up your account
              </p>

              {regError && (
                <div className="bg-red-50 text-danger p-3 rounded-lg border border-red-100 text-[13px] font-semibold mb-4 text-center">
                  {regError}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="Ama Kofi"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />

              {selectedRole === 'artisan' && (
                <>
                  <Input
                    label="Shop Name"
                    type="text"
                    placeholder="Classic Hair Cuts"
                    value={shopNameInput}
                    onChange={(e) => setShopNameInput(e.target.value)}
                  />

                  <div className="w-full flex flex-col mb-6">
                    <label className="text-[14px] font-semibold text-dark mb-1.5 font-sans">
                      Select Location / City
                    </label>
                    <select
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value as any)}
                      className="w-full h-[52px] rounded-[10px] border-[1.5px] border-[#E0E0E0] bg-white text-dark text-[15px] px-4 font-sans focus:outline-none focus:border-primary focus:shadow-sm transition"
                    >
                      <option value="Accra">Accra</option>
                      <option value="Kumasi">Kumasi</option>
                      <option value="Takoradi">Takoradi</option>
                      <option value="Tamale">Tamale</option>
                      <option value="Cape Coast">Cape Coast</option>
                    </select>
                  </div>
                </>
              )}

              <Button type="submit" variant="primary" fullWidth loading={isLoading} className="mt-2">
                Get Started
              </Button>
            </form>
          )}
        </Card>

        {/* Trust & Credibility Section - Only show on step 1 */}
        {step === 1 && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            <TrustIndicator
              icon="verified"
              title="Verified Artisans"
              description="All professionals are vetted"
            />
            <TrustIndicator
              icon="secure"
              title="Secure Bookings"
              description="Your data is protected"
            />
            <TrustIndicator
              icon="fast"
              title="Fast Appointments"
              description="Book in under 2 minutes"
            />
            <TrustIndicator
              icon="nationwide"
              title="Nationwide Coverage"
              description="Available across Ghana"
            />
          </div>
        )}

        {/* Login Link - Only show on step 1 */}
        {step === 1 && (
          <p className="text-center mt-6 text-[14px] text-muted">
            Already have an account?{' '}
            <button 
              onClick={handleLoginClick}
              className="text-primary font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
