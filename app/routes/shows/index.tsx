import { createFileRoute } from '@tanstack/react-router'
import clpCss from '~/styles/cat-landing.scss?url'
import { seo } from '~/utils/seo'

import CategoryLanding from '~/components/media/CategoryLanding'

export const Route = createFileRoute('/shows/')({
  head: () => ({
    meta: [
      ...seo({
        title: 'Shows By Category | Prometheus 2.0',
        description: `Prometheus 2.0 is a a study in the use of the TMDB.org API to create a movie and TV show database.`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: clpCss }
    ]
  }),
  component: Show,
})

function Show() {
  return <CategoryLanding mediaType="Shows" />
}
