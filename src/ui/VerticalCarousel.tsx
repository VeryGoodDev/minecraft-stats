import { css, cx } from '@emotion/css'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { toChildArray } from 'preact'
import { useState } from 'preact/hooks'
import type { ComponentChildren } from 'preact'

interface VerticalCarouselProps {
  children: ComponentChildren
  hideNextButton?: boolean
  hidePreviousButton?: boolean
  startIndex?: number
}
const carouselWrapperCss = css``
const carouselControlsCss = css`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 20px;
  justify-content: space-between;
  margin-top: 16px;
`
const carouselButtonCss = css`
  align-items: center;
  cursor: pointer;
  display: grid;
  grid-column-gap: 8px;
`
const carouselPreviousButtonCss = cx(
  carouselButtonCss,
  css`
    grid-template-columns: auto 1fr;
  `
)
const carouselNextButtonCss = cx(
  carouselButtonCss,
  css`
    grid-column: end;
    grid-template-columns: 1fr auto;
  `
)
// TODO: Animate slide change up/down
export default function VerticalCarousel({
  children,
  startIndex = 0,
  hideNextButton = false,
  hidePreviousButton = false,
}: VerticalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex)
  const childrenArray = toChildArray(children)
  if (!childrenArray.length) {
    return null
  }
  const prevSlide = childrenArray[currentIndex - 1] ?? null
  const currentSlide = childrenArray[currentIndex] ?? null
  const nextSlide = childrenArray[currentIndex + 1] ?? null
  return (
    <>
      <div class={carouselWrapperCss}>{currentSlide}</div>
      <div class={carouselControlsCss}>
        {currentIndex > 0 && !hidePreviousButton ? (
          <button
            type="button"
            class={carouselPreviousButtonCss}
            onClick={() => {
              setCurrentIndex((prevValue) => prevValue - 1)
            }}
          >
            <CaretLeft />
            <span>Back</span>
          </button>
        ) : null}
        {currentIndex < childrenArray.length - 1 && !hideNextButton ? (
          <button
            type="button"
            class={carouselNextButtonCss}
            onClick={() => {
              setCurrentIndex((prevValue) => prevValue + 1)
            }}
          >
            <span>Next</span>
            <CaretRight />
          </button>
        ) : null}
      </div>
    </>
  )
}
export function VerticalCarouselSlide({ children }: { children: ComponentChildren }) {
  return toChildArray(children).length > 0 ? <>{children}</> : null
}
