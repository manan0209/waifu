import React, { useEffect, useRef } from 'react';
import { Icons } from '../ui/Icons';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ContextMenu({ x, y, onClose, onRefresh }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  const handleRefresh = () => {
    onRefresh();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        left: adjustedX,
        top: adjustedY,
      }}
    >
      <div className="context-menu-item" onClick={handleRefresh}>
        <Icons.Refresh size={16} />
        <span>Refresh</span>
      </div>
      <div className="context-menu-separator" />
      <div className="context-menu-item disabled">
        <Icons.Settings size={16} />
        <span>Properties</span>
      </div>
    </div>
  );
}
