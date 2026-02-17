export const dynamic = 'force-static'

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface Court {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  lat: number
  lng: number
  indoor_outdoor: string
  price_type: string
  num_courts: number
  description: string
  image_url: string
  lighting: boolean
  featured: boolean
}

export async function generateStaticParams() {
  const { data: courts } = await supabase
    .from('courts')
    .select('slug')
    .eq('state_slug', 'utah')

  return courts?.map((court) => ({ slug: court.slug })) ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: court } = await supabase
    .from('courts')
    .select('name, city, description')
    .eq('slug', slug)
    .single()

  if (!court) return {}

  return {
    title: `${court.name} | Pickleball Courts in ${court.city}, Utah`,
    description: `Find details about ${court.name} in ${court.city}, Utah. Court info, location, and more.`,
  }
}

export default async function CourtPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: court } = await supabase
    .from('courts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!court) notFound()

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${court.lat},${court.lng}`

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">

      {court.image_url && (
        <img
          src={court.image_url}
          alt={court.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{court.name}</h1>

      <p className="text-gray-500 mb-4">{court.city}, {court.state}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {court.indoor_outdoor && (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
            {court.indoor_outdoor}
          </span>
        )}
        {court.price_type && (
          <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${
            court.price_type === 'free'
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {court.price_type}
          </span>
        )}
        {court.num_courts && (
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {court.num_courts} {court.num_courts === 1 ? 'Court' : 'Courts'}
          </span>
        )}
        {court.lighting && (
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            Lights Available
          </span>
        )}
      </div>

      {court.address && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Address</h2>
          <p className="text-gray-600">{court.address}</p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 hover:underline text-sm"
          >
            Get Directions
          </a>
        </div>
      )}

      {court.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">About</h2>
          <p className="text-gray-600 leading-relaxed">{court.description}</p>
        </div>
      )}

      <a href="/utah" className="text-blue-600 hover:underline text-sm">
        Back to all Utah courts
      </a>

    </main>
  )
}