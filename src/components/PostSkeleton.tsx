import { Skeleton } from './ui/skeleton'

export default function PostSkeleton() {
  return (
    <div className="flex flex-col col-span-2 mt-5 space-y-6">
      <div className="bg-white rounded-md shadow">
        <div className="flex justify-between px-6 py-4">
          <div className="hidden pb-4 sm:flex sm:pr-10 ">
            <Skeleton className="w-6 h-16" />
          </div>
          <div className="flex-1 w-0">
            <div className="mt-1 text-xs text-gray-500 max-h-40">
              <Skeleton className="w-3/5 h-6" />
            </div>
            <a>
              <h1 className="py-2 text-lg font-semibold leading-6 text-gray-600">
                <Skeleton className="w-2/5 h-6" />
              </h1>
            </a>
            <div className="relative w-full text-sm max-h-40 overflow-clip">
              <Skeleton className="w-full h-24" />
            </div>
          </div>
        </div>
        <div className="z-20 flex p-4 px-4 text-sm bg-gray-50 sm:px-6">
          <div className="mr-2 sm:hidden">
            <Skeleton className="w-6 h-16" />
          </div>
          <a className="flex items-center gap-2 w-fit">
            <Skeleton className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
