"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("recepcion@odontoclinic.com");
  const [password, setPassword] = useState("recepcion123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Credenciales inválidas");
      setLoading(false);
      return;
    }

    const user = await res.json();
    if (user.role === "ADMIN") router.push("/admin");
    else if (user.role === "ODONTOLOGO") router.push("/recepcion");
    else router.push("/recepcion");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-primary">Acceso Staff</h1>
        <p className="mt-1 text-sm text-secondary">Odontoclinic — Panel interno</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-secondary">
          <p className="font-medium text-primary">Usuarios demo:</p>
          <p>admin@odontoclinic.com / admin123</p>
          <p>recepcion@odontoclinic.com / recepcion123</p>
          <p>dr.zurita@odontoclinic.com / doctor123</p>
        </div>
      </div>
    </div>
  );
}
