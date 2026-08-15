import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Briefcase,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Zap,
} from "lucide-react";

import api from "../services/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_JD_LENGTH = 10000;

const ANALYZING_STEPS = [
  "Extracting text from PDF resume...",
  "Parsing job requirements & key skills...",
  "Evaluating ATS compatibility score...",
  "Generating actionable feedback...",
];

const Analyze = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "Please select a PDF file.";
    if (selectedFile.type !== "application/pdf") return "Only PDF files are allowed.";
    if (selectedFile.size > MAX_FILE_SIZE) return "PDF must be smaller than 5 MB.";
    return "";
  };

  const handleFile = (selectedFile) => {
    setError("");
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload your resume PDF.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError("Please enter a more complete job description (at least 50 characters).");
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < ANALYZING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription.trim());

      const response = await api.post("/analysis/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const analysisId = response.data.analysisId;
      if (!analysisId) {
        throw new Error("Analysis completed, but no analysis ID was returned.");
      }

      navigate(`/analysis/${analysisId}`);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const jdPercentage = Math.min((jobDescription.length / MAX_JD_LENGTH) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              NextRole
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 shadow-inner">
            <Cpu size={14} className="text-indigo-400" />
            Powered by Gemini AI Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Optimize Your Resume
          </h1>

          <p className="text-slate-400 max-w-xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            Upload your resume alongside target job descriptions to discover key missing keywords and boost your ATS score.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 flex items-start gap-3 shadow-lg shadow-red-950/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{error}</div>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Resume Upload */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl transition-all">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-slate-100">Upload Resume</h2>
                <p className="text-xs text-slate-400">PDF standard format • Maximum 5 MB</p>
              </div>
            </div>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative group border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200
                  ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
                      : "border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>

                <h3 className="text-base font-semibold text-slate-200 mt-4">
                  {dragActive ? "Drop your resume file here" : "Drag & drop your resume PDF"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  or click anywhere to browse local files
                </p>
              </div>
            ) : (
              <div className="border border-indigo-500/30 bg-indigo-950/20 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-200 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>PDF</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-400 inline-flex items-center gap-1 font-medium">
                        <CheckCircle2 size={12} /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Job Description */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-slate-100">Job Description</h2>
                  <p className="text-xs text-slate-400">Paste the target position requirements</p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {jobDescription.length.toLocaleString()} / {MAX_JD_LENGTH.toLocaleString()}
              </span>
            </div>

            {/* Character Count Progress Line */}
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-4">
              <div
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${jdPercentage}%` }}
              />
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= MAX_JD_LENGTH) {
                  setJobDescription(value);
                  setError("");
                }
              }}
              placeholder="Paste complete job description details (responsibilities, required qualifications, key tools)..."
              rows={8}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Feature Highlights Grid */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo-400" />
              Analysis Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
              {[
                "ATS Score Calculation",
                "Keyword Gap Analysis",
                "Formatting Verification",
                "Action Verb Review",
                "Experience Alignment",
                "Improvement Suggestions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/30">
                  <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-base transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2.5 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin text-white" />
                Processing Analysis...
              </>
            ) : (
              <>
                <Zap size={18} className="fill-white" />
                Analyze Resume with AI
              </>
            )}
          </button>
        </form>

        {/* Live Loading Box */}
        {loading && (
          <div className="mt-6 bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Loader2 className="text-indigo-400 animate-spin" size={20} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm text-slate-100">Analyzing your document</h3>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">
                  {ANALYZING_STEPS[loadingStep]}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analyze;