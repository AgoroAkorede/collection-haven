import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, Store, Users, BookOpen, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-black text-zinc-50 font-sans">
      <main className="flex-1 overflow-y-auto pb-20 hide-scrollbar">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-950 border-t border-zinc-900 pb-safe z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Home" />
          <NavItem to="/search" icon={<Search className="w-5 h-5" />} label="Search" />
          <NavItem to="/shop" icon={<Store className="w-5 h-5" />} label="Shop" />
          <NavItem to="/social" icon={<Users className="w-5 h-5" />} label="Social" />
          <NavItem to="/portfolio" icon={<BookOpen className="w-5 h-5" />} label="Portfolio" />
          <NavItem to="/profile" icon={<User className="w-5 h-5" />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center px-2 py-1 rounded-xl space-y-1 text-[10px] font-medium transition-colors',
          isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-500 hover:text-zinc-300'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
