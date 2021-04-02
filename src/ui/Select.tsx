import { css, cx } from '@emotion/css'
import { useEffect, useRef, useState } from 'preact/hooks'
import {
  DismissButton,
  FocusScope,
  HiddenSelect,
  mergeProps,
  useButton,
  useFocus,
  useListBox,
  useOption,
  useOverlay,
  useSelect,
} from 'react-aria'
import { useSelectState } from 'react-stately'
import type { AriaListBoxProps } from '@react-types/listbox'
import type { OverlayProps } from '@react-types/overlays'
import type { Node } from '@react-types/shared'
import type { SelectState } from 'react-stately'
import type { ComponentChildren } from 'preact'

interface SelectProps {
  label: string
  name?: string
  noSelectionText: string
  onChange?: (newSelection: Node<unknown>) => void
  children: ComponentChildren
}
interface ListboxPopupProps {
  state: SelectState<unknown>
  children: ComponentChildren
}
interface ListboxOverlayProps extends OverlayProps {
  isDismissable: boolean
  onClose(): void
  shouldCloseOnBlur: boolean
}
interface InternalOptionProps {
  item: Node<unknown>
  state: SelectState<unknown>
}

const selectWrapperCss = css`
  display: inline-block;
  position: relative;
`
const selectButtonCss = css`
  font-size: 14px;
  height: 30px;
`
export function Select(props: SelectProps) {
  const { label, name, noSelectionText = ``, onChange } = props
  const state = useSelectState(props)
  const ref = useRef()
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, ref)
  const { buttonProps } = useButton(triggerProps, ref)
  useEffect(() => {
    onChange?.(state.selectedItem)
  }, [state.selectedItem, onChange])
  return (
    <div class={selectWrapperCss}>
      <div {...labelProps}>{label}</div>
      <HiddenSelect state={state} triggerRef={ref} label={label} name={name} />
      <button {...buttonProps} ref={ref} class={selectButtonCss}>
        <span {...valueProps}>{state.selectedItem?.rendered ?? noSelectionText}</span>
        <span aria-hidden="true">▼</span>
      </button>
      {state.isOpen ? <ListboxPopup {...menuProps} state={state} /> : null}
    </div>
  )
}
export { Item as Option } from 'react-stately'
const listboxPopupOverlayCss = css`
  background-color: #a8eea8;
  border: 1px solid orange;
  list-style: none;
  margin-top: 4px;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  position: absolute;
  width: 100%;
`
function ListboxPopup({ state, ...props }: ListboxPopupProps) {
  const ref = useRef<HTMLUListElement>()
  const listboxOptions: AriaListBoxProps<unknown> = {
    autoFocus: state.focusStrategy || true,
    disallowEmptySelection: false,
    ...props,
  }
  const { listBoxProps } = useListBox(listboxOptions, state, ref)
  const overlayRef = useRef()
  const overlayOptions: ListboxOverlayProps = {
    onClose: () => state.close(),
    shouldCloseOnBlur: true,
    isOpen: state.isOpen,
    isDismissable: true,
    ...props,
  }
  const { overlayProps } = useOverlay(overlayOptions, overlayRef)
  return (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={() => state.close()} />
        <ul {...mergeProps(listBoxProps, props)} ref={ref} class={listboxPopupOverlayCss}>
          {[...state.collection].map((item) => (
            <InternalOption key={item.key} item={item} state={state} />
          ))}
        </ul>
        <DismissButton onDismiss={() => state.close()} />
      </div>
    </FocusScope>
  )
}
const internalOptionCss = css`
  background-color: transparent;
  cursor: pointer;
  outline: none;
  padding: 2px 5px;
`
const internalOptionSelectedCss = css`
  background-color: blueviolet;
  color: white;
`
const internalOptionFocusedCss = css`
  background-color: gray;
  color: white;
`
function InternalOption({ item, state }: InternalOptionProps) {
  const ref = useRef<HTMLLIElement>()
  const isDisabled = state.disabledKeys.has(item.key)
  const isSelected = state.selectionManager.isSelected(item.key)
  const { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
    },
    state,
    ref
  )
  const [isFocused, setIsFocused] = useState(false)
  const { focusProps } = useFocus({ onFocusChange: setIsFocused })
  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      class={cx(internalOptionCss, {
        [internalOptionFocusedCss]: isFocused,
        [internalOptionSelectedCss]: isSelected,
      })}
    >
      {item.rendered}
    </li>
  )
}
