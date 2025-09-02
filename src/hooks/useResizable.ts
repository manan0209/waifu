import { useState, useCallback, useEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

interface ResizeState {
  isResizing: boolean;
  resizeType: string;
  startMousePos: { x: number; y: number };
  startSize: Size;
  startPosition: { x: number; y: number };
}

interface UseResizableOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (size: Size) => void;
}

export function useResizable(
  initialSize: Size = { width: 400, height: 300 },
  options: UseResizableOptions = {}
) {
  const { 
    minWidth = 200, 
    minHeight = 150, 
    maxWidth = window.innerWidth * 0.9,
    maxHeight = window.innerHeight * 0.9,
    onResize
  } = options;

  const [size, setSize] = useState<Size>(initialSize);
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizeType: '',
    startMousePos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startPosition: { x: 0, y: 0 }
  });

  const handleResizeStart = useCallback((e: React.MouseEvent, resizeType: string, currentPosition: { x: number; y: number }) => {
    e.preventDefault();
    e.stopPropagation();

    setResizeState({
      isResizing: true,
      resizeType,
      startMousePos: { x: e.clientX, y: e.clientY },
      startSize: { ...size },
      startPosition: currentPosition
    });
  }, [size]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeState.isResizing) return;

    const deltaX = e.clientX - resizeState.startMousePos.x;
    const deltaY = e.clientY - resizeState.startMousePos.y;

    let newWidth = resizeState.startSize.width;
    let newHeight = resizeState.startSize.height;
    let newX = resizeState.startPosition.x;
    let newY = resizeState.startPosition.y;

    // Handle different resize types
    switch (resizeState.resizeType) {
      case 'resize-n':
        newHeight = resizeState.startSize.height - deltaY;
        newY = resizeState.startPosition.y + deltaY;
        break;
      case 'resize-s':
        newHeight = resizeState.startSize.height + deltaY;
        break;
      case 'resize-e':
        newWidth = resizeState.startSize.width + deltaX;
        break;
      case 'resize-w':
        newWidth = resizeState.startSize.width - deltaX;
        newX = resizeState.startPosition.x + deltaX;
        break;
      case 'resize-ne':
        newWidth = resizeState.startSize.width + deltaX;
        newHeight = resizeState.startSize.height - deltaY;
        newY = resizeState.startPosition.y + deltaY;
        break;
      case 'resize-nw':
        newWidth = resizeState.startSize.width - deltaX;
        newHeight = resizeState.startSize.height - deltaY;
        newX = resizeState.startPosition.x + deltaX;
        newY = resizeState.startPosition.y + deltaY;
        break;
      case 'resize-se':
        newWidth = resizeState.startSize.width + deltaX;
        newHeight = resizeState.startSize.height + deltaY;
        break;
      case 'resize-sw':
        newWidth = resizeState.startSize.width - deltaX;
        newHeight = resizeState.startSize.height + deltaY;
        newX = resizeState.startPosition.x + deltaX;
        break;
    }

    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    // Adjust position if size was clamped for left/top resizers
    if (resizeState.resizeType.includes('w')) {
      newX = resizeState.startPosition.x + (resizeState.startSize.width - newWidth);
    }
    if (resizeState.resizeType.includes('n')) {
      newY = resizeState.startPosition.y + (resizeState.startSize.height - newHeight);
    }

    setSize({ width: newWidth, height: newHeight });
    
    if (onResize) {
      onResize({ width: newWidth, height: newHeight });
    }

    // Return new position for parent to handle
    return { x: newX, y: newY };
  }, [resizeState, minWidth, minHeight, maxWidth, maxHeight, onResize]);

  const handleResizeEnd = useCallback(() => {
    setResizeState(prev => ({ ...prev, isResizing: false }));
  }, []);

  // Attach global event listeners
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = getCursorForResizeType(resizeState.resizeType);
    } else {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd, resizeState.resizeType]);

  return {
    size,
    setSize,
    isResizing: resizeState.isResizing,
    handleResizeStart,
    resizeProps: {
      style: {
        width: size.width,
        height: size.height
      }
    }
  };
}

function getCursorForResizeType(resizeType: string): string {
  switch (resizeType) {
    case 'resize-n':
    case 'resize-s':
      return 'ns-resize';
    case 'resize-e':
    case 'resize-w':
      return 'ew-resize';
    case 'resize-ne':
    case 'resize-sw':
      return 'nesw-resize';
    case 'resize-nw':
    case 'resize-se':
      return 'nwse-resize';
    default:
      return 'default';
  }
}
