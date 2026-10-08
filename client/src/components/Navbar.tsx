import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Shield, LogOut, Award, UserCheck, Layers, Users, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
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

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('catalogue')}>
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-inner">
              IE
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight leading-tight flex items-center gap-2">
                IELTS Mastery
                <span className="text-xs bg-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-400/30">
                  Reading & Listening
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Learn English With Arik</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => onNavigate('catalogue')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'catalogue'
                  ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Practice & Mocks
            </button>

            {user && !isTeacherOrAdmin && (
              <button
                onClick={() => onNavigate('student_classes')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'student_classes'
                    ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                My Classes
              </button>
            )}

            {user && (
              <button
                onClick={() => onNavigate('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'history'
                    ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                My Attempts
              </button>
            )}

            {isTeacherOrAdmin && (
              <>
                <button
                  onClick={() => onNavigate('teacher_classes')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'teacher_classes'
                      ? 'bg-amber-950 text-amber-200 border-b-2 border-amber-500'
                      : 'text-amber-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Class Management
                </button>
                <button
                  onClick={() => onNavigate('teacher_editor')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'teacher_editor'
                      ? 'bg-amber-950 text-amber-200 border-b-2 border-amber-500'
                      : 'text-amber-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Test Editor & Versions
                </button>

                <button
                  onClick={() => onNavigate('teacher_attempts')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'teacher_attempts'
                      ? 'bg-amber-950 text-amber-200 border-b-2 border-amber-500'
                      : 'text-amber-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Student Submissions
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin_users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'admin_users'
                    ? 'bg-purple-950 text-purple-200 border-b-2 border-purple-500'
                    : 'text-purple-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Manage Users
              </button>
            )}
          </nav>

          {/* Right Action / Auth Profile */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-200">{user.fullName}</div>
                  <div className="flex items-center justify-end gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-900/80 text-purple-200 border border-purple-600'
                          : user.role === 'teacher'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                          : 'bg-indigo-900/80 text-indigo-200 border border-indigo-600'
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.testTypePreference !== 'not_sure' && (
                      <span className="text-[10px] text-slate-400 capitalize">
                        ({user.testTypePreference})
                      </span>
                    )}
                  </div>
                </div>

                {user.role === 'student' && (
                  <button
                    onClick={onOpenElevate}
                    title="Elevate to Teacher (Requires Secret Key)"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/50 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Teacher Access
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Demo Fast Logins for easy reviewer testing */}
                <button
                  onClick={() => quickLoginAs('student')}
                  className="text-xs bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-600/40 px-2.5 py-1.5 rounded-md font-medium"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => quickLoginAs('teacher')}
                  className="text-xs bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 px-2.5 py-1.5 rounded-md font-medium"
                >
                  Demo Teacher
                </button>
                <button
                  onClick={onOpenLogin}
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-md shadow-sm transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
