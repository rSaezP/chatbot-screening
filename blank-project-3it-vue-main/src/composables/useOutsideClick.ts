import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export default function useOutsideClick(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void
): void {
  function handleClick(event: MouseEvent): void {
    const target = event.target as Node
    if (elementRef.value && !elementRef.value.contains(target)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })
}
