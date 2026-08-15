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
  Briefcase,
  Code2,
  Copy,
  Check,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";

const ScoreCircle = ({ score, label }) => {
  const getScoreInfo = () => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-400", stroke: "stroke-emerald-500" };
    if (score >= 60) return { text: "Good", color: "text-indigo-400", stroke: "stroke-indigo-500" };
    if (score >= 40) return { text: "Needs Work", color: "text-amber-400", stroke: "stroke-amber-500" };
    return { text: "Poor", color: "text-rose-400", stroke: "stroke-rose-500" };
  };

  const { text, color, stroke } = getScoreInfo();
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-slate-700/80 hover:shadow-lg hover:shadow-indigo-500/5 group">
      <div className="absolute inset-0 bg-radial from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800/60"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${stroke} transition-all duration-1000 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">{score}</span>
          <span className="text-xs font-medium text-slate-500 mt-0.5">out of 100</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-200 mt-4 tracking-wide">{label}</h3>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 mt-2 ${color}`}>
        {text}
      </span>
    </div>
  );
};

const Section = ({ title, icon, children, badge }) => (
  <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/60">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-indigo-400">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
      </div>
      {badge && (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {badge}
        </span>
      )}
    </div>
    {children}
  </section>
);

const ImprovedBulletCard = ({ bullet, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative p-5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 hover:border-slate-600/60 rounded-xl transition-all duration-200">
      <div className="flex items-start gap-4">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </span>
        <p className="text-slate-200 leading-relaxed text-sm md:text-base flex-1 pr-8">
          {bullet}
        </p>
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-all opacity-80 group-hover:opacity-100"
          title="Copy bullet point"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
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
        setError(err.response?.data?.message || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/20 animate-pulse" />
          </div>
          <p className="text-slate-400 font-medium text-sm animate-pulse">Analyzing resume insights...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl">
          <XCircle className="mx-auto text-rose-400 mb-4" size={52} />
          <h1 className="text-2xl font-bold">Unable to load analysis</h1>
          <p className="text-slate-400 mt-2 text-sm">{error || "Analysis not found"}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sections = analysis.sections || {};
  const atsChecks = analysis.atsChecks || {};

  const checkLabels = {
    contactInformation: "Contact Information",
    clearSections: "Clear Resume Sections",
    measurableAchievements: "Measurable Achievements",
    keywordOptimization: "Keyword Optimization",
    readableStructure: "Readable Structure",
    noObviousFormattingIssues: "No Obvious Formatting Issues",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles size={18} />
            </div>
            <span className="font-bold tracking-tight text-base bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                NextRole
            </span>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Resume Analysis
              </h1>
              <p className="text-slate-400 mt-1 text-sm font-medium flex items-center gap-2">
                <span>File:</span> <span className="text-slate-200">{analysis.resumeName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ScoreCircle score={analysis.atsScore} label="ATS Compatibility Score" />
          <ScoreCircle score={analysis.matchScore} label="Job Match Score" />
        </div>

        {/* Key Performance Indicators */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Keyword Coverage</span>
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-bold mt-3 text-white">
              {analysis.keywordCoverage ?? 0}%
            </p>
            <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${analysis.keywordCoverage ?? 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Experience Relevance</span>
              <Briefcase size={18} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-bold mt-3 text-white">
              {analysis.experienceRelevance ?? 0}%
            </p>
            <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${analysis.experienceRelevance ?? 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Project Relevance</span>
              <Code2 size={18} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-bold mt-3 text-white">
              {analysis.projectRelevance ?? 0}%
            </p>
            <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${analysis.projectRelevance ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <Section title="AI Summary" icon={<Sparkles size={20} />}>
            <p className="text-slate-300 leading-relaxed text-base">
              {analysis.summary}
            </p>
          </Section>
        </div>

        {/* ATS Checks */}
        <div className="mb-8">
          <Section title="ATS Compatibility Checks" icon={<Target size={20} />}>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(atsChecks).map(([key, passed]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/40 rounded-xl"
                >
                  <span className="text-slate-300 font-medium text-sm">
                    {checkLabels[key] || key}
                  </span>
                  {passed ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={14} /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <XCircle size={14} /> Action Needed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Resume Section Breakdown */}
        <div className="mb-8">
          <Section title="Resume Section Analysis" icon={<FileText size={20} />}>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(sections).map(([name, section]) => (
                <div key={name} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-200 capitalize tracking-wide">{name}</h3>
                    <span className="text-indigo-400 text-sm font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      {section.score}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    {section.feedback}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Keywords Comparison */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Section title="Matched Keywords" icon={<CheckCircle2 size={20} className="text-emerald-400" />}>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords?.length ? (
                analysis.matchedKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium rounded-lg"
                  >
                    <CheckCircle2 size={12} /> {keyword}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No matched keywords found.</p>
              )}
            </div>
          </Section>

          <Section title="Missing Keywords" icon={<AlertTriangle size={20} className="text-amber-400" />}>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords?.length ? (
                analysis.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium rounded-lg"
                  >
                    <AlertTriangle size={12} /> {keyword}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No major missing keywords.</p>
              )}
            </div>
          </Section>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Section title="Strengths" icon={<CheckCircle2 size={20} className="text-emerald-400" />}>
            <ul className="space-y-3">
              {analysis.strengths?.map((strength, index) => (
                <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Weaknesses" icon={<AlertTriangle size={20} className="text-amber-400" />}>
            <ul className="space-y-3">
              {analysis.weaknesses?.map((weakness, index) => (
                <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                  <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* AI-Improved Resume Bullets */}
        <div className="mb-8">
          <Section
            title="AI-Improved Resume Bullets"
            icon={<Sparkles size={20} />}
            badge={analysis.improvedBullets?.length ? `${analysis.improvedBullets.length} Suggestions` : null}
          >
            {analysis.improvedBullets?.length ? (
              <div className="space-y-3">
                {analysis.improvedBullets.map((bullet, index) => (
                  <ImprovedBulletCard key={index} bullet={bullet} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No bullet improvements were necessary.</p>
            )}
          </Section>
        </div>

        {/* Recommendations */}
        <div className="mb-10">
          <Section title="AI Recommendations" icon={<Lightbulb size={20} className="text-amber-400" />}>
            <div className="space-y-3">
              {analysis.recommendations?.map((recommendation, index) => (
                <div key={index} className="flex gap-4 p-4 bg-slate-800/30 border border-slate-700/40 rounded-xl">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 px-6 py-3 rounded-xl font-medium transition-all"
          >
            <ArrowLeft size={18} /> Return to Dashboard
          </Link>

          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/25 transition-all"
          >
            Analyze Another Resume
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResult;