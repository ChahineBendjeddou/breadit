import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string
  }
}
const Page = async ({ params: { slug } }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  })
  if (!subreddit) return notFound()
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2 felx">
          <h3 className="mt-2 ml-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="mt-1 ml-2 text-sm text-gray-500 truncate">
            in r/{slug}
          </p>
        </div>
      </div>
      <Editor subredditId={subreddit.id} />
    </div>
  )
}

export default Page
