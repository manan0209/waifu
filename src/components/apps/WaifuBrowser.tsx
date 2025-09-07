import React from 'react';
import WaifuPics from './WaifuPics';

interface WaifuBrowserProps {
  onClose?: () => void;
}

// Legacy component - redirects to WaifuPics
export default function WaifuBrowser({ onClose }: WaifuBrowserProps) {
  return <WaifuPics onClose={onClose || (() => {})} />;
}

