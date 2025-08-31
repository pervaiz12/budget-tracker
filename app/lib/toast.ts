type ToastType = 'success' | 'error' | 'info';

export type ToastMessage = {
  id: number;
  type: ToastType;
  text: string;
};

let idCounter = 1;

// Simple pub/sub
const listeners = new Set<(msg: ToastMessage) => void>();

export function subscribe(listener: (msg: ToastMessage) => void) {
  listeners.add(listener);
  return () => {
    // Ensure void return type
    listeners.delete(listener);
  };
}

function emit(type: ToastType, text: string) {
  const msg: ToastMessage = { id: idCounter++, type, text };
  listeners.forEach((l) => l(msg));
}

export const toast = {
  success: (text: string) => emit('success', text),
  error: (text: string) => emit('error', text),
  info: (text: string) => emit('info', text),
};
