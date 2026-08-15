import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileText, 
  BarChart3, 
  Sparkles, 
  UploadCloud, 
  LogOut, 
  ChevronRight, 
  User 
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Radial Spotlights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800/80 text-sm text-slate-300">
              <User className="h-4 w-4 text-indigo-400" />
              <span>{user?.name || "Developer"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 md:p-10 mb-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> AI Engine Ready
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || "Developer"} 👋
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
                Optimize your resume, benchmark against ATS systems, and generate targeted bullet points tailored to tech roles.
              </p>
            </div>

            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 group shrink-0"
            >
              <span>Analyze New Resume</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/upload"
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
              Upload Resume
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload your PDF resume to instantly parse formatting and target keywords.
            </p>
          </Link>

          <Link
            to="/ats-score"
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-violet-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
              ATS Score Breakdown
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Check match compatibility against job descriptions and modern ATS scanners.
            </p>
          </Link>

          <Link
            to="/recommendations"
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
              AI Improvements
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get rewritten impact bullet points with action verbs and quantifiable metrics.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;