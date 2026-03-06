import React, { useState } from 'react';
import { usePortfolioStore } from '../store';
import { Edit2, DollarSign, X, User as UserIcon, Mail, Lock, LogOut } from 'lucide-react';

const PieChartGraphic = () => (
  <div className="relative w-24 h-24 flex-shrink-0">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Top Right - Teal */}
      <path d="M50 50 L50 5 A45 45 0 0 1 95 50 Z" fill="#48b8a6" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      {/* Bottom Right - Dark Blue */}
      <path d="M50 50 L95 50 A45 45 0 0 1 50 95 Z" fill="#0f2b46" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      {/* Bottom Left - White */}
      <path d="M50 50 L50 95 A45 45 0 0 1 5 50 Z" fill="#ffffff" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      {/* Top Left - White */}
      <path d="M50 50 L5 50 A45 45 0 0 1 50 5 Z" fill="#ffffff" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      {/* Center Hole */}
      <circle cx="50" cy="50" r="15" fill="#000" />
    </svg>
    {/* Checkmarks */}
    <div className="absolute top-2 -right-2 w-4 h-4 bg-[#48b8a6] rounded-full flex items-center justify-center border-2 border-black">
      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#48b8a6] rounded-full flex items-center justify-center border-2 border-black">
      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
  </div>
);

export function Profile() {
  const { items, getTotalValue, user, setUser } = usePortfolioStore();
  const totalValue = getTotalValue();
  const [activeTab, setActiveTab] = useState('Stats');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Mock authentication
    setUser({
      id: Math.random().toString(36).substring(2, 9),
      email,
      name: isLogin ? email.split('@')[0] : name || email.split('@')[0],
    });
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans">
      {/* Top Bar */}
      <div className="flex justify-end p-4">
        <button className="flex items-center gap-1.5 bg-transparent px-3 py-1.5 rounded-full text-sm font-medium">
          <div className="w-5 h-5 bg-[#48b8a6] rounded-full flex items-center justify-center text-black">
            <DollarSign className="w-3 h-3" />
          </div>
          USD
        </button>
      </div>

      <div className="px-4 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#48b8a6] rounded-full flex items-center justify-center text-5xl text-white font-light border-2 border-transparent">
              {user ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <span className="text-[#48b8a6] text-xs mt-1 font-medium cursor-pointer">Edit</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{user ? user.name : 'Anonymous...'}</h1>
              <div className="flex items-center gap-1 text-zinc-400 text-sm">
                <span>©</span>
                <span className="text-[#48b8a6]">
                  {user ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : '@yk3kcz'}
                </span>
                <Edit2 className="w-3 h-3 text-[#48b8a6] cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          <div>
            <div className="text-zinc-300 text-xs mb-1">Total Cards</div>
            <div className="text-[#48b8a6] font-medium">{items.length}</div>
          </div>
          <div>
            <div className="text-zinc-300 text-xs mb-1">Total Sealed</div>
            <div className="text-[#48b8a6] font-medium">0</div>
          </div>
          <div>
            <div className="text-zinc-300 text-xs mb-1">Total Graded</div>
            <div className="text-[#48b8a6] font-medium">0</div>
          </div>
          <div>
            <div className="text-zinc-300 text-xs mb-1">Total Value</div>
            <div className="text-[#48b8a6] font-medium">${totalValue.toFixed(2)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-transparent border border-zinc-700 rounded-full py-2 text-sm font-medium hover:bg-zinc-900 transition-colors">
            View Social Profile
          </button>
          <button className="bg-transparent border border-zinc-700 rounded-full py-2 text-sm font-medium hover:bg-zinc-900 transition-colors">
            Edit Background
          </button>
        </div>

        {/* Login/Register or Sign Out */}
        {!user ? (
          <button 
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-[#48b8a6] text-black font-semibold rounded-full py-3 mb-6 hover:bg-[#3da392] transition-colors"
          >
            Login or Register
          </button>
        ) : (
          <button 
            onClick={handleSignOut}
            className="w-full bg-zinc-900 text-red-400 font-semibold rounded-full py-3 mb-6 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}

        {/* Tabs */}
        <div className="flex bg-zinc-900 rounded-full p-1 mb-6">
          {['Stats', 'Settings', 'Support'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab ? 'bg-zinc-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Stats' && (
          <>
            {/* Portfolio: Main */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">
                Portfolio: <span className="text-[#48b8a6]">Main</span>
              </h2>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-zinc-300 text-sm mb-1">Cards</div>
                    <div className="text-[#48b8a6] font-medium">{items.length}</div>
                  </div>
                  <div>
                    <div className="text-zinc-300 text-sm mb-1">Sealed</div>
                    <div className="text-[#48b8a6] font-medium">0</div>
                  </div>
                  <div>
                    <div className="text-zinc-300 text-sm mb-1">Graded</div>
                    <div className="text-[#48b8a6] font-medium">0</div>
                  </div>
                  <div>
                    <div className="text-zinc-300 text-sm mb-1">Value</div>
                    <div className="text-[#48b8a6] font-medium">${totalValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Performance */}
            <div>
              <h2 className="text-lg font-bold mb-3">Your Performance</h2>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <div className="flex gap-4 mb-6">
                  <PieChartGraphic />
                  <div className="flex-1 text-sm text-zinc-300 leading-relaxed">
                    Collectr helps you track the performance of your products by displaying current value and returns. To begin, simply go into any product within your Portfolio and tap on the "Price Paid" text and enter what you paid - easy!
                  </div>
                </div>
                <button className="w-full bg-transparent border border-zinc-700 rounded-full py-3 text-sm font-medium hover:bg-zinc-900 transition-colors">
                  View Transaction Logs
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-800">
                  <UserIcon className="w-6 h-6 text-[#48b8a6]" />
                </div>
                <h2 className="text-xl font-bold text-zinc-100">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {isLogin ? 'Sign in to sync your collection' : 'Sign up to start tracking your cards'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1 ml-1">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-zinc-500" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#48b8a6] transition-colors"
                        placeholder="Ash Ketchum"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#48b8a6] transition-colors"
                      placeholder="ash@pallet-town.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#48b8a6] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#48b8a6] hover:bg-[#3da392] text-black font-bold py-3 px-4 rounded-xl transition-colors mt-6"
                >
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-zinc-400 hover:text-[#48b8a6] transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
