import Head from 'next/head';
import { useRouter } from 'next/router';
import TerminalChat from '../components/TerminalChat';

export default function ChatPage() {
  const router = useRouter();
  const character = typeof router.query.character === 'string' ? router.query.character : 'waifu';
  return (
    <>
      <Head>
        <title>Retro Waifu Chat</title>
      </Head>
      <TerminalChat character={character} />
    </>
  );
}
