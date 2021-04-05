import { css } from '@emotion/css'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { ComponentChildren, Fragment, toChildArray, VNode } from 'preact'
import { useState } from 'preact/hooks'

interface VerticalCarouselProps {
  children: ComponentChildren
  startIndex?: number
}
const carouselWrapperCss = css``
const carouselControlsCss = css``
// TODO: Cleanup test code where I was experimenting with finding component type (seems to be the same way as in React, just had to figure out how to do it with Typescript as well)
// TODO: Animate slide change up/down
// TODO: Agnostic controls with VerticalCarouselControls component (can check by type in VerticalCarousel to render at bottom)
export default function VerticalCarousel({ children, startIndex = 0 }: VerticalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex)
  const childrenArray = toChildArray(children)
  if (!childrenArray.length) {
    return null
  }
  const prevSlide = childrenArray[currentIndex - 1] ?? null
  const currentSlide = childrenArray[currentIndex] ?? null
  const nextSlide = childrenArray[currentIndex + 1] ?? null
  console.log((currentSlide as VNode)?.type === Fragment ? `Fragment` : `other`)
  return (
    <>
      <div class={carouselWrapperCss}>{currentSlide}</div>
      <div class={carouselControlsCss}>
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((prevValue) => prevValue - 1)
            }}
          >
            <CaretLeft />
            <span>Back</span>
          </button>
        ) : null}
        {currentIndex < childrenArray.length - 1 ? (
          <button
            type="button"
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
