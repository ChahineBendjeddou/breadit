/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
const page: FC = () => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      }
      const { data } = await axios.post('/api/subreddit', { payload })
      return data as string
    },
  })
  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative p-4 space-y-6 bg-white rounded-lg h-fit">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>
        <hr className="h-px bg-zinc-500" />
        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitilization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 text-sm place-items-center text-zinc-400 ">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length < 3}
            onClick={() => createCommunity()}
          >
            Create community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
