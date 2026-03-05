"use client"

import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import DownloadButton from "@/components/library/download-button"

const purchasedApps = [
    { id: 1, name: "AI Image Generator", image: "/images/app1.jpg", version: "2.4.1" },
    { id: 2, name: "Code Editor Pro", image: "/images/app2.jpg", version: "5.1.0" },
    { id: 3, name: "Cloud Storage Plus", image: "/images/app3.jpg", version: "1.8.3" },
]

export default function LibraryPage() {
    // Mock: In production, fetch from API based on logged-in user
    const apps = purchasedApps

    if (apps.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">📚</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your library is empty</h1>
                    <p className="text-gray-500">Purchase apps from the store to see them here.</p>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Library</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
                            <img src={app.image} alt={app.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                                <p className="text-xs text-gray-400">v{app.version}</p>
                            </div>
                            <DownloadButton appId={app.id} />
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    )
}
