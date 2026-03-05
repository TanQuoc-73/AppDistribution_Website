import Link from "next/link"

/* Inline SVG leaf shapes for the hero decoration */
function FallingLeaves() {
  const leaves = [
    { left: "10%", delay: "0s", duration: "12s", size: 18, opacity: 0.15 },
    { left: "25%", delay: "3s", duration: "15s", size: 14, opacity: 0.1 },
    { left: "45%", delay: "1s", duration: "11s", size: 20, opacity: 0.12 },
    { left: "65%", delay: "5s", duration: "14s", size: 16, opacity: 0.1 },
    { left: "80%", delay: "2s", duration: "13s", size: 12, opacity: 0.15 },
    { left: "90%", delay: "4s", duration: "16s", size: 15, opacity: 0.08 },
  ]

  return (
    <>
      {leaves.map((leaf, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: leaf.left,
            top: "-20px",
            width: leaf.size,
            height: leaf.size,
            opacity: leaf.opacity,
            animation: `leaf-fall ${leaf.duration} ${leaf.delay} infinite ease-in-out`,
          }}
          viewBox="0 0 24 24"
          fill="#C56A3A"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.7 9.72-11H22l-1.5-3.59L17 8z" />
        </svg>
      ))}
    </>
  )
}

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF6F1] via-[#F5E6D3] to-[#EACDAB]">

      {/* Decorative warm circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-autumn-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-autumn-secondary/8 rounded-full blur-3xl" />

      {/* Falling leaves */}
      <FallingLeaves />

      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40 flex flex-col items-center text-center gap-6">

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-autumn-text tracking-tight leading-tight">
          Discover Amazing Software
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-autumn-muted font-medium leading-relaxed">
          Browse thousands of apps, tools, and games — curated for developers, designers, and everyone in between.
        </p>

        <Link
          href="/store"
          className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-autumn-primary text-white font-semibold text-base shadow-lg hover:bg-autumn-primary-hover hover:shadow-xl hover:scale-105 transition-all duration-250"
        >
          Browse Store
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>

      </div>

    </section>
  )
}