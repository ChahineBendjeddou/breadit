import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { z } from 'zod'

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const url = new URL(req.url)
    const postId = url.searchParams.get('postId')
    if (!postId) return new Response('Invalid query', { status: 400 })

    // Fetch all comments and their nested comments (replies) in a single query
    const comments = await db.comment.findMany({
      where: { postId },
      include: { Comments: true },
    })

    const nestedCommentIds = comments
      .flatMap((comment) => comment.Comments)
      .map((comment) => comment.id)

    // Delete comment votes in a batch operation
    await db.commentVote.deleteMany({
      where: {
        commentId: { in: comments.map((comment) => comment.id) },
      },
    })

    // Delete comments and their nested comments in a batch operation
    await db.comment.deleteMany({
      where: {
        id: {
          in: [...nestedCommentIds, ...comments.map((comment) => comment.id)],
        },
      },
    })

    // Delete votes associated with the post
    await db.vote.deleteMany({
      where: { postId },
    })

    // Delete the post
    await db.post.delete({
      where: { id: postId },
    })

    // Delete Redis cache entry
    redis.del(`post:${postId}`)
    return new Response('Post deleted', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response('Invalid request data passed', { status: 422 })
    return new Response('Could not delete post' + error, {
      status: 500,
    })
  }
}
