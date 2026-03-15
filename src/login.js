import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, RefreshCw, GraduationCap, KeyRound, AlertCircle } from 'lucide-react';

function Login() {
  const [emailid, setEmailid] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailid || !pwd) {
      setError('Please enter both email and password');
      return;
    }

    if (captchaInput !== captcha) {
      setError('Invalid captcha. Please try again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login/signin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailid, pwd })
      });

      const data = await response.json();

      if (data.success) {
        // Store session data
        sessionStorage.setItem("sid", emailid);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("token", data.token);

        if (data.studentId) sessionStorage.setItem("studentId", data.studentId);
        if (data.facultyId) sessionStorage.setItem("facultyId", data.facultyId);

        // Check if first login or profile incomplete
        // Only redirect to profile setup if explicitly needed
        const needsProfileSetup = (data.isFirstLogin === true) || (data.profileComplete === false);

        if (needsProfileSetup && data.role !== 'admin') {
          // Redirect to profile completion based on role
          if (data.role === 'student') {
            navigate('/student-profile-setup');
          } else if (data.role === 'faculty') {
            navigate('/faculty-profile-setup');
          }
        } else {
          // Regular login - redirect to dashboard
          switch (data.role) {
            case 'student':
              navigate('/studenthome');
              break;
            case 'faculty':
              navigate('/facultyhome');
              break;
            case 'admin':
              navigate('/adminhome');
              break;
            default:
              navigate('/studenthome');
          }
        }
      } else {
        setError(data.message || 'Invalid email or password');
        generateCaptcha();
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Hero / Branding */}
        <div className="md:w-1/2 bg-blue-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e021fc624519?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] opacity-10 bg-cover bg-center"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">University Portal</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Welcome to the Course Management System
            </h2>
            <p className="text-blue-100 text-lg opacity-90">
              Streamline your academic journey with our centralized platform for students, faculty, and administrators.
            </p>
          </div>

          <div className="relative z-10 text-sm text-blue-200 mt-12">
            &copy; 2024 University Management System
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={emailid}
                  onChange={(e) => setEmailid(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your university email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgotpassword" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                  <KeyRound className="w-3 h-3 mr-1" />
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Captcha Section */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Verification</label>
              <div className="flex gap-3 mb-3">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-3">
                  <span className="text-xl font-mono font-bold tracking-widest text-gray-800 select-none decoration-wavy">
                    {captcha}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                placeholder="Type the characters above"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;