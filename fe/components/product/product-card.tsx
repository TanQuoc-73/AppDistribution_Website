import Link from "next/link"

type Props = {
  id: number
  name: string
  price: number
  image: string
  rating?: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${star <= Math.round(rating) ? "text-amber-400" : "text-autumn-border"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-autumn-muted">{Number(rating).toFixed(1)}</span>
    </div>
  )
}

export default function ProductCard({ id, name, price, image, rating }: Props) {
  return (
    <Link href={`/store/product/${id}`} className="group block">
      <div className="rounded-xl border border-autumn-border bg-white overflow-hidden shadow-[0_2px_12px_rgba(197,106,58,0.06)] hover:shadow-[0_8px_30px_rgba(197,106,58,0.12)] hover:-translate-y-1 transition-all duration-250">

        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-autumn-surface">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">

          <h3 className="font-semibold text-autumn-text text-sm leading-snug line-clamp-1 group-hover:text-autumn-primary transition-colors duration-200">
            {name}
          </h3>

          {rating !== undefined && <StarRating rating={rating} />}

          <p className="text-base font-bold text-autumn-accent">
            ${Number(price).toFixed(2)}
          </p>

        </div>

      </div>
    </Link>
  )
}