export default function ProductSkeleton() {
    return (
        <div className="rounded-xl border border-autumn-border bg-white overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-autumn-surface" />
            <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-autumn-surface rounded w-3/4" />
                <div className="h-3 bg-autumn-surface rounded w-1/2" />
                <div className="h-5 bg-autumn-surface rounded w-1/4" />
            </div>
        </div>
    )
}
