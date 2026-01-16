// Global keyboard shortcuts hook
import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check each shortcut
      shortcuts.forEach(({ key, ctrlKey = false, shiftKey = false, altKey = false, callback }) => {
        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatch = ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;