import { supabase } from '@/lib/supabase'

export default async function sitemap() {
  const { data: courts } = await supabase
    .from('courts')
    .select('state_slug, slug')
    .eq('status', 'published')

  const courtUrls = courts?.map((court) => ({
    url: `https://pickleballplaygrounds.com/${court.state_slug}/${court.slug}`,
    lastModified: new Date(),
  })) ?? []

  const stateUrls = [...new Set(courts?.map(c => c.state_slug) || [])].map((state) => ({
    url: `https://pickleballplaygrounds.com/${state}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: 'https://pickleballplaygrounds.com',
      lastModified: new Date(),
    },
    ...stateUrls,
    ...courtUrls,
  ]
}