import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata = {
  title: 'Pickleball Courts in Utah | Pickleball Playgrounds',
  description: 'Find pickleball courts across Utah. Browse free and paid indoor and outdoor courts by city.',
}

export default async function UtahPage() {
  const { data: courts } = await supabase
    .from('courts')
    .select('*')
    .eq('state_slug', 'utah')
    .order('city', { ascending: true })

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Pickleball Courts in Utah
      </h1>
      <p className="text-gray-500 mb-8">
        Browse {courts?.length ?? 0} pickleball courts across Utah. Filter by city, indoor/outdoor, and free or paid.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts?.map((court) => (
          <Link
            key={court.id}
            href={`/utah/${court.slug}`}
            className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {court.image_url ? (
              <img
                src={court.image_url}
                alt={court.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
                {court.name}
              </h2>
              <p className="text-gray-500 text-xs mb-3">{court.city}</p>

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