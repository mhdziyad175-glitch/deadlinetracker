/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Bell, Search, PlusCircle } from 'lucide-react';
import { UserProfile } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  user: UserProfile | null;
  onAddClick: () => void;
}

export function Navbar({ user, onAddClick }: NavbarProps) {
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40",
      "h-20 glass-card border-none border-b border-white/5",
      "flex items-center justify-between px-6 md:px-12 backdrop-blur-2xl"
    )}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center luxury-shadow">
          <PlusCircle className="text-white rotate-45" size={24} />
        </div>
        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
          Deadline Tracker
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onAddClick}
          className="bg-white text-slate-950 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-slate-200 transition-all active:scale-95 sm:flex hidden items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Task
        </button>
        
        <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 group relative">
              <div className="flex flex-col items-end mr-1 hidden sm:flex">
                <span className="text-sm font-semibold text-white leading-none mb-1">{user.displayName}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Premium Student</span>
              </div>
              <button 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-brand-primary/50 transition-all"
                title="Profile"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-full h-full p-2 text-slate-400" />
                )}
              </button>
              
              {/* Simple dropdown simulation on hover/click would go here */}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <User size={20} className="text-slate-500" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
