import Link from 'next/link'

const states = [
  { name: 'Utah', slug: 'utah', count: 87 },
  // Add more states here as you expand
]

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">
        Pickleball Playgrounds
      </h1>
      <p className="text-gray-400 mb-10">
        Find pickleball courts across the United States. Browse by state.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((state) => (
          <Link
            key={state.slug}
            href={`/${state.slug}`}
            className="block border-2 border-gray-200 rounded-xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-green-400 hover:shadow-green-900/30"
          >
            <h2 className="text-xl font-semibold text-white mb-1">{state.name}</h2>
            <p className="text-gray-400 text-sm">{state.count} courts</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
