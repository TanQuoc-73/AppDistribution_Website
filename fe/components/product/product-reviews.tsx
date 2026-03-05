"use client"

import { useState } from "react"
import ReviewCard from "./review-card"

type Review = {
    user: string
    rating: number
    comment: string
    date: string
}

type Props = {
    reviews: Review[]
}

export default function ProductReviews({ reviews: initialReviews }: Props) {
    const [reviews, setReviews] = useState(initialReviews)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) return

        const newReview: Review = {
            user: "You",
            rating,
            comment: comment.trim(),
            date: new Date().toISOString().split("T")[0],
        }
        setReviews([newReview, ...reviews])
        setComment("")
        setRating(5)
    }

    return (
        <section>
            <h2 className="text-2xl font-semibold text-autumn-text mb-6">
                Reviews ({reviews.length})
            </h2>

            {/* Submit review form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-autumn-border p-6 shadow-[0_2px_12px_rgba(197,106,58,0.06)] mb-6">
                <h3 className="font-semibold text-autumn-text mb-3">Write a Review</h3>

                <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 transition-colors duration-150 ${s <= rating ? "text-amber-400" : "text-autumn-border"} hover:text-amber-300`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience…"
                    className="w-full px-4 py-3 rounded-lg border border-autumn-border text-sm text-autumn-text focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition-all duration-200 resize-none mb-3"
                />

                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-autumn-primary text-white text-sm font-semibold hover:bg-autumn-primary-hover transition-colors duration-200"
                >
                    Submit Review
                </button>
            </form>

            {/* Review list */}
            <div className="space-y-4">
                {reviews.map((r, idx) => (
                    <ReviewCard key={idx} user={r.user} rating={r.rating} comment={r.comment} date={r.date} />
                ))}
            </div>
        </section>
    )
}
