import { useState } from "react";
import { X } from "lucide-react";
import { todayStr, nowTimeStr, inputStyle } from "../lib/helpers";
import { supabase } from "../supabaseClient";

export function ModalShell({ title, onClose, children, dismissible = true }) {
  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      style={{ background: "rgba(46,42,38,0.4)" }}
    >
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6" style={{ background: "#FFFCF7" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold" style={{ color: "#2E2A26" }}>
            {title}
          </h3>
          {dismissible && (
            <button onClick={onClose} aria-label="Close">
              <X size={18} color="#6B6259" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function FeedModal({ onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [food, setFood] = useState("");
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState(nowTimeStr());
  return (
    <ModalShell title="Log a feeding" onClose={onClose}>
      <div className="space-y-3">
        <input
          placeholder="Amount (optional, e.g. 1/4 cup)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={inputStyle}
        />
        <input
          placeholder="Food (optional, e.g. wet food)"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={inputStyle}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="14:30"
              className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <button
          onClick={() => {
            let ts;
            try {
              ts = new Date(`${date}T${time}:00`).toISOString();
              if (ts === "Invalid Date") throw new Error("bad date");
            } catch (e) {
              ts = new Date().toISOString();
            }
            onSubmit({ amount: amount || null, food: food || null, time: ts });
          }}
          className="w-full py-2.5 rounded-lg font-semibold text-sm"
          style={{ background: "#E2793D", color: "#FFFCF7" }}
        >
          Save
        </button>
      </div>
    </ModalShell>
  );
}

export function WeightModal({ onClose, onSubmit }) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(todayStr());
  return (
    <ModalShell title="Add a weigh-in" onClose={onClose}>
      <div className="space-y-3">
        <input
          type="number"
          step="0.01"
          placeholder="Weight (kg)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={inputStyle}
        />
        <div>
          <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
            Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <button
          onClick={() => onSubmit({ value: parseFloat(value), date })}
          className="w-full py-2.5 rounded-lg font-semibold text-sm"
          style={{ background: "#E2793D", color: "#FFFCF7" }}
        >
          Save
        </button>
      </div>
    </ModalShell>
  );
}

export function MilestoneModal({ onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayStr());
  return (
    <ModalShell title="Add a milestone" onClose={onClose}>
      <div className="space-y-3">
        <input
          placeholder="e.g. First solo litter box use"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
          style={inputStyle}
        />
        <div>
          <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
            Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <button
          onClick={() => onSubmit({ description, date })}
          className="w-full py-2.5 rounded-lg font-semibold text-sm"
          style={{ background: "#E2793D", color: "#FFFCF7" }}
        >
          Save
        </button>
      </div>
    </ModalShell>
  );
}

export function GroomModal({ onClose, onSubmit }) {
  const kinds = ["Brushing", "Nail trim", "Bath", "Ear clean"];
  return (
    <ModalShell title="Log grooming" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => onSubmit({ kind: k })}
            className="py-2.5 rounded-lg font-semibold text-sm"
            style={{ background: "#E1DCF3", color: "#5B4E96" }}
          >
            {k}
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

export function SettingsModal({ profile, onClose, onSubmit }) {
  const [name, setName] = useState(profile?.name || "Laila");
  const [birthdate, setBirthdate] = useState(profile?.birthdate || "");
  return (
    <ModalShell title="Kitten settings" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>
            Birthdate
          </label>
          <input
            type="text"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <button
          onClick={() => onSubmit({ name, birthdate: birthdate || null })}
          className="w-full py-2.5 rounded-lg font-semibold text-sm"
          style={{ background: "#E2793D", color: "#FFFCF7" }}
        >
          Save
        </button>
      </div>
    </ModalShell>
  );
}

export function SignUpModal({ onClose, onShowLogin, dismissible = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords don't match yet.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
  };

  return (
    <ModalShell title={success ? "Check your inbox" : "Create an account"} onClose={onClose} dismissible={dismissible}>
      {success ? (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: "#EEF3EB", color: "#4E6B45" }}>
            <p className="font-semibold text-sm mb-1">One last little step</p>
            <p className="text-sm leading-relaxed">
              We sent a confirmation link to <strong>{email.trim()}</strong>. Open it to finish creating your account.
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-full py-2.5 rounded-lg font-semibold text-sm" style={{ background: "#E2793D", color: "#FFFCF7" }}>
            Got it
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "#6B6259" }}>
            Make an account to keep Laila's stories close and private.
          </p>
          <div>
            <label htmlFor="signup-email" className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>Email</label>
            <input id="signup-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2" style={{ ...inputStyle, ["--tw-ring-color"]: "#E2793D" }} />
          </div>
          <div>
            <label htmlFor="signup-password" className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>Password</label>
            <input id="signup-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2" style={{ ...inputStyle, ["--tw-ring-color"]: "#E2793D" }} />
          </div>
          <div>
            <label htmlFor="signup-confirm-password" className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>Confirm password</label>
            <input id="signup-confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Type it once more" className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2" style={{ ...inputStyle, ["--tw-ring-color"]: "#E2793D" }} />
          </div>
          {error && <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "#FBEAEA", color: "#B84A4A" }} role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60" style={{ background: "#E2793D", color: "#FFFCF7" }}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-xs" style={{ color: "#6B6259" }}>
            Already have an account?{" "}
            <button type="button" onClick={onShowLogin} className="font-semibold underline underline-offset-2" style={{ color: "#B85F30" }}>
              Sign in
            </button>
          </p>
        </form>
      )}
    </ModalShell>
  );
}

export function LoginModal({ onShowSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) setError("We couldn't sign you in. Check your email and password.");
  };

  return (
    <ModalShell title="Welcome back" dismissible={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: "#6B6259" }}>
          Sign in to visit Laila's command center.
        </p>
        <div>
          <label htmlFor="login-email" className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>Email</label>
          <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2" style={{ ...inputStyle, ["--tw-ring-color"]: "#E2793D" }} />
        </div>
        <div>
          <label htmlFor="login-password" className="text-xs font-mono block mb-1" style={{ color: "#6B6259" }}>Password</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full block px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2" style={{ ...inputStyle, ["--tw-ring-color"]: "#E2793D" }} />
        </div>
        {error && <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "#FBEAEA", color: "#B84A4A" }} role="alert">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60" style={{ background: "#E2793D", color: "#FFFCF7" }}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs" style={{ color: "#6B6259" }}>
          New here?{" "}
          <button type="button" onClick={onShowSignUp} className="font-semibold underline underline-offset-2" style={{ color: "#B85F30" }}>
            Create an account
          </button>
        </p>
      </form>
    </ModalShell>
  );
}
