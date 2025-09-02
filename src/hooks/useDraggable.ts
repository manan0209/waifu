import { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  startPos: Position;
  startElementPos: Position;
}

export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    startElementPos: { x: 0, y: 0 }
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragState({
      isDragging: true,
      startPos: { x: e.clientX, y: e.clientY },
      startElementPos: { x: rect.left, y: rect.top }
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const deltaX = e.clientX - dragState.startPos.x;
    const deltaY = e.clientY - dragState.startPos.y;

    const newX = dragState.startElementPos.x + deltaX;
    const newY = dragState.startElementPos.y + deltaY;

    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - 200));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 100));

    setPosition({ x: constrainedX, y: constrainedY });
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  // Attach global event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    position,
    setPosition,
    isDragging: dragState.isDragging,
    handleMouseDown,
    dragProps: {
      style: {
        position: 'absolute' as const,
        left: position.x,
        top: position.y,
        cursor: dragState.isDragging ? 'move' : 'default'
      }
    }
  };
}
