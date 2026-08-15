import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X 
} from "lucide-react";

const Analyze = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("PDF size must be smaller than 5 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload your resume to continue.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a target job description.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await api.post("/analysis/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Analysis success:", response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Radial Spotlights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">ResumeAI</span>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Tailored AI Matcher
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Analyze Your Resume
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Upload your resume PDF and paste the target job description to run real-time ATS optimization.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-8 backdrop-blur-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: File Drag & Drop Upload */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
            <label className="block text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              1. Upload PDF Resume
            </label>
            <p className="text-slate-400 text-xs md:text-sm mb-6">
              Only PDF format is accepted (Max size: 5 MB).
            </p>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center transition-all duration-200 cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Click to upload or drag & drop PDF
                </h3>
                <p className="text-slate-500 text-xs">
                  Supported format: .pdf
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-colors"
                  title="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Job Description Input */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
            <label className="block text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              2. Target Job Description
            </label>
            <p className="text-slate-400 text-xs md:text-sm mb-4">
              Paste the job posting responsibilities and requirements below.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job title, responsibilities, and key skills here..."
              rows={10}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm leading-relaxed resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-white" />
                <span>Running AI Analysis...</span>
              </>
            ) : (
              <>
                <span>Analyze Resume Now</span>
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Analyze;