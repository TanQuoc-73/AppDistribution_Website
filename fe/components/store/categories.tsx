import Link from "next/link"

const categories = [
  {
    name: "Game",
    slug: "game",
    icon: "🎮",
    color: "from-[#C56A3A] to-[#D9A066]",
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    icon: "🛠️",
    color: "from-[#7A4E2D] to-[#A67C52]",
  },
  {
    name: "AI Tools",
    slug: "ai-tools",
    icon: "🤖",
    color: "from-[#8B6F47] to-[#C49A6C]",
  },
  {
    name: "Office",
    slug: "office",
    icon: "📊",
    color: "from-[#6B7F3A] to-[#9BAF6B]",
  },
  {
    name: "Design",
    slug: "design",
    icon: "🎨",
    color: "from-[#B8734A] to-[#E0A96F]",
  },
]

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-autumn-text">
          Categories
        </h2>
        <span className="text-xl">🍂</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/store/category/${c.slug}`}
            className="group relative rounded-xl overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${c.color} p-6 flex flex-col items-center justify-center gap-3 h-36 transition-all duration-250 group-hover:scale-[1.03] group-hover:shadow-lg`}>
              <span className="text-4xl">{c.icon}</span>
              <span className="text-white font-semibold text-sm tracking-wide">
                {c.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}