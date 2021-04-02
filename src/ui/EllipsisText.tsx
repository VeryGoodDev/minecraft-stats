import { css } from '@emotion/css'
import { JSX } from 'preact/jsx-runtime'

interface EllipsisTextProps {
  text: string
  as?: string
}

const ellipsisCss = css`
  overflow-x: hidden;
  text-overflow: ellipsis;
`
export default function EllipsisText({ text, as }: EllipsisTextProps) {
  const Tag = (as || `div`) as keyof JSX.IntrinsicElements
  return (
    <Tag class={ellipsisCss} title={text}>
      {text}
    </Tag>
  )
}
