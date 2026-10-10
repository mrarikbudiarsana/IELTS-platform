import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  BookOpen,
  LogOut,
  Award,
  GraduationCap,
  Sparkles,
  CreditCard,
  Menu,
  X,
  ChevronDown,
  User,
  Layers,
  Settings,
  PenTool,
  CheckCircle,
  Clock
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, skill?: 'reading' | 'listening' | 'writing' | 'speaking') => void;
  onOpenLogin: () => void;
  onOpenElevate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenElevate,
}) => {
  const { user, logout, quickLoginAs } = useAuth();
  const [allowanceBalance, setAllowanceBalance] = useState<number | null>(null);
  const [speakingBalance, setSpeakingBalance] = useState<number | null>(null);

  // UI state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user?.role === 'student') {
      api.getMyAllowanceBalance()
        .then((res: any) => setAllowanceBalance(res.balance?.available ?? 0))
        .catch(() => {});
      api.getSpeakingAllowanceBalance()
        .then((res: any) => setSpeakingBalance(res.balance?.available ?? 0))
        .catch(() => {});
    } else {
      setAllowanceBalance(null);
      setSpeakingBalance(null);
    }
  }, [user]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string, skill?: 'reading' | 'listening' | 'writing' | 'speaking') => {
    onNavigate(view, skill);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => handleNavClick('dashboard')}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-base text-white shadow-xs">
                IA
              </div>
              <div>
                <div className="font-bold text-base tracking-tight text-slate-900 leading-snug">
                  IELTS with Arik
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Preparation & Practice
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === 'dashboard'
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick('practice')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === 'practice' || (currentView === 'catalogue' && !currentView.includes('mock'))
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Practice
              </button>

              <button
                onClick={() => handleNavClick('mock_tests')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === 'mock_tests'
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Mock Tests
              </button>

              {user && !isTeacherOrAdmin && (
                <button
                  onClick={() => handleNavClick('student_classes')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentView === 'student_classes'
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Class
                </button>
              )}

              {user && (
                <button
                  onClick={() => handleNavClick('history')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentView === 'history'
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Progress
                </button>
              )}

              {/* Teacher Shortcuts if logged in as staff */}
              {isTeacherOrAdmin && (
                <div className="pl-2 border-l border-slate-200 flex items-center space-x-1">
                  <button
                    onClick={() => handleNavClick('teacher_classes')}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      currentView === 'teacher_classes'
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Classes
                  </button>
                  <button
                    onClick={() => handleNavClick('teacher_speaking')}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      currentView === 'teacher_speaking'
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    Speaking
                  </button>
                  <button
                    onClick={() => handleNavClick('teacher_editor')}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      currentView === 'teacher_editor' || currentView === 'teacher_attempts'
                        ? 'bg-slate-200 text-slate-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Content Editor
                  </button>
                </div>
              )}
            </nav>

            {/* Right Action / Profile Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-medium text-slate-800 hidden sm:inline max-w-[120px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="font-semibold text-sm text-slate-900 truncate">{user.fullName}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'teacher'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-[11px] text-slate-500 capitalize">
                            {user.testTypePreference === 'not_sure' ? 'Academic' : `${user.testTypePreference} Track`}
                          </span>
                        </div>
                      </div>

                      {/* Learner Allowances if student */}
                      {user.role === 'student' && (
                        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Speaking Credits</span>
                            <span className="font-semibold text-slate-900">{speakingBalance ?? 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Writing Assessments</span>
                            <span className="font-semibold text-slate-900">{allowanceBalance ?? 0}</span>
                          </div>
                        </div>
                      )}

                      <div className="py-1">
                        <button
                          onClick={() => handleNavClick('commercial_store')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          <span>Plans & Assessment Access</span>
                        </button>

                        {isTeacherOrAdmin && (
                          <button
                            onClick={() => handleNavClick('commercial_admin')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Commercial Administration</span>
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleNavClick('admin_users')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Manage Users</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenLogin}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-md animate-in slide-in-from-top-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('practice')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'practice' || currentView === 'catalogue' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => handleNavClick('mock_tests')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'mock_tests' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Mock Tests
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNavClick('student_classes')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentView === 'student_classes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  My Class
                </button>
                <button
                  onClick={() => handleNavClick('history')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentView === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Progress
                </button>
              </>
            )}
            {isTeacherOrAdmin && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Teacher Area
                </div>
                <button
                  onClick={() => handleNavClick('teacher_classes')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Class Management
                </button>
                <button
                  onClick={() => handleNavClick('teacher_speaking')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Speaking Assessment Queue
                </button>
                <button
                  onClick={() => handleNavClick('teacher_editor')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Content Editor & Submissions
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* DISCREET DEVELOPER / REVIEWER SWITCHER TOOLBAR (Keeps student UI clean) */}
      <div className="fixed bottom-3 right-3 z-30">
        <div className="relative">
          {devToolsOpen ? (
            <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 w-56 text-xs space-y-2 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-semibold text-slate-300">Reviewer Test Switcher</span>
                <button
                  onClick={() => setDevToolsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Switch accounts quickly for testing:
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  onClick={() => {
                    quickLoginAs('student');
                    setDevToolsOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-medium text-white text-left transition-colors"
                >
                  👤 Switch to Demo Student
                </button>
                <button
                  onClick={() => {
                    quickLoginAs('teacher');
                    setDevToolsOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 font-medium text-white text-left transition-colors"
                >
                  🎓 Switch to Demo Teacher
                </button>
                {user?.role === 'student' && (
                  <button
                    onClick={() => {
                      onOpenElevate();
                      setDevToolsOpen(false);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-left border border-slate-700 transition-colors"
                  >
                    🔑 Elevate via Secret Key
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDevToolsOpen(true)}
              className="bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full text-[11px] font-medium shadow-md border border-slate-700 flex items-center gap-1.5 backdrop-blur-xs transition-colors"
              title="Open Reviewer / Developer Testing Switcher"
            >
              <span>🛠️</span>
              <span className="hidden sm:inline">Reviewer Switcher</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
