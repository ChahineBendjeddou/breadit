import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { PostVoteValidator } from '@/lib/validators/vote'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote, VoteType } from '@prisma/client'
import { z } from 'zod'

const CACHE_AFTER_VOTES = 1
export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { postId, voteType } = PostVoteValidator.parse(body)

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!post) return new Response('Post not found', { status: 404 })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
        return new Response('Vote removed.')
      }
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })

      cachePost({ votesAmt: recountVotes(post), post, voteType })

      return new Response('Vote updated.')
    }

    await db.vote.create({
      data: {
        type: voteType,
        postId,
        userId: session.user.id,
      },
    })

    cachePost({ votesAmt: recountVotes(post), post, voteType })

    return new Response('Vote created.')
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response('Invalid request data passed', { status: 422 })
    return new Response(
      'Could not register your vote, please try again later',
      {
        status: 500,
      }
    )
  }
}

//Helpers
function recountVotes(post: Post & { votes: Vote[] }): number {
  return post.votes.reduce((acc, vote) => {
    if (vote.type === 'UP') return acc + 1
    if (vote.type === 'DOWN') return acc - 1
    return acc
  }, 0)
}

type cachePostType = {
  votesAmt: number
  post: Post & { votes: Vote[]; author: User }
  voteType: VoteType
}
async function cachePost({ votesAmt, post, voteType }: cachePostType) {
  if (votesAmt >= CACHE_AFTER_VOTES) {
    const cachePayload: CachedPost = {
      id: post.id,
      title: post.title,
      authorUsername: post.author.username ?? '',
      content: JSON.stringify(post.content),
      currentVote: voteType,
      createdAt: post.createdAt,
      authorId: post.author.id,
    }
    await redis.hset(`post:${post.id}`, cachePayload)
  }
}
