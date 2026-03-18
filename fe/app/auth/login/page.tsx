"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const login = useAuthStore((s) => s.login)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }
        setLoading(true)
        try {
            const res = await userService.login(email, password)
            login(res.user, res.accessToken, res.refreshToken)
            router.push("/")
        } catch (err: any) {
            const message = err?.response?.data?.message ?? "Invalid email or password"
            setError(Array.isArray(message) ? message.join(", ") : String(message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-autumn-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-autumn-accent">🍂 AppStore</Link>
                    <h1 className="text-3xl font-bold text-autumn-text mt-4">Welcome back</h1>
                    <p className="text-autumn-muted mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-autumn-border p-8 shadow-[0_2px_12px_rgba(197,106,58,0.06)] space-y-5">

                    {error && (
                        <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm">{error}</div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-autumn-text mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-autumn-border text-sm text-autumn-text focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-autumn-text mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-autumn-border text-sm text-autumn-text focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-autumn-primary text-white font-semibold hover:bg-autumn-primary-hover transition-colors duration-200 disabled:opacity-60"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>

                </form>

                <p className="text-center text-sm text-autumn-muted mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-autumn-primary font-medium hover:text-autumn-primary-hover hover:underline transition-colors duration-200">
                        Register
                    </Link>
                </p>

            </div>
        </main>
    )
}
