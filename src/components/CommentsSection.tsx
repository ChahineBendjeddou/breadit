import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostComment from './PostComment'
import CreateComment from './CreateComment'

interface CommentsSectionProps {
  postId: string
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      Comments: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })
  return (
    <div className="flex flex-col mt-4 gap-y-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      <div className="flex flex-col mt-4 gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLvlComment) => {
            const topLvlCommentVotesAmt = topLvlComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0
            )
            const topLvlCommentCurrentVote = topLvlComment.votes.find(
              (vote) => vote.userId === session?.user.id
            )
            return (
              <div key={topLvlComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLvlComment}
                    postId={postId}
                    currentVote={topLvlCommentCurrentVote}
                    votesAmt={topLvlCommentVotesAmt}
                  />
                </div>
                {topLvlComment.Comments.sort(
                  (a, b) => b.votes.length - a.votes.length
                ).map((reply) => {
                  const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                    if (vote.type === 'UP') return acc + 1
                    if (vote.type === 'DOWN') return acc - 1
                    return acc
                  }, 0)
                  const replyVote = reply.votes.find(
                    (vote) => vote.userId === session?.user.id
                  )
                  return (
                    <div
                      key={reply.id}
                      className="py-2 pl-4 ml-2 border-l-2 border-zinc-200"
                    >
                      <PostComment
                        comment={reply}
                        postId={postId}
                        votesAmt={replyVotesAmt}
                        currentVote={replyVote}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentsSection
