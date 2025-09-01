import '../styles/globals.css';
import '../src/styles/system-boot.css';
import '../src/styles/desktop.css';
import '../src/styles/applications.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
