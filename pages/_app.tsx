import '../styles/globals.css';
import '../src/styles/system-boot.css';
import '../src/styles/desktop.css';
import '../src/styles/applications.css';
import '../src/styles/video-player.css';
import '../src/styles/project-viewer.css';
import '../src/styles/solitaire.css';
import '../src/styles/media-player.css';
import type { AppProps } from 'next/app';
import { SystemSettingsProvider } from '../src/contexts/SystemSettingsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SystemSettingsProvider>
      <Component {...pageProps} />
    </SystemSettingsProvider>
  );
}

export default MyApp;
