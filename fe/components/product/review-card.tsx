"use client"

type ReviewCardProps = {
    user: string
    rating: number
    comment: string
    date: string
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-autumn-border"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

export default function ReviewCard({ user, rating, comment, date }: ReviewCardProps) {
    return (
        <div className="bg-white rounded-xl border border-autumn-border p-6 shadow-[0_2px_12px_rgba(197,106,58,0.06)]">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-autumn-secondary/20 flex items-center justify-center font-bold text-autumn-accent">
                        {user[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-autumn-text">{user}</p>
                        <p className="text-xs text-autumn-muted">{date}</p>
                    </div>
                </div>
                <Stars rating={rating} />
            </div>
            <p className="text-autumn-muted text-sm leading-relaxed">{comment}</p>
        </div>
    )
}
