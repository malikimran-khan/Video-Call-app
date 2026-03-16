import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20 shadow-lg shadow-primary-500/5' 
        : 'text-dark-muted hover:bg-dark-card hover:text-white border border-transparent'}
    `}
  >
    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
    <span className="font-medium">{label}</span>
    <ChevronRight className={`ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0`} />
  </NavLink>
);

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-dark-border bg-dark-bg/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary-500">Panel</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/users" icon={Users} label="User Management" />
          <SidebarItem to="/groups" icon={Users} label="Groups" />
          <SidebarItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-dark-border mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300 group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-dark-border bg-dark-bg/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-dark-card rounded-lg transition-colors border border-dark-border"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-dark-card border border-dark-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-dark-card rounded-lg transition-colors border border-dark-border group">
              <Bell className="w-5 h-5 text-dark-muted group-hover:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-bg"></span>
            </button>
            <div className="h-8 w-[1px] bg-dark-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Imran Khan</p>
                <p className="text-xs text-dark-muted">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 p-[1px]">
                <div className="w-full h-full rounded-[11px] bg-dark-bg flex items-center justify-center overflow-hidden">
                   <img src="https://ui-avatars.com/api/?name=Imran+Khan&background=random" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-dark-bg border-r border-dark-border z-50 p-6 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                    <LayoutDashboard className="text-white w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary-500">Panel</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-dark-card rounded-lg transition-colors border border-dark-border">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarItem to="/users" icon={Users} label="User Management" />
                <SidebarItem to="/settings" icon={Settings} label="Settings" />
              </nav>

              <div className="pt-6 border-t border-dark-border mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300 group">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
