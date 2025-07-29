"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// Extract SVG components to prevent recreation on each render
const BackIcon = () => (
  <svg 
    className="w-6 h-6 -ml-2"
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.25 8.75L9.75 12L13.25 15.25" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Logo = () => (
  <svg 
    className="inline-block w-12" 
    fill="none" 
    viewBox="0 0 78 78" 
    width="40" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="76" height="76" rx="21" stroke="#FDFDFD" strokeOpacity="0.1" strokeWidth="2" />
    <path d="M43.0184 21C49.9908 21 54.1374 25.1467 54.1374 30.6513C54.1374 36.1558 49.9908 40.3025 43.0184 40.3025H39.4953L57 57H44.6329L31.3118 44.3394C30.3578 43.4587 29.9174 42.4312 29.9174 41.5506C29.9174 40.3029 30.7984 39.202 32.4864 38.7249L39.3485 36.8897C41.954 36.1925 43.7522 34.1741 43.7522 31.5319C43.7522 28.3027 41.1098 26.4312 37.8438 26.4312H21V21H43.0184Z" fill="url(#paint0_linear_1382_599)" />
    <path d="M54.1375 30.6513C54.1374 25.1467 49.9908 21 43.0184 21V20.55C46.5934 20.55 49.4879 21.6142 51.4941 23.4275C53.4405 25.1867 54.5189 27.6229 54.5844 30.3832L54.5875 30.6513C54.5875 33.5218 53.5032 36.0591 51.4941 37.875C49.5505 39.6317 46.7734 40.6853 43.3515 40.7495L43.0184 40.7525H40.619L58.1237 57.45H44.4532L44.3231 57.3261L31.0064 44.6694C29.978 43.7199 29.4675 42.579 29.4674 41.5506C29.4674 40.0491 30.5379 38.8082 32.3643 38.292L32.37 38.2903L39.2321 36.4551C41.6742 35.8016 43.3023 33.9377 43.3023 31.5319C43.3023 30.0523 42.7022 28.9051 41.7383 28.1191C40.7652 27.3258 39.3949 26.8812 37.8438 26.8812H20.55V20.55H43.0184V21H21V26.4312H37.8438C41.1098 26.4312 43.7522 28.3027 43.7523 31.5319C43.7523 34.1741 41.954 36.1925 39.3485 36.8897L32.4865 38.7249C30.7984 39.202 29.9174 40.3029 29.9174 41.5506C29.9175 42.4312 30.3578 43.4587 31.3118 44.3393L44.633 57H57.0001L39.4953 40.3025H43.0184C49.9909 40.3025 54.1375 36.1558 54.1375 30.6513Z" fill="url(#paint1_linear_1382_599)" />
    <defs>
      <linearGradient id="paint0_linear_1382_599" x1="39" y1="21" x2="58.1887" y2="56.4242" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#ADADAD" />
      </linearGradient>
      <linearGradient id="paint1_linear_1382_599" x1="39.3369" y1="20.55" x2="58.8097" y2="57.1549" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#ADADAD" />
      </linearGradient>
    </defs>
  </svg>
);

// Extract repeated class strings to constants
const CONTAINER_CLASSES = "min-h-screen bg-black overflow-x-auto overflow-y-auto flex items-center justify-center px-4";
const BACK_BUTTON_CLASSES = "absolute top-6 left-6 z-10 flex items-center gap-0 h-10 px-5 border border-white/5 rounded-2xl text-sm font-semibold text-gray-400 transition-colors duration-200 hover:text-white user-select-none";
const MAIN_CLASSES = "relative z-10 w-full max-w-lg pt-8";
const BUTTON_CLASSES = "w-full h-12 px-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md text-white font-semibold text-sm transition-all duration-200 hover:from-white/10 hover:to-white/[0.04] hover:border-white/10";
const TITLE_CLASSES = "text-2xl font-semibold text-white mb-6 font-['ABCFavorit',ui-sans-serif,system-ui,sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji'] tracking-tight";
const INPUT_CLASSES = "relative px-4 w-full h-12 text-sm leading-5 focus:outline-gray-950 text-white cursor-textbackdrop-blur-[25px] bg-origin-border rounded-2xl border-solid ease-in-out outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]";

