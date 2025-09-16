"use client";
import React from "react";

const LoginForm = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("admin_utama");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("@/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }), 
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.success) {
        setSuccess(result.message);
        localStorage.setItem("adminData", JSON.stringify(result.data));

        if (result.data.role === "admin_utama") {
          window.location.href = "/admin_utama/dashboard";
        } else if (result.data.role === "admin_timkerja") {
          window.location.href = "/admin_timkerja/dashboard";
        }
      } else {
        setError(result?.message || result?.error || "Login gagal");
      }
    } catch (err) {
      setError("Gagal menghubungi server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label><br />
        <input
          id="username"
          type="text"
          placeholder="Masukkan Username Anda"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label><br />
        <input
          id="password"
          type="password"
          placeholder="Masukkan Password Anda"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="role">Pilih login sebagai: </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          disabled={loading}
        >
          <option value="admin_utama">Admin Utama</option>
          <option value="admin_timkerja">Admin Tim Kerja</option>
        </select>
      </div>

      {error && <p style={{color:'tomato'}}>{error}</p>}
      {success && <p style={{color:'limegreen'}}>{success}</p>}

      <div>
        <button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
