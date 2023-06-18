import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { FC, useRef } from 'react'
import EditorOutput from './EditorOutput'

interface PostProps {
  subredditName: string
  post: Post & {
    author: User
    votes: Vote[]
  }
  commentAmt: number
}

const Post: FC<PostProps> = ({ subredditName, post, commentAmt }) => {
  const pRef = useRef<HTMLDivElement>(null)
  return (
    <div className="bg-white rounded-md shadow">
      <div className="flex justify-between px-6 py-4">
        {/* TODO : PostVotes */}

        <div className="flex-1 w-0">
          <div className="mt-1 text-xs text-gray-500 max-h-40">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="text-sm underline text-zinc-900 underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>
              Posted by u/{post.author.name}{' '}
              <span>{formatTimeToNow(post.createdAt)}</span>
            </span>
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-600">
              {post.title}
            </h1>
          </a>
          <div
            className="relative w-full text-sm max-h-40 overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="z-20 p-4 px-4 text-sm bg-gray-50 sm:px-6">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center gap-2 w-fit"
        >
          <MessageSquare className="w-4 h-4" />
          {commentAmt} {commentAmt === 1 ? 'comment' : 'comments'}
        </a>
      </div>
    </div>
  )
}

export default Post
