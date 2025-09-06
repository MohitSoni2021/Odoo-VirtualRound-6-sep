import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navigation from '../../components/common/Navigation';

// Modern Buyer Dashboard
// - Professional layout with analytics cards, trends, recent activity
// - Profile view + inline edit (local-only for now)
// - Uses dummy JSON data for analytics/stats

const BuyerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Dummy analytics/stats data
  const analytics = useMemo(
    () => ({
      totals: {
        orders: 18,
        spent: 12450.75,
        wishlist: 12,
        messages: 5,
      },
      ordersTrend: [4, 6, 5, 7, 3, 8, 10, 9, 6, 7, 8, 11], // last 12 months
      spendByCategory: [
        { name: 'Electronics', amount: 5200 },
        { name: 'Home & Kitchen', amount: 2400 },
        { name: 'Fashion', amount: 1800 },
        { name: 'Sports', amount: 1100 },
        { name: 'Books', amount: 950 },
      ],
      recentActivity: [
        { id: 'A-1009', title: 'Order Delivered', detail: 'Wireless Headphones', time: '2 days ago', amount: 199.99 },
        { id: 'A-1008', title: 'Order Shipped', detail: 'Air Fryer - Compact', time: '4 days ago', amount: 129.0 },
        { id: 'A-1007', title: 'Added to Wishlist', detail: 'Gaming Mouse', time: '1 week ago', amount: 59.99 },
        { id: 'A-1006', title: 'Order Placed', detail: 'Running Shoes', time: '2 weeks ago', amount: 89.5 },
      ],
    }),
    []
  );

  // Profile state (local edit)
  const initialProfile = useMemo(
    () => ({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+1 202 555 0147',
      address: user?.address || '221B Baker Street, London',
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&h=200&fit=crop&auto=format',
    }),
    [user]
  );

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const saveProfile = (e) => {
    e.preventDefault();
    // For now, we just persist to local state
    setEditing(false);
  };

  const maxOrders = Math.max(...analytics.ordersTrend, 1);
  const maxSpend = Math.max(...analytics.spendByCategory.map((c) => c.amount), 1);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <Navigation />

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="h-14 w-14 rounded-full border-2 border-white/70 shadow"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Welcome back, {profile.name.split(' ')[0]}!
                </h1>
                <p className="text-white/85 mt-1">Here’s an overview of your account and activity.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/orders"
                className="bg-white text-indigo-700 hover:bg-slate-100 px-4 py-2 rounded-lg font-medium shadow"
              >
                View Orders
              </Link>
              <Link
                to="/wishlist"
                className="bg-white/10 border border-white/30 hover:bg-white/20 px-4 py-2 rounded-lg font-medium"
              >
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Orders" value={analytics.totals.orders} icon="📦" accent="bg-indigo-100 text-indigo-700" />
          <KpiCard
            title="Total Spent"
            value={`$${analytics.totals.spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon="💳"
            accent="bg-emerald-100 text-emerald-700"
          />
          <KpiCard title="Wishlist" value={analytics.totals.wishlist} icon="❤️" accent="bg-pink-100 text-pink-700" />
          <KpiCard title="Messages" value={analytics.totals.messages} icon="✉️" accent="bg-amber-100 text-amber-700" />
        </section>

        {/* Charts + Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Orders Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Orders Trend (12 months)</h2>
              <span className="text-slate-500 text-sm">Dummy data</span>
            </div>
            <div className="h-40 flex items-end gap-2">
              {analytics.ordersTrend.map((v, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-md"
                    style={{ height: `${(v / maxOrders) * 100}%` }}
                    title={`${v} orders`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <span>Jan</span>
              <span>Apr</span>
              <span>Jul</span>
              <span>Oct</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={profile.avatar} alt="avatar" className="h-12 w-12 rounded-full" />
                  <div>
                    <div className="text-slate-900 font-medium">{profile.name}</div>
                    <div className="text-slate-500 text-sm">{profile.email}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-700">
                  <div className="flex justify-between py-1"><span className="text-slate-500">Phone</span><span>{profile.phone}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Address</span><span className="text-right max-w-[60%] truncate">{profile.address}</span></div>
                </div>
              </div>
            ) : (
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Name</label>
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Phone</label>
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Address</label>
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Spend By Category + Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Spend by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Spend by Category</h2>
              <span className="text-slate-500 text-sm">Dummy data</span>
            </div>
            <div className="space-y-4">
              {analytics.spendByCategory.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{c.name}</span>
                    <span className="text-slate-500">${c.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${(c.amount / maxSpend) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {analytics.recentActivity.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-slate-900 font-medium">{a.title}</div>
                    <div className="text-slate-500 text-sm">{a.detail}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 font-medium">${a.amount.toFixed(2)}</div>
                    <div className="text-slate-500 text-xs">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer (kept minimal) */}
      <footer className="bg-slate-900 text-slate-300 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <p className="text-sm">© {new Date().getFullYear()} E‑Commerce. All rights reserved.</p>
          <div className="space-x-4 text-sm">
            <Link to="/" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const KpiCard = ({ title, value, icon, accent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold ${accent}`}>{icon}</div>
    <div>
      <div className="text-slate-500 text-sm">{title}</div>
      <div className="text-xl font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

export default BuyerDashboard;