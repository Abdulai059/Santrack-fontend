"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Droplets } from "lucide-react";

/* ── WASH-themed inline SVG illustration ── */
function WashIllustration() {
  return (
    <svg
      viewBox="0 0 420 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="210" cy="420" rx="160" ry="18" fill="#9dc43b" opacity="0.15" />

      {/* Central shield / coverage icon */}
      <path
        d="M210 55 L270 80 L270 155 C270 195 242 228 210 240 C178 228 150 195 150 155 L150 80 Z"
        fill="#9dc43b"
        opacity="0.15"
        stroke="#9dc43b"
        strokeWidth="2"
      />
      <path
        d="M210 70 L258 91 L258 155 C258 188 236 216 210 226 C184 216 162 188 162 155 L162 91 Z"
        fill="#9dc43b"
        opacity="0.25"
      />
      {/* Checkmark inside shield */}
      <path
        d="M192 150 L204 162 L228 138"
        stroke="#16a34a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ripple rings */}
      <ellipse cx="210" cy="248" rx="30" ry="9" stroke="#9dc43b" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="210" cy="248" rx="48" ry="14" stroke="#9dc43b" strokeWidth="1" fill="none" opacity="0.3" />
      <ellipse cx="210" cy="248" rx="66" ry="19" stroke="#9dc43b" strokeWidth="0.8" fill="none" opacity="0.15" />

      {/* Map card */}
      <rect x="60" y="270" width="300" height="120" rx="18" fill="#f0fdf4" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Grid */}
      <line x1="60" y1="300" x2="360" y2="300" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      <line x1="60" y1="330" x2="360" y2="330" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      <line x1="60" y1="360" x2="360" y2="360" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      <line x1="140" y1="270" x2="140" y2="390" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      <line x1="210" y1="270" x2="210" y2="390" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      <line x1="280" y1="270" x2="280" y2="390" stroke="#9dc43b" strokeWidth="0.8" opacity="0.35" />
      {/* Pins */}
      <path d="M160 295 C156 295 153 298 153 302 C153 307 160 314 160 314 C160 314 167 307 167 302 C167 298 164 295 160 295Z" fill="#9dc43b" />
      <circle cx="160" cy="302" r="2.5" fill="white" />
      <path d="M240 318 C236 318 233 321 233 325 C233 330 240 337 240 337 C240 337 247 330 247 325 C247 321 244 318 240 318Z" fill="#ef4444" />
      <circle cx="240" cy="325" r="2.5" fill="white" />
      <path d="M300 285 C296 285 293 288 293 292 C293 297 300 304 300 304 C300 304 307 297 307 292 C307 288 304 285 300 285Z" fill="#f59e0b" />
      <circle cx="300" cy="292" r="2.5" fill="white" />

      {/* Left stat badge */}
      <rect x="18" y="155" width="128" height="70" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="42" cy="180" r="10" fill="#dcfce7" />
      <path d="M38 180 L41 183 L47 177" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="58" y="177" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#111827">Districts</text>
      <text x="58" y="191" fontFamily="system-ui" fontSize="10" fill="#6b7280">Covered</text>
      <text x="42" y="212" fontFamily="system-ui" fontSize="22" fontWeight="800" fill="#9dc43b">16</text>

      {/* Right stat badge */}
      <rect x="274" y="155" width="128" height="70" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="298" cy="180" r="10" fill="#fef3c7" />
      <path d="M298 175 L298 181 M298 183 L298 185" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <text x="314" y="177" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="#111827">Operators</text>
      <text x="314" y="191" fontFamily="system-ui" fontSize="10" fill="#6b7280">Active</text>
      <text x="298" y="212" fontFamily="system-ui" fontSize="22" fontWeight="800" fill="#f59e0b">5</text>

      {/* Bottom label */}
      <text x="210" y="408" textAnchor="middle" fontFamily="system-ui" fontSize="13" fontWeight="600" fill="#4b5563">
        Join the WASH monitoring network
      </text>
    </svg>
  );
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password);
    if (!error) {
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          ref={modalRef}
          className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zm-7 7a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">Join SaniTrack today</p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-sm text-stone-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── RIGHT — Illustration panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-[#f0fdf4] rounded-l-[2.5rem] px-12 py-16 relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-200 opacity-20" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-teal-300 opacity-15" />

        <WashIllustration />

        <div className="mt-8 text-center relative z-10">
          <h2 className="text-xl font-bold text-stone-800 leading-snug">
            Built for WASH professionals.
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">
            Coordinate field operators, district officers, and NGOs on one unified platform.
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-emerald-200" />
          <span className="w-2 h-2 rounded-full bg-emerald-200" />
          <span className="w-6 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
