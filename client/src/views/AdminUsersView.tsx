import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Users, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

interface AdminUsersViewProps {
  onBack: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      setMsg(`Role updated to ${newRole} successfully`);
      setTimeout(() => setMsg(null), 3000);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const needle = search.trim().toLowerCase();
  const visibleUsers = users.filter(u => (!roleFilter || u.role === roleFilter) &&
    [u.full_name, u.email].some(value => value?.toLowerCase().includes(needle)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">User accounts</h1>
            <p className="text-xs text-slate-500">
              Admin console for granting teacher and admin privileges to accounts.
            </p>
          </div>
        </div>
      </div>

      {msg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <input type="search" aria-label="Search user accounts" placeholder="Search by name or email" value={search}
          onChange={e => setSearch(e.target.value)} className="flex-1 min-w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
        <select aria-label="Filter by role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rounded-lg border bg-white px-3 py-2 text-sm">
          <option value="">All roles</option><option value="student">Students</option><option value="teacher">Teachers</option><option value="admin">Administrators</option>
        </select>
      </div>
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading users...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left">User Name</th>
                <th className="px-5 py-3.5 text-left">Email</th>
                <th className="px-5 py-3.5 text-left">Current Role</th>
                <th className="px-5 py-3.5 text-left">Module Preference</th>
                <th className="px-5 py-3.5 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visibleUsers.length === 0 && <tr><td colSpan={5} className="p-5 text-center text-slate-500">No matching accounts.</td></tr>}
              {visibleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-4 font-bold text-slate-900">{u.full_name}</td>
                  <td className="px-5 py-4 text-slate-600">{u.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'teacher'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">
                    {u.test_type_preference}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
