type Props = {
  name: string
  price: number
  image: string
}

export default function ProductCard({ name, price, image }: Props) {
  return (
    <div className="border border-autumn-border rounded-xl p-3 bg-white shadow-[0_2px_12px_rgba(197,106,58,0.06)] hover:shadow-[0_8px_30px_rgba(197,106,58,0.12)] transition-all duration-250">

      <img
        src={image}
        className="w-full h-40 object-cover rounded-lg"
      />

      <h3 className="mt-2 font-semibold text-autumn-text">
        {name}
      </h3>

      <p className="text-sm text-autumn-accent font-semibold">
        ${price}
      </p>

    </div>
  )
}