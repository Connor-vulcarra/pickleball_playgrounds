import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const { data: states } = await supabase
    .from('courts')
    .select('state_slug')
    .eq('status', 'published')

  const uniqueStates = [...new Set(states?.map(s => s.state_slug) || [])]
  
  return uniqueStates.map(state => ({ state }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params

  const { data: courts } = await supabase
    .from('courts')
    .select('state')
    .eq('state_slug', state)
    .eq('status', 'published')
    .limit(1)
    .single()

  if (!courts) return {}

  const stateName = courts.state

  return {
    title: `Pickleball Courts in ${stateName} | Pickleball Playgrounds`,
    description: `Find pickleball courts across ${stateName}. Browse free and paid indoor and outdoor courts by city.`,
  }
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params

  const { data: courts } = await supabase
    .from('courts')
    .select('*')
    .eq('state_slug', state)
    .eq('status', 'published')
    .order('city', { ascending: true })

  if (!courts || courts.length === 0) notFound()

  const stateName = courts[0]?.state || state

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold text-white mb-2">
        Pickleball Courts in {stateName}
      </h1>
      <p className="text-gray-200 mb-8">
        Browse {courts.length} pickleball courts across {stateName}. Filter by city, indoor/outdoor, and free or paid.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <Link
            key={court.id}
            href={`/${state}/${court.slug}`}
            className="block border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-green-400 hover:shadow-green-900/30"
          >
            {court.image_url ? (
              <img
                src={court.image_url}
                alt={court.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold text-gray-white text-sm mb-1 leading-tight">
                {court.name}
              </h2>
              <p className="text-gray-400 text-xs mb-3">{court.city}</p>

              <div className="flex flex-wrap gap-1">
                {court.indoor_outdoor && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full capitalize">
                    {court.indoor_outdoor}
                  </span>
                )}
                {court.price_type && (
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    court.price_type === 'free'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {court.price_type}
                  </span>
                )}
                {court.num_courts && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    {court.num_courts} {court.num_courts === 1 ? 'court' : 'courts'}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </main>
  )
}