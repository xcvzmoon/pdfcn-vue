import type { Ref } from 'vue';
import { onBeforeUnmount, ref } from 'vue';
import { toast } from 'vue-sonner';

type CopyTextState = {
  copiedKey: Ref<string | null>;
  copyText: (text: string, key?: string) => Promise<boolean>;
};

export function useCopyText(): CopyTextState {
  const copiedKey = ref<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copyText(text: string, key = text.slice(0, 48)): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      copiedKey.value = key;
      toast.success('Copied to clipboard');
      clearTimeout(timer);
      timer = setTimeout(() => {
        copiedKey.value = null;
      }, 1600);
      return true;
    } catch {
      toast.error('Clipboard write failed');
      return false;
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(timer);
  });
  return { copiedKey, copyText };
}
