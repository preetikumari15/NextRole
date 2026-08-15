import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileSearch,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  BarChart3,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 backdrop-blur-sm animate-pulse">
            <Zap className="h-3.5 w-3.5" /> Next-Gen AI Resume Scanner
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Make your resume{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              job-ready
            </span>{" "}
            in seconds.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Upload your resume, compare it against target job descriptions, and unlock precise AI-driven insights to boost your ATS match rate and landed interviews.
          </p>

          {/* Call to Action */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-8 py-4 rounded-2xl font-semibold text-base text-slate-300 hover:text-white transition-all duration-200 text-center"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Instant ATS Score</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Keyword Gap Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Tailored Action Items</span>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <section className="mt-28 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              ATS Match Score
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get an accurate percentage compatibility rating based on recruitment algorithms and ATS parser filters.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 hover:border-violet-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
              <FileSearch className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Keyword Extraction
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify key skills, technologies, and phrasing missing from your resume compared to the job post.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Actionable Feedback
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive point-by-point recommendations to optimize formatting, impact verbs, and work experience bullets.
            </p>
          </div>
        </section>

        {/* Simple How-It-Works Banner */}
        <section className="mt-20 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Ready to land your next interview?
            </h3>
            <p className="text-slate-400 text-sm md:text-base mb-8">
              Join applicants who build tailored, ATS-friendly resumes with intelligent evaluation.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-white/10"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;