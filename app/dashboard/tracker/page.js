"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected", "Wishlist"];

const STATUS_STYLES = {
  Applied: { bg: "#eff6ff", color: "#3b82f6", dot: "#3b82f6" },
  Interview: { bg: "#fefce8", color: "#ca8a04", dot: "#eab308" },
  Offer: { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  Rejected: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  Wishlist: { bg: "#faf5ff", color: "#9333ea", dot: "#a855f7" },
};

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "Applied",
    applied_date: new Date().toISOString().split("T")[0],
    salary: "",
    location: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.company_name || !form.job_title) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      await supabase.from("applications").update({ ...form, updated_at: new Date() }).eq("id", editingId);
    } else {
      await supabase.from("applications").insert({ ...form, user_id: user.id });
    }

    setForm({
      company_name: "", job_title: "", job_url: "", status: "Applied",
      applied_date: new Date().toISOString().split("T")[0], salary: "", location: "", notes: "",
    });
    setShowForm(false);
    setEditingId(null);
    fetchApplications();
  };

  const handleEdit = (app) => {
    setForm({
      company_name: app.company_name,
      job_title: app.job_title,
      job_url: app.job_url || "",
      status: app.status,
      applied_date: app.applied_date,
      salary: app.salary || "",
      location: app.location || "",
      notes: app.notes || "",
    });
    setEditingId(app.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await supabase.from("applications").delete().eq("id", id);
    fetchApplications();
  };

  const handleStatusChange = async (id, status) => {
    await supabase.from("applications").update({ status, updated_at: new Date() }).eq("id", id);
    fetchApplications();
  };

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  const stats = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .text-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111111;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s;
        }
        .text-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .text-input::placeholder { color: #9ca3af; }
        .app-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s;
        }
        .app-card:hover {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99,102,241,0.06);
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#111] transition-colors text-sm">← Back</Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-medium text-[#111]">Application Tracker</span>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Add application
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-2">
            Application Tracker
          </h1>
          <p className="text-gray-500">Track all your job applications in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="bg-white border border-gray-100 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-200 transition-colors"
              onClick={() => setFilter(filter === s ? "All" : s)}>
              <div className="text-2xl font-bold text-[#111] mb-1">{stats[s] || 0}</div>
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_STYLES[s].dot }} />
                <span className="text-xs text-gray-500">{s}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["All", ...STATUS_OPTIONS].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f ? "#111" : "white",
                color: filter === f ? "white" : "#6b7280",
                border: filter === f ? "1px solid #111" : "1px solid #e5e7eb",
              }}
            >
              {f} {f !== "All" && stats[f] ? `(${stats[f]})` : f === "All" ? `(${applications.length})` : ""}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-[#111] text-lg">{editingId ? "Edit application" : "Add application"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-[#111] text-xl">×</button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Company Name *</label>
                    <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      placeholder="e.g. Google" className="text-input" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job Title *</label>
                    <input type="text" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      placeholder="e.g. Software Engineer" className="text-input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="text-input">
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Applied Date</label>
                    <input type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} className="text-input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Bangalore" className="text-input" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Salary</label>
                    <input type="text" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      placeholder="e.g. ₹6 LPA" className="text-input" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Job URL</label>
                  <input type="url" value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                    placeholder="https://..." className="text-input" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any notes about this application..." rows={3}
                    className="text-input" style={{ resize: 'none' }} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-[#111] text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                  {editingId ? "Save changes" : "Add application"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-[#111] mb-2">No applications yet</h3>
            <p className="text-gray-500 text-sm mb-6">Start tracking your job applications to stay organized</p>
            <button onClick={() => setShowForm(true)}
              className="bg-[#111] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              + Add your first application
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app.id} className="app-card">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      🏢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-semibold text-[#111]">{app.company_name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5"
                          style={{ background: STATUS_STYLES[app.status]?.bg, color: STATUS_STYLES[app.status]?.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_STYLES[app.status]?.dot }} />
                          {app.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{app.job_title}</p>
                      <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
                        {app.location && <span>📍 {app.location}</span>}
                        {app.salary && <span>💰 {app.salary}</span>}
                        <span>📅 {new Date(app.applied_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {app.notes && <p className="text-xs text-gray-400 mt-2 bg-gray-50 px-3 py-2 rounded-lg">{app.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {app.job_url && (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-indigo-600 border border-indigo-100 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                        View job
                      </a>
                    )}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white text-gray-600"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => handleEdit(app)}
                      className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(app.id)}
                      className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}