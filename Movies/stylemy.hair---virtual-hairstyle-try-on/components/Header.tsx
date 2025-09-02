
import React, { useState } from 'react';
import { HeartIcon, SparklesIcon } from './icons';
import { supabase } from '../supabaseClient';
// The Session type is not always available from the CDN, so we'll use 'any'.
// import type { Session } from '@supabase/supabase-js';

const NavItem = ({ children, active = false, icon, comingSoon = false }: { children: React.ReactNode, active?: boolean, icon: React.ReactNode, comingSoon?: boolean }) => (
  <div className="relative">
    <button
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        active
          ? 'text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
      }`}
      disabled={comingSoon}
    >
      {icon}
      <span>{children}</span>
    </button>
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"></div>}
    {comingSoon && <span className="absolute -top-1 -right-2 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">SOON</span>}
  </div>
);

async function signInWithGoogle() {
  // Supabase v2 API for OAuth sign-in.
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) {
    console.error('Error signing in with Google:', error);
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
}

// Using `any` for session type as a workaround for CDN import issues.
const UserMenu = ({ session }: { session: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const userAvatar = session.user?.user_metadata?.avatar_url;
    const userName = session.user?.user_metadata?.full_name || 'User';

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500">
                {userAvatar ? <img src={userAvatar} alt={userName} className="w-full h-full rounded-full" /> : <span className="font-bold">{userName.charAt(0)}</span>}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}


// Using `any` for session type as a workaround for CDN import issues.
export default function Header({ session }: { session: any | null }) {
  const [activeTab, setActiveTab] = useState('Preset Styles');
  
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold tracking-tighter text-white">
              stylemy<span className="text-purple-400">.hair</span>
            </h1>
            <p className="hidden md:block text-sm text-gray-400 border-l border-gray-600 pl-4">
              Your Salon-Grade Virtual Hairstyle Try-On
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2 bg-gray-800/50 p-1 rounded-lg">
              <NavItem active={activeTab === 'Virtual Mirror'} icon={<HeartIcon />} comingSoon>
                Virtual Mirror
              </NavItem>
              <NavItem active={activeTab === 'Preset Styles'} icon={<SparklesIcon />}>
                Preset Styles
              </NavItem>
               <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 text-gray-400 hover:text-white relative bg-gray-700/60">
                  <SparklesIcon className="text-yellow-400"/>
                  <span>AI Style Generator</span>
                  <span className="absolute -top-2 -right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">Custom Prompts</span>
              </button>
            </nav>
             <div className="w-px h-8 bg-gray-700 mx-2 hidden md:block"></div>
            {session ? <UserMenu session={session} /> : (
                 <button onClick={signInWithGoogle} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white">
                    <span>Sign in with Google</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
