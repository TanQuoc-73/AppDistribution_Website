"use client"

import { useState, useRef } from "react"

type UploadedFile = {
    name: string
    url: string
    type: "screenshot" | "thumbnail" | "installer"
}

type Props = {
    onUpload?: (file: UploadedFile) => void
}

export default function UploadAssets({ onUpload }: Props) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [uploading, setUploading] = useState(false)
    const [fileType, setFileType] = useState<UploadedFile["type"]>("screenshot")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        // Mock: In production, upload to Supabase Storage
        await new Promise((resolve) => setTimeout(resolve, 1200))

        const uploaded: UploadedFile = {
            name: file.name,
            url: URL.createObjectURL(file),
            type: fileType,
        }

        setFiles((prev) => [...prev, uploaded])
        onUpload?.(uploaded)
        setUploading(false)

        // Reset input
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-autumn-text">Upload Assets</h3>

            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as UploadedFile["type"])}
                    className="px-4 py-2.5 rounded-lg border border-autumn-border bg-white text-sm text-autumn-text focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition-all duration-200"
                >
                    <option value="screenshot">Screenshot</option>
                    <option value="thumbnail">Thumbnail</option>
                    <option value="installer">Installer</option>
                </select>

                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-autumn-border bg-autumn-surface/50 text-sm text-autumn-muted cursor-pointer hover:border-autumn-primary hover:bg-autumn-primary/5 transition-all duration-200">
                    <input
                        ref={inputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept={fileType === "installer" ? "*" : "image/*"}
                    />
                    {uploading ? "Uploading…" : "Choose file"}
                </label>
            </div>

            {/* Uploaded files list */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white rounded-lg border border-autumn-border p-3 text-sm">
                            {f.type !== "installer" && (
                                <img src={f.url} alt={f.name} className="w-10 h-10 rounded-lg object-cover" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-autumn-text truncate">{f.name}</p>
                                <p className="text-xs text-autumn-muted capitalize">{f.type}</p>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium">✓ Uploaded</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
