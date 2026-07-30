import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-darker flex">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden border-r border-gray-800">
        {/* Subtle background particles effect placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-50"></div>
          <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-40"></div>
          <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-60"></div>
          <div className="absolute top-3/4 left-3/4 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-10 bg-gray-900/50 w-fit px-4 py-2 rounded-full border border-gray-800 backdrop-blur-sm">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 border border-gray-900"></div>
              <div className="w-6 h-6 rounded-full bg-blue-500 border border-gray-900"></div>
            </div>
            <span className="text-xs text-gray-300">Join 50K+ users</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            The <span className="text-emerald-500">Knowledge</span> Starship
          </h1>
          
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Experience the "Quiet Expert." SOAKINGARRI AI processes complex datasets into refined, actionable insights with unprecedented speed and accuracy. Perfect for advance learning.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="mt-1 bg-emerald-500/20 p-1 rounded">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Advanced Reasoning</h3>
                <p className="text-emerald-500/80 text-sm mt-1">Deep neural architectures designed for high-stakes decision making.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="mt-1 bg-emerald-500/20 p-1 rounded">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Enterprise Security</h3>
                <p className="text-emerald-500/80 text-sm mt-1">End-to-end encryption with obsidian-grade privacy standards.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="mt-1 bg-emerald-500/20 p-1 rounded">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Liquid Latency</h3>
                <p className="text-emerald-500/80 text-sm mt-1">Instant response times for seamless human-AI collaboration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative auth-bg overflow-hidden">
        {/* Decorative elements behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
