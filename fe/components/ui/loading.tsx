export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-autumn-secondary/30 border-t-autumn-primary rounded-full animate-spin" />
        </div>
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="rounded-xl border border-autumn-border bg-white overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-autumn-surface" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-autumn-surface rounded w-3/4" />
                <div className="h-3 bg-autumn-surface rounded w-1/2" />
                <div className="h-4 bg-autumn-surface rounded w-1/3" />
            </div>
        </div>
    )
}

export function ProductPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <div className="rounded-xl bg-autumn-surface aspect-[4/3]" />
                    <div className="flex gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-24 h-18 rounded-lg bg-autumn-surface" />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 bg-autumn-surface rounded w-2/3" />
                    <div className="h-4 bg-autumn-surface rounded w-1/3" />
                    <div className="h-5 bg-autumn-surface rounded w-1/4" />
                    <div className="h-10 bg-autumn-surface rounded w-1/3" />
                    <div className="flex gap-3 mt-4">
                        <div className="flex-1 h-12 bg-autumn-surface rounded-xl" />
                        <div className="flex-1 h-12 bg-autumn-surface rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Loading() {
    return <LoadingSpinner />
}
