'use client'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/Command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  const request = debounce(() => {
    refetch()
  }, 500)

  const debounceRequest = useCallback(() => {
    request()
  }, [request])

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])
  return (
    <Command
      ref={commandRef}
      className="relative max-w-lg overflow-visible border rounded-lg"
    >
      <CommandInput
        className="border-none outline-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
        value={input}
        onValueChange={(value) => {
          setInput(value)
          debounceRequest()
        }}
      />
      {input.length > 0 ? (
        <CommandList className="absolute inset-x-0 bg-white rounded-md shadow top-full">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  value={subreddit.name}
                >
                  <Users className="w-4 h-4 mr-2" />
                  <a href={`/r/${subreddit.name}`}>r/${subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default SearchBar
