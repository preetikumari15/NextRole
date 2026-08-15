import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  LogOut,
  TrendingUp,
  Target,
  BarChart3,
  Eye,
  User,
  Trash2,
  CalendarDays,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/analysis/my");
      setAnalyses(response.data.analyses || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load your analyses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Open modal for targeted item
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalError("");
    setDeleteModalOpen(true);
  };

  // Close modal reset state
  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setSelectedId(null);
    setModalError("");
  };

  // Execute deletion call from modal
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      setIsDeleting(true);
      setModalError("");

      await api.delete(`/analysis/${selectedId}`);

      setAnalyses((current) =>
        current.filter((analysis) => analysis._id !== selectedId),
      );

      closeDeleteModal();
    } catch (err) {
      setModalError(
        err.response?.data?.message ||
          "Failed to delete analysis. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const statistics = useMemo(() => {
    if (!analyses.length) {
      return { total: 0, averageATS: 0, bestMatch: 0 };
    }

    const totalATS = analyses.reduce(
      (sum, analysis) => sum + Number(analysis.atsScore || 0),
      0,
    );

    const bestMatch = Math.max(
      ...analyses.map((analysis) => Number(analysis.matchScore || 0)),
    );

    return {
      total: analyses.length,
      averageATS: Math.round(totalATS / analyses.length),
      bestMatch,
    };
  }, [analyses]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (score >= 60) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800/80 text-sm text-slate-300">
              <User className="h-4 w-4 text-indigo-400" />
              <span>{user?.name || "Developer"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles size={13} /> AI-Powered Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || "User"} 👋
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Track your resume ATS scores, match rates, and optimization
              history.
            </p>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 px-5 py-3 rounded-xl font-semibold transition group"
          >
            <Plus
              size={18}
              className="transition-transform group-hover:rotate-90"
            />
            Analyze New Resume
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Total Analyses
                </p>
                <p className="text-3xl font-extrabold text-white mt-2">
                  {statistics.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText className="text-indigo-400" size={22} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Average ATS Score
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {statistics.averageATS}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    /100
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={22} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Best Job Match
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {statistics.bestMatch}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    /100
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Target className="text-purple-400" size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* History Table Container */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <BarChart3 className="text-indigo-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Analysis History
                </h2>
                <p className="text-xs text-slate-400">
                  Manage and view past resume evaluations
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm animate-pulse">
                Fetching your analyses...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center px-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3 text-rose-400">
                <ShieldAlert size={24} />
              </div>
              <p className="text-rose-400 font-medium text-sm">{error}</p>
              <button
                onClick={fetchAnalyses}
                className="mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-slate-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && analyses.length === 0 && (
            <div className="py-20 text-center px-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 text-slate-500">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">
                No analyses found
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm">
                You haven't uploaded any resumes yet. Start analyzing to get ATS
                insights.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                <Plus size={16} />
                Analyze Resume
              </Link>
            </div>
          )}

          {!loading && !error && analyses.length > 0 && (
            <div className="divide-y divide-slate-800/60">
              {analyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="p-5 sm:p-6 hover:bg-slate-800/40 transition duration-150 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 group-hover:border-indigo-500/40 transition">
                        <FileText
                          className="text-slate-300 group-hover:text-indigo-400 transition"
                          size={20}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate text-base">
                          {analysis.resumeName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <CalendarDays size={13} className="text-slate-500" />
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 pt-3 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="text-center">
                          <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            ATS Score
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold border ${getScoreBadge(
                              analysis.atsScore,
                            )}`}
                          >
                            {analysis.atsScore}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Job Match
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold border ${getScoreBadge(
                              analysis.matchScore,
                            )}`}
                          >
                            {analysis.matchScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/analysis/${analysis._id}`}
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700/80 text-slate-300 px-3.5 py-2 rounded-xl text-sm font-medium transition"
                        >
                          <Eye size={15} />
                          <span>View</span>
                          <ChevronRight size={14} className="opacity-60" />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(analysis._id)}
                          className="p-2 rounded-xl bg-slate-800/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 transition"
                          title="Delete analysis"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {/* Warning Icon */}
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle size={24} />
            </div>

            {/* Modal Title & Text */}
            <h3 className="text-xl font-bold text-white">Delete Analysis?</h3>
            <p className="text-slate-400 text-sm mt-2">
              Are you sure you want to delete this resume analysis? This action
              cannot be undone.
            </p>

            {/* Modal Error Display */}
            {modalError && (
              <p className="text-rose-400 text-xs font-medium mt-3 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                {modalError}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/25 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
