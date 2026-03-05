"use client"

import { useState } from "react"

export default function DownloadButton({ appId }: { appId: number }) {
    const [state, setState] = useState<"idle" | "downloading" | "done">("idle")
    const [progress, setProgress] = useState(0)

    const handleDownload = () => {
        // Mock: verify license then start download
        setState("downloading")
        setProgress(0)

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setState("done")
                    return 100
                }
                return prev + 10
            })
        }, 200)
    }

    if (state === "done") {
        return (
            <button className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold cursor-default">
                ✓ Downloaded
            </button>
        )
    }

    if (state === "downloading") {
        return (
            <div className="flex flex-col items-center gap-1 min-w-[100px]">
                <div className="w-full h-2 bg-autumn-surface rounded-full overflow-hidden">
                    <div
                        className="h-full bg-autumn-primary rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs text-autumn-muted">{progress}%</span>
            </div>
        )
    }

    return (
        <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-autumn-primary text-white text-sm font-semibold hover:bg-autumn-primary-hover transition-colors duration-200"
        >
            ↓ Download
        </button>
    )
}
