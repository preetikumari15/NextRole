import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Tag,
} from "lucide-react";
import api from "../services/api";

const ScoreCircle = ({ score, label }) => {
  const getScoreColor = () => {
    if (score >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", label: "Excellent" };
    if (score >= 60) return { stroke: "stroke-indigo-500", text: "text-indigo-400", badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", label: "Good" };
    if (score >= 40) return { stroke: "stroke-amber-500", text: "text-amber-400", badge: "bg-amber-500/10 border-amber-500/20 text-amber-400", label: "Needs Work" };
    return { stroke: "stroke-rose-500", text: "text-rose-400", badge: "bg-rose-500/10 border-rose-500/20 text-rose-400", label: "Poor" };
  };

  const scoreStyle = getScoreColor();
  const strokeDashoffset = 314 - (314 * Math.min(Math.max(score, 0), 100)) / 100;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300 shadow-xl">
      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800/80"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="314"
            strokeDashoffset={strokeDashoffset}
            className={`${scoreStyle.stroke} transition-all duration-1000 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-white tracking-tight">{score}</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">out of 100</span>
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-200 mt-2">{label}</h3>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${scoreStyle.badge}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {scoreStyle.label}
      </span>
    </div>
  );
};

const Section = ({ title, icon, children, action }) => {
  return (
    <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl hover:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-inner">
            {icon}
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};

const AnalysisResult = () => {
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/analysis/${id}`);
        setAnalysis(response.data.analysis);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load analysis details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">Analyzing Resume Data</h3>
          <p className="text-slate-400 text-sm mt-1">Retrieving insights and ATS optimization scores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl relative z-10">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-400">
            <XCircle size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Unable to Load Analysis</h1>
          <p className="text-slate-400 text-sm mt-2">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-5 rounded-2xl border border-slate-700/80 transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Document Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <FileText size={32} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Analysis Report</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                {analysis?.resumeName || "Resume Breakdown"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Comprehensive overview of ATS compatibility, keyword matching, and key improvements.
              </p>
            </div>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all shrink-0"
          >
            <span>Analyze Another</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Score Circles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ScoreCircle score={analysis?.atsScore || 0} label="ATS Compatibility Score" />
          <ScoreCircle score={analysis?.matchScore || 0} label="Job Match Score" />
        </div>

        {/* AI Executive Summary */}
        <div className="mb-8">
          <Section title="AI Summary" icon={<Sparkles size={20} className="text-indigo-400" />}>
            <p className="text-slate-300 leading-relaxed text-base font-normal">
              {analysis?.summary}
            </p>
          </Section>
        </div>

        {/* Skills Detected */}
        <div className="mb-8">
          <Section title="Skills Detected" icon={<Target size={20} className="text-indigo-400" />}>
            {analysis?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {analysis.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-sm font-medium"
                  >
                    <Tag size={14} className="opacity-70" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No skills explicitly detected in this document.</p>
            )}
          </Section>
        </div>

        {/* Keyword Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Section title="Matched Keywords" icon={<CheckCircle2 size={20} className="text-emerald-400" />}>
            {analysis?.matchedKeywords?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.matchedKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-slate-200 text-sm font-medium"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{keyword}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No matched keywords identified.</p>
            )}
          </Section>

          <Section title="Missing Keywords" icon={<AlertTriangle size={20} className="text-amber-400" />}>
            {analysis?.missingKeywords?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.missingKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-200/90 text-sm font-medium"
                  >
                    <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                    <span className="truncate">{keyword}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No critical missing keywords detected.</p>
            )}
          </Section>
        </div>

        {/* Missing Skills Section */}
        <div className="mb-8">
          <Section title="Missing Skills" icon={<ShieldAlert size={20} className="text-rose-400" />}>
            {analysis?.missingSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {analysis.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-sm font-medium"
                  >
                    <XCircle size={14} className="opacity-70" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No critical skills missing from target profiles.</p>
            )}
          </Section>
        </div>

        {/* Strengths and Weaknesses Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Section title="Strengths" icon={<CheckCircle2 size={20} className="text-emerald-400" />}>
            <div className="space-y-3">
              {analysis?.strengths?.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-slate-200 text-sm leading-relaxed"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Areas for Improvement" icon={<AlertTriangle size={20} className="text-amber-400" />}>
            <div className="space-y-3">
              {analysis?.weaknesses?.map((weakness, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-slate-200 text-sm leading-relaxed"
                >
                  <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{weakness}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Actionable Recommendations */}
        <div className="mb-10">
          <Section title="AI Actionable Recommendations" icon={<Lightbulb size={20} className="text-amber-400" />}>
            <div className="space-y-4">
              {analysis?.recommendations?.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-1">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Action Callout */}
        <div className="flex justify-center pt-4">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all"
          >
            <span>Analyze Another Resume</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResult;