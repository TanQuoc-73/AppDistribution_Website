import Link from "next/link"

type Props = {
    title?: string
    message?: string
    retry?: () => void
}

export default function ErrorDisplay({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again.",
    retry,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-autumn-text mb-2">{title}</h2>
            <p className="text-autumn-muted mb-6 max-w-md">{message}</p>

            <div className="flex gap-3">
                {retry && (
                    <button
                        onClick={retry}
                        className="px-6 py-2.5 rounded-lg bg-autumn-primary text-white font-semibold text-sm hover:bg-autumn-primary-hover transition-colors duration-200"
                    >
                        Try Again
                    </button>
                )}
                <Link
                    href="/"
                    className="px-6 py-2.5 rounded-lg border border-autumn-border text-sm font-semibold text-autumn-text hover:bg-autumn-surface transition-colors duration-200"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
