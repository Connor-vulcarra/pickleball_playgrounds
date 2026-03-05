import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CourtsGrid from './CourtsGrid'

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
    .order('name', { ascending: true })

  if (!courts || courts.length === 0) notFound()

  const stateName = courts[0]?.state || state

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white text-sm mb-6 transition-colors duration-200">
        ← All States
      </Link>

      <h1 className="text-4xl font-bold text-white mb-2">
        Pickleball Courts in {stateName}
      </h1>
      <p className="text-gray-200 mb-8">
        Browse {courts.length} pickleball courts across {stateName}. Filter by price, indoor, outdoor, free or paid.
      </p>

      <CourtsGrid courts={courts} state={state} />
    </main>
  )
}