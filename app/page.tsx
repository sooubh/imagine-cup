'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SIMULATED_USERS, UserSection, UserProfile } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  // Real-time email validation
  const validateEmail = (value: string) => {
    setEmail(value);
    if (!value) {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
    } else if (selectedUser && value !== selectedUser.email) {
      setEmailError('Email does not match the selected user');
    } else {
      setEmailError('');
    }
  };

  // Real-time password validation
  const validatePassword = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSectionClick = (user: UserProfile) => {
    setSelectedUser(user);
    // Prefill credentials
    setEmail(user.email);
    setPassword('password123');
    setEmailError('');
    setPasswordError('');
    setShowLoginModal(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (!email || !password || emailError || passwordError) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    if (selectedUser && email !== selectedUser.email) {
      setEmailError('Email does not match');
      return;
    }

    setLoading(true);
    // Set cookie for server-side access
    document.cookie = `simulated_user_id=${selectedUser?.id}; path=/; max-age=86400`;

    // Simulate network delay
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 800);
  };

  const handleCleanupDatabase = async () => {
    if (!confirm('⚠️ This will DELETE all unused database containers. This action cannot be undone. Continue?')) {
      return;
    }

    setCleanupLoading(true);
    try {
      const { cleanupDatabaseContainers } = await import('@/app/actions/cleanupDatabase');
      const result = await cleanupDatabaseContainers();

      if (result.success) {
        alert(`✅ ${result.message}\n\nDeleted containers:\n${result.deleted.join('\n')}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      alert(`❌ Cleanup failed: ${error}`);
    } finally {
      setCleanupLoading(false);
    }
  };

  const sections: { id: UserSection; name: string; color: string; icon: string }[] = [
    { id: 'FDC', name: 'Food Distribution Center', color: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200', icon: '🏪' },
    { id: 'Hospital', name: 'Hospital Section', color: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200', icon: '🏥' },
    { id: 'NGO', name: 'NGO Section', color: 'from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 border-teal-200', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-teal-200/30 to-blue-200/30 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '50%', right: '20%' }}
        />
      </div>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <motion.h1
            className="text-6xl font-black text-gray-900 tracking-tight mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {"StockHealth AI".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 120
                }}
                style={{ display: 'inline-block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Welcome back! Select your section to continue
          </motion.p>
        </motion.div>

        {/* Section Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
          {sections.map((section, index) => {
            const sectionUsers = SIMULATED_USERS.filter(u => u.section === section.id);
            const adminUser = sectionUsers.find(u => u.role === 'admin');
            const retailers = sectionUsers.filter(u => u.role === 'retailer');

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className={`bg-gradient-to-br ${section.color} border-2 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <motion.div
                  className="text-center mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-5xl mb-3">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.name}</h2>
                  <p className="text-sm text-gray-600">Select your role below</p>
                </motion.div>

                <div className="space-y-3">
                  {/* Admin Button */}
                  {adminUser && (
                    <motion.button
                      onClick={() => handleSectionClick(adminUser)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <span className="material-symbols-outlined text-lg">shield</span>
                          </motion.div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">Admin</div>
                            <div className="text-xs text-gray-600">{adminUser.name}</div>
                          </div>
                        </div>
                        <motion.span
                          className="material-symbols-outlined text-gray-400 group-hover:text-gray-600"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          arrow_forward
                        </motion.span>
                      </div>
                    </motion.button>
                  )}

                  {/* Retailer Buttons */}
                  {retailers.map((user, userIndex) => (
                    <motion.button
                      key={user.id}
                      onClick={() => handleSectionClick(user)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + userIndex * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {user.name.charAt(0)}
                          </motion.div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                            <div className="text-xs text-gray-600">Retailer</div>
                          </div>
                        </div>
                        <motion.span
                          className="material-symbols-outlined text-gray-400 group-hover:text-gray-600"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          arrow_forward
                        </motion.span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button
            onClick={handleCleanupDatabase}
            disabled={cleanupLoading}
            className="px-6 py-2 rounded-lg bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {cleanupLoading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Cleaning Database...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Cleanup Unused Containers
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs font-medium">
            © 2025 StockHealth AI • Imagine Cup Prototype
          </p>
        </motion.div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && selectedUser && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-600 text-lg">close</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                  <p className="text-sm text-gray-600">{selectedUser.name} • {selectedUser.section}</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <motion.input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${emailError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        } focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400`}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-600 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">error</span>
                        {emailError}
                      </motion.p>
                    )}
                    {!emailError && email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-green-600 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Email is valid
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <motion.input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => validatePassword(e.target.value)}
                      whileFocus={{ scale: 1.02 }}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        } focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-red-600 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">error</span>
                        {passwordError}
                      </motion.p>
                    )}
                    {!passwordError && password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-green-600 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Password is valid
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Login Hint */}
                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-xl p-3"
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Hint:</span> Credentials are prefilled for quick login!
                    </p>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !!emailError || !!passwordError || !email || !password}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          className="material-symbols-outlined"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          progress_activity
                        </motion.span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <motion.span
                          className="material-symbols-outlined"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          arrow_forward
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
