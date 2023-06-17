'use client'
import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { useCustonToadt } from '@/hooks/use-custon-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
}) => {
  const isSubscribed = false
  const { loginToast } = useCustonToadt()
  const router = useRouter()
  const { mutate: subscribe, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }
      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        if (err.response?.status === 401) return loginToast()
      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => router.refresh())
      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`,
      })
    },
  })
  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave community</Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle
