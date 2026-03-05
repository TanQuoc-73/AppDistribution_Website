"use client"

import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const stats = [
    { label: "Total Users", value: "12,483", icon: "👥", color: "from-blue-500 to-cyan-400" },
    { label: "Total Products", value: "356", icon: "📦", color: "from-purple-500 to-pink-400" },
    { label: "Total Sales", value: "$48,290", icon: "💰", color: "from-emerald-500 to-teal-400" },
]

const navItems = [
    { label: "Products", href: "/dashboard/products", icon: "📦" },
    { label: "Orders", href: "/dashboard/orders", icon: "🧾" },
    { label: "Users", href: "/dashboard/users", icon: "👥" },
]

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white shadow-lg`}
                        >
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <p className="text-sm font-medium opacity-90">{s.label}</p>
                            <p className="text-3xl font-extrabold mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                        >
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-900">Manage {item.label}</p>
                                <p className="text-xs text-gray-400">View and manage {item.label.toLowerCase()}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

            <Footer />
        </main>
    )
}
