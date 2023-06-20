'use client'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { cn } from '@/lib/utils'
import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { toast } from '@/hooks/use-toast'

interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)

  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      }
      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      setCurrentVote(prevVote)

      if (err instanceof AxiosError)
        if (err.response?.status === 401) return loginToast()

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered. Please try again later.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else setVotesAmt((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])
  return (
    <div className="flex flex-row w-20 pr-6 sm:flex-col">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote('UP')}
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700 hover:text-emerald-500', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>
      <p className="py-2 text-sm font-medium text-center sm:py-0 text-zinc-900">
        {votesAmt}
      </p>
      <Button
        size="sm"
        variant="ghost"
        aria-label="downvote"
        onClick={() => vote('DOWN')}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700 hover:text-red-500', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient
