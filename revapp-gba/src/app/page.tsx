import Head from "next/head";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>Gut-Brain Axis App</title>
        <meta name="description" content="Track your gut-brain health" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Your Gut-Brain Health Tracker</h1>
        {/* Add your components here */}
      </main>
    </div>
  );
}
