import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { CommercialProduct, CommercialOrder, LearnerCommercialSummary, CheckoutPreviewResponse } from '../../../shared/types';

interface AccountCommercialViewProps {
  onBack: () => void;
}

export const AccountCommercialView: React.FC<AccountCommercialViewProps> = ({ onBack }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<LearnerCommercialSummary | null>(null);
  const [products, setProducts] = useState<CommercialProduct[]>([]);
  const [orders, setOrders] = useState<CommercialOrder[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CommercialProduct | null>(null);
  const [checkoutPreview, setCheckoutPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Teacher Code states
  const [codeQuery, setCodeQuery] = useState<string>('');
  const [codePreview, setCodePreview] = useState<any | null>(null);
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [sumRes, prodRes, ordRes] = await Promise.all([
        api.getMyCommercialEntitlements(),
        api.getCommercialProducts(),
        api.getMyOrders(),
      ]);
      setSummary(sumRes);
      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load commercial account details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckout = async (product: CommercialProduct) => {
    setSelectedProduct(product);
    setCheckoutLoading(true);
    setErrorMsg(null);
    setCheckoutUrl(null);
    setCreatedOrderId(null);
    try {
      const preview = await api.getCheckoutPreview(product.id);
      setCheckoutPreview(preview);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch checkout preview.');
      setSelectedProduct(null);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;
    setCheckoutLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.createOrder({
        productId: selectedProduct.id,
        provider: 'mock', // Sandbox mode
      });
      setCreatedOrderId(res.order.id);
      setCheckoutUrl(res.checkoutUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSimulatePaymentSuccess = async (orderId: string) => {
    setCheckoutLoading(true);
    setErrorMsg(null);
    try {
      // Simulate webhook payment confirmation in sandbox
      await fetch('/api/commerce/webhooks/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          transaction_status: 'paid',
          payment_method: 'qris',
          gross_amount: selectedProduct?.priceAmount,
        }),
      });

      // Reconcile and reload
      await api.reconcileOrder(orderId);
      await loadData();
      setSelectedProduct(null);
      setCheckoutPreview(null);
      setCreatedOrderId(null);
      setCheckoutUrl(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment simulation failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePreviewCode = async () => {
    if (!codeQuery.trim()) return;
    setCodeLoading(true);
    setErrorMsg(null);
    setCodeSuccessMsg(null);
    try {
      const preview = await api.previewTeacherCode(codeQuery.trim());
      setCodePreview(preview);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid teacher code.');
      setCodePreview(null);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!codeQuery.trim()) return;
    setCodeLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.redeemTeacherCode(codeQuery.trim());
      setCodeSuccessMsg(res.message);
      setCodePreview(null);
      setCodeQuery('');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Redemption failed.');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleReconcileOrder = async (orderId: string) => {
    try {
      await api.reconcileOrder(orderId);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Reconciliation failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading plan and allowances...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commercial Access, Plans & Allowances</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your practice subscription, individual AI assessment credits, and teacher codes.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
        >
          ← Back
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {codeSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
          ✔ {codeSuccessMsg}
        </div>
      )}

      {/* PLAN STATUS & ALLOWANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Plan Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Practice Plan</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  summary?.planType === 'paid_plan'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {summary?.planType === 'paid_plan' ? 'Active Paid Plan' : 'Free Account'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-3">
              {summary?.planType === 'paid_plan' ? 'Full Catalogue Access' : 'Selected Content'}
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.planType === 'paid_plan'
                ? `Expires on: ${new Date(summary.planExpiresAt!).toLocaleDateString()} (${Math.max(
                    0,
                    Math.ceil((new Date(summary.planExpiresAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  )} days remaining)`
                : 'Free tier with access to practice materials and sample sectional tasks.'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
            {summary?.hasCatalogueAccess ? '✔ All Reading & Listening mocks unlocked' : '🔒 Paid mocks require a plan or code'}
          </div>
        </div>

        {/* Writing Allowances Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">AI Writing Credits</span>
              <span className="text-lg font-bold text-indigo-600">{summary?.writingBalance.total || 0} Total</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Discretionary practice:</span>
                <span className="font-semibold text-gray-900">{summary?.writingBalance.discretionary || 0}</span>
              </div>
              <div className="flex justify-between text-amber-700 bg-amber-50 px-2 py-1 rounded">
                <span>Protected Pre/Post tests:</span>
                <span className="font-semibold">{summary?.writingBalance.protectedPrepost || 0}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
            1 credit evaluates Task 1 or Task 2 with verified official IELTS scoring.
          </p>
        </div>

        {/* Speaking Allowances Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Live AI Speaking Credits</span>
              <span className="text-lg font-bold text-indigo-600">{summary?.speakingBalance.total || 0} Total</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Discretionary practice:</span>
                <span className="font-semibold text-gray-900">{summary?.speakingBalance.discretionary || 0}</span>
              </div>
              <div className="flex justify-between text-amber-700 bg-amber-50 px-2 py-1 rounded">
                <span>Protected Pre/Post tests:</span>
                <span className="font-semibold">{summary?.speakingBalance.protectedPrepost || 0}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
            1 credit covers a complete 3-part interactive voice simulation with acoustic evaluation.
          </p>
        </div>
      </div>

      {/* TEACHER CODE REDEMPTION SECTION */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm mb-8">
        <h3 className="text-base font-bold text-gray-900">Redeem a Teacher Code</h3>
        <p className="text-xs text-gray-600 mt-1">
          Have an enrolment pass or school institutional voucher? Enter your code below to unlock class membership, practice access, and assessment credits.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. PILOT-INTENSIVE-2026"
            value={codeQuery}
            onChange={(e) => setCodeQuery(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm uppercase tracking-wider font-mono focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          />
          <button
            onClick={handlePreviewCode}
            disabled={codeLoading || !codeQuery.trim()}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {codeLoading ? 'Checking...' : 'Review Benefits'}
          </button>
        </div>

        {codePreview && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-indigo-900 text-sm">Code: {codePreview.code.code}</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">
                {codePreview.durationText}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{codePreview.code.label}</p>
            <ul className="text-xs text-gray-700 space-y-1 mb-4 list-disc list-inside">
              {codePreview.benefits.map((b: string, idx: number) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button
                onClick={handleRedeemCode}
                disabled={codeLoading}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
              >
                Confirm & Redeem Now
              </button>
              <button
                onClick={() => setCodePreview(null)}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STORE / PRODUCTS AVAILABLE FOR PURCHASE */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Practice Plans & Individual Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                  {prod.productType === 'paid_plan'
                    ? 'Practice Plan'
                    : prod.productType === 'writing_assessment'
                    ? 'Writing Evaluation'
                    : 'Speaking Simulation'}
                </span>
                <h3 className="text-base font-bold text-gray-900">{prod.title}</h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{prod.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-black text-gray-900">
                    {prod.currency === 'IDR'
                      ? `Rp ${prod.priceAmount.toLocaleString('id-ID')}`
                      : `$${(prod.priceAmount / 100).toFixed(2)}`}
                  </span>
                  {prod.durationDays && <span className="text-xs text-gray-500 ml-1">/ {prod.durationDays} days</span>}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  {prod.grantsCatalogueAccess && <div>✔ Full Reading & Listening Mocks</div>}
                  {prod.writingAllowances > 0 && <div>✔ +{prod.writingAllowances} Writing Assessment Credits</div>}
                  {prod.speakingAllowances > 0 && <div>✔ +{prod.speakingAllowances} Live AI Speaking Sessions</div>}
                </div>
              </div>
              <button
                onClick={() => handleOpenCheckout(prod)}
                className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 shadow-sm"
              >
                Review & Checkout
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-bold text-gray-900">Order & Payment History</h3>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No previous orders on record.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{o.id}</td>
                    <td className="px-6 py-4 text-gray-700">{o.productTitle}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {o.currency === 'IDR' ? `Rp ${o.grossAmount.toLocaleString('id-ID')}` : `$${o.grossAmount}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          o.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : o.status === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleReconcileOrder(o.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Check Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL WITH FULL DISCLOSURE */}
      {selectedProduct && checkoutPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Order Pre-Payment Review</h3>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setCheckoutPreview(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-gray-700">
              <div>
                <span className="text-gray-500 font-medium">Selected Item:</span>
                <p className="text-base font-bold text-gray-900 mt-0.5">{checkoutPreview.product.title}</p>
                <p className="text-gray-600 mt-1">{checkoutPreview.product.description}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Price:</span>
                  <span className="text-base font-black text-indigo-700">{checkoutPreview.totalPriceFormatted}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Duration:</span>
                  <span>{checkoutPreview.durationDescription}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-900">Included Entitlements:</span>
                <ul className="mt-1 list-disc list-inside space-y-1 text-gray-700">
                  {checkoutPreview.benefitsSummary.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <span className="font-semibold text-indigo-900">Effect on Your Account:</span>
                <p className="mt-1 text-indigo-800">{checkoutPreview.impactSummary}</p>
              </div>

              <div className="text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <p>
                  <strong>Renewal:</strong> {checkoutPreview.renewalNotice}
                </p>
                <p>
                  <strong>Terms:</strong> {checkoutPreview.cancellationRefundTerms}
                </p>
              </div>

              {createdOrderId && checkoutUrl && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                  <p className="text-emerald-800 font-semibold">Sandbox Checkout Ready (Order {createdOrderId})</p>
                  <p className="text-emerald-700">
                    In live mode, you would be redirected to the secure payment gateway. For sandbox testing, click below to simulate verified payment settlement.
                  </p>
                  <button
                    onClick={() => handleSimulatePaymentSuccess(createdOrderId)}
                    disabled={checkoutLoading}
                    className="w-full py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 text-sm"
                  >
                    {checkoutLoading ? 'Processing...' : '✔ Simulate Successful Payment'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setCheckoutPreview(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {!createdOrderId && (
                <button
                  onClick={handleConfirmOrder}
                  disabled={checkoutLoading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {checkoutLoading ? 'Creating Order...' : 'Proceed to Checkout'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
