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
    const commentsForVote = await db.comment.findMany({
      where: {
        postId,
      },
    })
    for (const comment of commentsForVote) {
      await db.commentVote.deleteMany({
        where: {
          commentId: comment.id,
        },
      })
    }
    const comments = await db.comment.findMany({
      where: { postId: postId },
      include: { Comments: true }, // Include nested comments (replies)
    })

    // Delete the nested comments (replies) first
    const nestedCommentIds = comments
      .flatMap((comment) => comment.Comments)
      .map((comment) => comment.id)
<<<<<<< HEAD
    await db.comment.deleteMany({
      where: { id: { in: nestedCommentIds } },
    })

    // Delete the top-level comments associated with the post
    const commentIds = comments.map((comment) => comment.id)
    await db.comment.deleteMany({
      where: { id: { in: commentIds } },
    })
    await db.vote.deleteMany({
      where: {
        postId,
      },
    })
    await db.post.delete({
      where: {
        id: postId,
      },
    })
    await redis.del(`post:${postId}`)
=======

    // Use Promise.all() to delete comment votes and comments in parallel
    await Promise.all([
      db.commentVote.deleteMany({
        where: {
          commentId: { in: comments.map((comment) => comment.id) },
        },
      }),
      db.comment.deleteMany({
        where: {
          id: {
            in: [...nestedCommentIds, ...comments.map((comment) => comment.id)],
          },
        },
      }),
      redis.del(`post:${postId}`),
      db.post.delete({
        where: { id: postId },
      }),
    ])

>>>>>>> 4d6efc10cb0bdb7311c6231bc0106567912f6770
    return new Response('Post deleted', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response('Invalid request data passed', { status: 422 })
    return new Response('Could not delete post' + error, {
      status: 500,
    })
  }
}
