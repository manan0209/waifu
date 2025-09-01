

import Head from 'next/head';
import BootScreen from '../components/BootScreen';
import CharacterSelect from '../components/CharacterSelect';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const booted = router.query.booted === '1';
  return (
    <>
      <Head>
        <title>Retro Waifu Chat</title>
      </Head>
      {booted ? <CharacterSelect /> : <BootScreen />}
    </>
  );
}