// Memoized success screen component
const SuccessScreen = ({ username, userEmail }: { username: string; userEmail?: string }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Send email automatically when component mounts
  useEffect(() => {
    const sendVerificationEmail = async () => {
      try {
        // Replace '/api/send-verification-email' with your actual API endpoint
        const response = await axios.post('/api/send-verification-email', {
          email: userEmail,
        });
        if (response.status === 200) {
          setEmailSent(true);
          console.log('Verification email sent successfully');
        }
      } catch (error) {
        console.error('Error sending verification email:', error);
        setEmailError('Failed to send verification email. Please try again.');
      }
    };

    sendVerificationEmail();
  }, [username, userEmail]);

  return (
    <div className={CONTAINER_CLASSES}>
      {/* Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image 
          src="/bgImg/background-auth.png"
          alt="Background"
          fill
          className="object-cover pointer-events-none"
          style={{ userSelect: 'none' }}
          priority
          quality={90}
        />
      </div>

      {/* Back to Home Link */}
      <Link 
        href="/"
        className={BACK_BUTTON_CLASSES}
      >
        <BackIcon />
        <span>Home</span>
      </Link>

      <main className={MAIN_CLASSES}>
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="inline-block w-12 mb-6">
            <Logo />
          </div>

          <h1 className={TITLE_CLASSES}>
            Welcome, {username}!
          </h1>

          <div className="space-y-4 text-gray-400">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckIcon />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white mb-4">
              Check your email
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              {emailSent 
                ? "We've sent a verification link to your email address. Please click the link to verify your account and complete the setup process."
                : emailError 
                  ? emailError
                  : "Sending verification email..."
              }
            </p>

            <div className="mt-8 p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md">
              <div className="flex items-center justify-center gap-3">
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">Didn't receive the email?</p>
                  <p>Check your spam folder or contact support if you need assistance.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/auth/sign-in"
              className={`inline-flex items-center justify-center ${BUTTON_CLASSES}`}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Add email state if needed
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Memoize the form submit handler
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      setIsSubmitted(true);
    }
  }, [username]);

  // Memoize the input change handler
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  // Add email change handler if you want to collect email
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  }, []);

  // Memoize the trimmed username check
  const isUsernameValid = useMemo(() => username.trim().length > 0, [username]);

  // Memoize the button disabled classes
  const buttonClasses = useMemo(() => 
    `${BUTTON_CLASSES} ${!isUsernameValid ? 'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:from-white/5 disabled:hover:to-white/[0.02] disabled:hover:border-white/5' : ''}`
  , [isUsernameValid]);

  // Early return for success screen
  if (isSubmitted) {
    return <SuccessScreen username={username} userEmail={userEmail} />;
  }

  return (
    <div className={CONTAINER_CLASSES}>
      {/* Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image 
          src="/bgImg/background-auth.png"
          alt="Background"
          fill
          className="object-cover pointer-events-none"
          style={{ userSelect: 'none' }}
          priority
          quality={90}
        />
      </div>

      {/* Back to Home Link */}
      <Link 
        href="/"
        className={BACK_BUTTON_CLASSES}
      >
        <BackIcon />
        <span>Home</span>
      </Link>

      <main className={MAIN_CLASSES}>
        <div className="text-center mb-6">
          {/* Logo placeholder */}
          <div className="inline-block w-12 mb-6" />

          <h1 className={TITLE_CLASSES}>
            Complete your setup
          </h1>

          <span className="text-gray-400 text-sm">
            Choose your username to get started
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm text-gray-400">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="johndoe"
              required
              className={INPUT_CLASSES}
            />
          </div>

          {/* Optional: Add email field if you want to collect it */}
          {/*
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={userEmail}
              onChange={handleEmailChange}
              placeholder="john@example.com"
              required
              className={INPUT_CLASSES}
            />
          </div>
          */}

          <button
            type="submit"
            disabled={!isUsernameValid}
            className={buttonClasses}
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          <span>By continuing, you agree to our </span>
          <a href="#" className="underline hover:text-gray-300 transition-colors">
            Terms
          </a>
          <span> and </span>
          <a href="#" className="underline hover:text-gray-300 transition-colors">
            Privacy Policy
          </a>
          <span>.</span>
        </p>
      </main>
    </div>
  );
}