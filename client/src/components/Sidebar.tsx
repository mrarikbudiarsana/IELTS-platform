import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  BookA,
  Globe,
  MessageSquare,
  Sparkles,
  ChevronUp,
  ChevronDown,
  LogOut,
  User,
  Shield,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Menu,
  ChevronRight,
  ExternalLink,
  Layers,
  Award,
  FileEdit,
  Users
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  currentView: string;
  activeSkill?: 'reading' | 'listening' | 'writing' | 'speaking';
  activeCategoryFilter?: 'all' | 'mock' | 'practice';
  onNavigate: (
    view: string,
    skill?: 'reading' | 'listening' | 'writing' | 'speaking',
    category?: 'all' | 'mock' | 'practice'
  ) => void;
  onOpenLogin: () => void;
  onOpenElevate: () => void;
  onOpenWhatsNew: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeSkill,
  activeCategoryFilter,
  onNavigate,
  onOpenLogin,
  onOpenElevate,
  onOpenWhatsNew,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  // Navigation Items matching Image 1
  const navItems = [
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      isActive: currentView === 'dashboard',
      action: () => onNavigate('dashboard')
    },
    {
      id: 'listening',
      label: 'Listening',
      icon: Headphones,
      isActive: currentView === 'catalogue' && activeSkill === 'listening' && activeCategoryFilter !== 'mock',
      action: () => onNavigate('catalogue', 'listening', 'all')
    },
    {
      id: 'reading',
      label: 'Reading',
      icon: BookOpen,
      isActive: currentView === 'catalogue' && activeSkill === 'reading' && activeCategoryFilter !== 'mock',
      action: () => onNavigate('catalogue', 'reading', 'all')
    },
    {
      id: 'writing',
      label: 'Writing',
      icon: PenTool,
      isActive: currentView === 'catalogue' && activeSkill === 'writing',
      action: () => onNavigate('catalogue', 'writing', 'all')
    },
    {
      id: 'speaking',
      label: 'Speaking',
      icon: Mic,
      isActive: currentView === 'catalogue' && activeSkill === 'speaking',
      action: () => onNavigate('catalogue', 'speaking', 'all')
    },
    {
      id: 'mock',
      label: 'Full Mock',
      icon: Clock,
      isActive: currentView === 'full_mock',
      action: () => onNavigate('full_mock')
    },
    {
      id: 'vocab',
      label: 'Vocabulary',
      icon: BookA,
      isActive: currentView === 'vocabulary',
      action: () => onNavigate('vocabulary')
    }
  ];

  const displayName = user ? user.fullName.split(' ')[0] : 'Guest';
  const initial = displayName.charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#073250] text-slate-100 border-r border-[#0B446B] select-none font-sans overflow-hidden">
      {/* Top Header: Brand & Collapse Toggle */}
      <div className="h-16 px-3.5 flex items-center justify-between border-b border-[#0B446B] gap-2 overflow-hidden">
        {!isCollapsed ? (
          <>
            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-95 transition-opacity"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                <BrandLogo variant="icon" size="sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="font-bold text-sm tracking-tight text-white leading-tight truncate">
                  IELTS with Arik
                </div>
                <span className="text-[10px] font-semibold text-[#FC9F23] tracking-normal truncate">
                  Your Gateway to Global Success
                </span>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                item.isActive
                  ? 'bg-[#0B4A75] text-white shadow-2xs font-semibold border-l-3 border-[#FC9F23]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  item.isActive ? 'text-[#FC9F23]' : 'text-slate-300'
                }`}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Teacher / Admin Workspace Section */}
        {isTeacherOrAdmin && (
          <div className="pt-3 mt-3 border-t border-[#0B446B] space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                {user?.role === 'admin' ? 'Admin / Teacher' : 'Teacher Suite'}
              </div>
            )}
            <button
              onClick={() => {
                onNavigate('teacher_editor');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'teacher_editor' ||
                currentView === 'teacher_edit_form' ||
                currentView === 'teacher_listening_edit_form' ||
                currentView === 'teacher_attempts'
                  ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Test Editor' : undefined}
            >
              <FileEdit className="w-4 h-4 text-cyan-300 shrink-0" />
              {!isCollapsed && <span>Test Editor</span>}
            </button>
            <button
              onClick={() => {
                onNavigate('teacher_writing');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'teacher_writing'
                  ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Writing Tasks' : undefined}
            >
              <PenTool className="w-4 h-4 text-orange-300 shrink-0" />
              {!isCollapsed && <span>Writing Tasks</span>}
            </button>
            <button
              onClick={() => {
                onNavigate('teacher_classes');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'teacher_classes'
                  ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Classes' : undefined}
            >
              <GraduationCap className="w-4 h-4 text-emerald-300 shrink-0" />
              {!isCollapsed && <span>Classes</span>}
            </button>
            <button
              onClick={() => {
                onNavigate('teacher_speaking');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'teacher_speaking'
                  ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Assess Speaking' : undefined}
            >
              <Mic className="w-4 h-4 text-purple-300 shrink-0" />
              {!isCollapsed && <span>Assess Speaking</span>}
            </button>
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    onNavigate('admin_commercial');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentView === 'admin_commercial'
                      ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={isCollapsed ? 'Commercial' : undefined}
                >
                  <Shield className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isCollapsed && <span>Commercial</span>}
                </button>
                <button
                  onClick={() => {
                    onNavigate('admin_users');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentView === 'admin_users'
                      ? 'bg-[#0B4A75] text-white shadow-2xs border-l-3 border-[#FC9F23]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  title={isCollapsed ? 'User Management' : undefined}
                >
                  <Users className="w-4 h-4 text-blue-300 shrink-0" />
                  {!isCollapsed && <span>Users</span>}
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Bottom Area: Upgrade to Pro, What's New, User Profile */}
      <div className="p-3 border-t border-[#0B446B] space-y-2 bg-[#05253C]">
        {/* Upgrade to Pro Pill Button */}
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('account')}
            className="w-full py-2 px-3 rounded-full bg-[#0B4A75] hover:bg-[#0D588B] text-white text-xs font-semibold border border-[#14669E] shadow-2xs transition-all flex items-center justify-center gap-1.5 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FC9F23] group-hover:rotate-12 transition-transform" />
            <span>Upgrade to Pro</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('account')}
            className="w-full p-2 rounded-full bg-[#0B4A75] hover:bg-[#0D588B] text-[#FC9F23] flex items-center justify-center border border-[#14669E]"
            title="Upgrade to Pro"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* What's new link */}
        <button
          onClick={onOpenWhatsNew}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="What's new"
        >
          <Sparkles className="w-4 h-4 text-[#FC9F23] shrink-0" />
          {!isCollapsed && <span>What's new</span>}
        </button>

        {/* User Profile Row */}
        <div className="relative" ref={menuRef}>
          {user ? (
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors ${
                isCollapsed ? 'justify-center p-1' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {initial}
                </div>
                {!isCollapsed && (
                  <div className="text-left truncate">
                    <span className="text-xs font-semibold text-white block truncate leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-slate-300 capitalize block leading-tight font-normal">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1 text-slate-300">
                  {profileMenuOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full py-2 px-3 rounded-xl bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              {!isCollapsed && <span>Sign In</span>}
            </button>
          )}

          {/* User Popover Menu */}
          {profileMenuOpen && user && (
            <div className="absolute bottom-full left-0 mb-2 w-60 rounded-2xl bg-[#073250] border border-[#0B446B] shadow-2xl p-2 z-50 text-sm">
              <div className="px-3.5 py-2.5 border-b border-[#0B446B] mb-1">
                <p className="font-bold text-white truncate text-sm">{user.fullName}</p>
                <p className="text-xs text-slate-300 truncate">{user.email}</p>
                {user.targetBand && (
                  <span className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded bg-[#0B4A75] text-[#FC9F23]">
                    Target Band: {user.targetBand}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onNavigate('account');
                  setProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Account & Membership</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    onOpenElevate();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FC9F23]" />
                  <span>Role Settings</span>
                </button>
              )}

              <div className="my-1 border-t border-[#182C40]" />

              <button
                onClick={() => {
                  logout();
                  setProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0C1824] border-b border-[#182C40] px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center p-0.5">
            <BrandLogo variant="icon" size="sm" />
          </div>
          <span className="font-bold text-sm text-white">IELTS with Arik</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 h-full bg-[#0C1824] shadow-2xl relative">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block sticky top-0 h-screen transition-all duration-300 ease-in-out shrink-0 z-30 ${
          isCollapsed ? 'w-20' : 'w-[268px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
