import dynamic from 'next/dynamic'
import Image from 'next/image'
import { FC } from 'react'
const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)
interface EditorOutputProps {
  content: any
}
const style = {
  paragraph: {
    fontsize: '.875rem',
    lineHeight: '1.25rem',
  },
}

const renderers = {
  image: CustomImageRenderer,
  //   code: CustomCodeRenderer,
}
const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  )
}
function CustomImageRenderer({ data }: any) {
  const src = data.file.url
  return (
    <div className="relative w-full min-h-[15rem]">
      <Image fill alt="Image" src={src} className="object-contain" />
    </div>
  )
}
function CustomCodeRenderer({ data }: any) {}
export default EditorOutput
