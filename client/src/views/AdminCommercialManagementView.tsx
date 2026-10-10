import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  CommercialProduct,
  CommercialOrder,
  AdminCommercialSummary,
} from '../../../shared/types';
import {
  DollarSign,
  Package,
  Key,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Sliders,
  Users,
} from 'lucide-react';

interface AdminCommercialManagementViewProps {
  onBack: () => void;
}

export const AdminCommercialManagementView: React.FC<AdminCommercialManagementViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'codes' | 'adjustments'>('products');
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<AdminCommercialSummary | null>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<CommercialOrder | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    id: '',
    sku: '',
    title: '',
    description: '',
    productType: 'paid_plan' as 'paid_plan' | 'writing_assessment' | 'speaking_session' | 'bundle',
    priceAmount: 199000,
    currency: 'IDR',
    durationDays: 30,
    renewalType: 'manual' as 'manual' | 'recurring',
    writingAllowances: 10,
    speakingAllowances: 2,
    grantsCatalogueAccess: true,
  });

  // New Teacher Code Form State
  const [newCode, setNewCode] = useState({
    code: '',
    label: '',
    description: '',
    maxRedemptions: 25,
    redemptionDeadlineAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    classId: '',
    accessDurationDays: 30,
    grantsCatalogueAccess: true,
    writingAllowances: 5,
    speakingAllowances: 2,
    protectedPrepostAllowances: 2,
  });

  // Balance Adjustment Form State
  const [adjUserId, setAdjUserId] = useState<string>('');
  const [adjSkill, setAdjSkill] = useState<'writing' | 'speaking'>('writing');
  const [adjAmount, setAdjAmount] = useState<number>(1);
  const [adjReason, setAdjReason] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [sumRes, usersRes, classesRes] = await Promise.all([
        api.getAdminCommercialSummary(),
        api.getAdminUsers().catch(() => ({ users: [] })),
        api.getClasses().catch(() => ({ classes: [] })),
      ]);
      setSummary(sumRes);
      setUserList(usersRes.users || []);
      setClassList(classesRes.classes || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load commercial management data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.createCommercialProduct({
        ...newProduct,
        sku: newProduct.sku || newProduct.id.toUpperCase(),
      });
      setSuccessMsg(`Product "${newProduct.title}" created as draft.`);
      setShowProductModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishProduct = async (productId: string) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.publishCommercialProduct(productId);
      setSuccessMsg('Product published successfully.');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to archive this product? Learners will no longer be able to purchase it.')) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.archiveCommercialProduct(productId);
      setSuccessMsg('Product archived successfully.');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to archive product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReconcileOrder = async (orderId: string) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.reconcileOrder(orderId);
      setSuccessMsg(`Order ${orderId.slice(0, 8)} reconciled. Current status: ${res.order.status}.`);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Reconciliation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRefund) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.refundOrder(selectedOrderForRefund.id, {
        reason: refundReason,
        amount: refundAmount,
      });
      setSuccessMsg(`Refund processed: ${res.order.status}. Consumed allowances revoked: ${res.refundAudit.consumedAllowancesRevoked}.`);
      setShowRefundModal(false);
      setSelectedOrderForRefund(null);
      setRefundReason('');
      setRefundAmount(undefined);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process refund.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.createTeacherCode({
        code: newCode.code,
        label: newCode.label || newCode.code,
        description: newCode.description,
        maxRedemptions: Number(newCode.maxRedemptions),
        redemptionDeadlineAt: newCode.redemptionDeadlineAt || undefined,
        classId: newCode.classId || undefined,
        accessDurationDays: Number(newCode.accessDurationDays),
        grantsCatalogueAccess: newCode.grantsCatalogueAccess,
        writingAllowances: Number(newCode.writingAllowances),
        speakingAllowances: Number(newCode.speakingAllowances),
        protectedPrepostAllowances: Number(newCode.protectedPrepostAllowances),
      });
      setSuccessMsg(`Teacher Code "${newCode.code.toUpperCase()}" created successfully.`);
      setShowCodeModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create teacher code.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to revoke this teacher code? No further redemptions will be accepted.')) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.revokeTeacherCode(codeId);
      setSuccessMsg('Teacher code revoked.');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to revoke code.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjUserId) {
      setErrorMsg('Please select a student user.');
      return;
    }
    if (!adjReason || adjReason.trim().length < 5) {
      setErrorMsg('A detailed reason (min 5 characters) is required for audit trails.');
      return;
    }
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await api.adjustUserBalance({
        userId: adjUserId,
        skill: adjSkill,
        amount: Number(adjAmount),
        reason: adjReason,
      });
      setSuccessMsg(`Balance adjusted successfully. New ${adjSkill} balance: ${res.newBalance}.`);
      setAdjReason('');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust balance.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>💼 Commercial & Financial Management</span>
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin & Staff
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure practice plans, inspect orders, reconcile gateway webhooks, issue teacher cohort codes, and review financial ledgers.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">&times;</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div className="flex-1">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">&times;</button>
        </div>
      )}

      {/* KPI Overview Banner */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Total Revenue (IDR)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              Rp {(summary.totalRevenueByCurrency['IDR'] || 0).toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Paid across {(summary.orderCountByStatus['paid'] || 0)} successful orders
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Active Subscribers</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {summary.activeSubscribersCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Learners with full catalogue access
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Orders Overview</span>
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {Object.values(summary.orderCountByStatus).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex gap-2">
              <span className="text-emerald-600 font-medium">✓ {summary.orderCountByStatus['paid'] || 0} Paid</span>
              <span className="text-amber-600 font-medium">⏳ {summary.orderCountByStatus['pending'] || 0} Pending</span>
              <span className="text-rose-600 font-medium">✕ {summary.orderCountByStatus['failed'] || 0} Failed</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Teacher Cohort Codes</span>
              <Key className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {summary.teacherCodes.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {summary.teacherCodes.filter((c) => c.status === 'active').length} active cohort batches
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            Products & Pricing ({summary?.products.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Orders & Reconciliation ({summary?.recentOrders.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'codes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Key className="w-4 h-4" />
            Teacher Codes ({summary?.teacherCodes.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('adjustments')}
            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'adjustments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Audited Balance Adjustments
          </button>
        </nav>
      </div>

      {/* TAB 1: PRODUCTS & PRICING */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Commercial Catalog Products</h2>
              <p className="text-xs text-slate-500">
                Products must be configured and explicitly published before learners can view or checkout.
              </p>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Product
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Product Title & ID</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Price & Duration</th>
                  <th className="px-6 py-3 text-left">Included Allowances</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{p.title}</div>
                      <div className="text-xs font-mono text-slate-400">{p.id}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {p.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {p.currency} {p.priceAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {p.durationDays ? `${p.durationDays} days (${p.renewalType})` : 'Perpetual credits'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 space-y-0.5">
                      {p.writingAllowances > 0 && <div>📝 {p.writingAllowances} Writing Tasks</div>}
                      {p.speakingAllowances > 0 && <div>🎙️ {p.speakingAllowances} Speaking Mocks</div>}
                      {p.writingAllowances === 0 && p.speakingAllowances === 0 && <span className="text-slate-400">Catalogue only</span>}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'published' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Published
                        </span>
                      )}
                      {p.status === 'draft' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Draft (Unpurchasable)
                        </span>
                      )}
                      {p.status === 'archived' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {p.status === 'draft' && (
                        <button
                          onClick={() => handlePublishProduct(p.id)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      {p.status === 'published' && (
                        <button
                          onClick={() => handleArchiveProduct(p.id)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium transition-colors"
                        >
                          Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & RECONCILIATION */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Commercial Orders & Payment Transactions</h2>
              <p className="text-xs text-slate-500">
                Track payments, reconcile missed gateway webhooks, and issue compensating refunds.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID & Date</th>
                  <th className="px-6 py-3 text-left">User ID</th>
                  <th className="px-6 py-3 text-left">Product Title</th>
                  <th className="px-6 py-3 text-left">Amount & Gateway</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-slate-900">{o.id}</div>
                      <div className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-600">{o.userId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{o.productTitle}</div>
                      <div className="text-xs text-slate-400 font-mono">{o.productSku}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {o.currency} {o.grossAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {o.paymentProvider} {o.paymentMethod ? `• ${o.paymentMethod}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          o.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : o.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : o.status === 'refunded'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                            : 'bg-rose-100 text-rose-800 border-rose-200'
                        }`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleReconcileOrder(o.id)}
                        disabled={actionLoading}
                        title="Query gateway and reconcile missed webhook notifications"
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                      >
                        Reconcile
                      </button>
                      {o.status === 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedOrderForRefund(o);
                            setShowRefundModal(true);
                          }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-medium transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEACHER CODES */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Teacher & Institution Cohort Codes</h2>
              <p className="text-xs text-slate-500">
                Issue redemption codes to automatically grant class enrolments, catalogue access, and AI assessment allowances.
              </p>
            </div>
            <button
              onClick={() => setShowCodeModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Teacher Code
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Code & Label</th>
                  <th className="px-6 py-3 text-left">Redemptions</th>
                  <th className="px-6 py-3 text-left">Linked Class</th>
                  <th className="px-6 py-3 text-left">Granted Benefits</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.teacherCodes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-indigo-700 text-base">{c.code}</div>
                      <div className="text-xs text-slate-800 font-medium">{c.label}</div>
                      <div className="text-xs text-slate-500">{c.description || 'Cohort access code'}</div>
                      {c.redemptionDeadlineAt && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Valid until: {new Date(c.redemptionDeadlineAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {c.redemptionCount} / {c.maxRedemptions} used
                      </div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-indigo-600 h-full"
                          style={{ width: `${Math.min(100, (c.redemptionCount / c.maxRedemptions) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.className ? (
                        <span className="text-xs font-medium text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {c.className}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">None (General)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 space-y-0.5">
                      {c.accessDurationDays > 0 && <div>🌐 {c.accessDurationDays}d Catalogue Access</div>}
                      {c.writingAllowances > 0 && <div>📝 {c.writingAllowances} Writing Tasks</div>}
                      {c.speakingAllowances > 0 && <div>🎙️ {c.speakingAllowances} Speaking Simulations</div>}
                      {c.protectedPrepostAllowances > 0 && (
                        <div className="text-indigo-600 font-medium">
                          🛡️ {c.protectedPrepostAllowances} Protected Pre/Post Assessments
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          c.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : c.status === 'exhausted'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-rose-100 text-rose-800 border-rose-200'
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === 'active' && (
                        <button
                          onClick={() => handleRevokeCode(c.id)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-medium transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDITED BALANCE ADJUSTMENTS */}
      {activeTab === 'adjustments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Audited Balance Adjustments</h2>
            <p className="text-xs text-slate-500">
              Discretionary adjustments are logged immutably in financial ledgers with mandatory staff reasons.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target Student
                </label>
                <select
                  value={adjUserId}
                  onChange={(e) => setAdjUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a student...</option>
                  {userList
                    .filter((u) => u.role === 'student')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Assessment Skill
                  </label>
                  <select
                    value={adjSkill}
                    onChange={(e) => setAdjSkill(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="writing">AI Writing Assessment</option>
                    <option value="speaking">AI Speaking Simulation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Adjustment Amount (+/-)
                  </label>
                  <input
                    type="number"
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Use positive numbers to grant, negative to deduct.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mandatory Audit Reason (Min 5 chars)
                </label>
                <textarea
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="e.g. Compensation for network interruption during Speaking mock trial."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Recording Ledger Entry...' : 'Submit Audited Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Create Commercial Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unique Product ID</label>
                  <input
                    type="text"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                    placeholder="e.g. paid_plan_quarterly"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. PLAN-Q-2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. 30-Day Intensive Practice Pass"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product Type</label>
                  <select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="paid_plan">Full Practice Plan</option>
                    <option value="writing_assessment">Individual Writing</option>
                    <option value="speaking_session">Individual Speaking</option>
                    <option value="bundle">Assessment Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (IDR)</label>
                  <input
                    type="number"
                    value={newProduct.priceAmount}
                    onChange={(e) => setNewProduct({ ...newProduct, priceAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newProduct.durationDays}
                    onChange={(e) => setNewProduct({ ...newProduct, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Renewal Behavior</label>
                  <select
                    value={newProduct.renewalType}
                    onChange={(e) => setNewProduct({ ...newProduct, renewalType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="manual">Manual Renewal (Indonesia Standard)</option>
                    <option value="recurring">Automatic Recurring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Writing Allowances</label>
                  <input
                    type="number"
                    value={newProduct.writingAllowances}
                    onChange={(e) => setNewProduct({ ...newProduct, writingAllowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Speaking Allowances</label>
                  <input
                    type="number"
                    value={newProduct.speakingAllowances}
                    onChange={(e) => setNewProduct({ ...newProduct, speakingAllowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TEACHER CODE MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Create Teacher Cohort Code</h3>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Redemption Code</label>
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BAND-7-MAY-2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={newCode.label}
                    onChange={(e) => setNewCode({ ...newCode, label: e.target.value })}
                    placeholder="e.g. Intensive May Class"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={newCode.description}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                  placeholder="e.g. Intensive 4-week cohort grant"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={newCode.maxRedemptions}
                    onChange={(e) => setNewCode({ ...newCode, maxRedemptions: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={newCode.redemptionDeadlineAt}
                    onChange={(e) => setNewCode({ ...newCode, redemptionDeadlineAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Link to Class (Optional Enrolment)</label>
                <select
                  value={newCode.classId}
                  onChange={(e) => setNewCode({ ...newCode, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">No Class (Catalogue & Allowances Only)</option>
                  {classList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.testType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Plan Days</label>
                  <input
                    type="number"
                    value={newCode.accessDurationDays}
                    onChange={(e) => setNewCode({ ...newCode, accessDurationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Writing Tasks</label>
                  <input
                    type="number"
                    value={newCode.writingAllowances}
                    onChange={(e) => setNewCode({ ...newCode, writingAllowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Speaking Mocks</label>
                  <input
                    type="number"
                    value={newCode.speakingAllowances}
                    onChange={(e) => setNewCode({ ...newCode, speakingAllowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-xs font-semibold text-amber-900 mb-2">Protected Pre/Post-Test Grants</div>
                <div>
                  <label className="block text-[11px] text-amber-800 mb-1">Protected Pre/Post Assessment Slots</label>
                  <input
                    type="number"
                    value={newCode.protectedPrepostAllowances}
                    onChange={(e) => setNewCode({ ...newCode, protectedPrepostAllowances: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-amber-300 rounded text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {showRefundModal && selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <span>Compensating Refund</span>
            </h3>
            <p className="text-xs text-slate-600">
              Refunding Order <span className="font-mono font-medium">{selectedOrderForRefund.id}</span>.
              This will revoke unused allowances and deactivate subscriptions without deleting history or creating negative balances.
            </p>

            <form onSubmit={handleRefundOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mandatory Refund Reason (Min 5 chars)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Student requested cancellation within guarantee window."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowRefundModal(false);
                    setSelectedOrderForRefund(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-rose-600 text-white rounded text-sm font-medium hover:bg-rose-700"
                >
                  {actionLoading ? 'Processing Refund...' : 'Confirm Compensating Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
