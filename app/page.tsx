import Image from "next/image";
import Script from 'next/script';

export default function Home() {
  return (

    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Script className="KAOscript" src="https://keepandroidopen.org/banner.js"/>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between bg-white dark:bg-black py-32 px-16 sm:items-start">
        <Image
        className="bg-white flex h-full w-full items-center justify-center rounded-full transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
          src="/epilog.svg"
          alt="Portainter logo"
          width={100}
          height={100}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Guten Tag Leser.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Endlich mal wieder was lesen?{" "}
            <a
              href="https://epilog.schamagusa.de"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
             Lies mich
            </a>{" "}
            oder{" "}
            <a
              href="https://schamagusa.de"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              lies mich.
            </a>{" "}
            Du darfst dich entscheiden...
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://epilog.schamagusa.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className=""
              src="/epilog.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Klick mich
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://schamagusa.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
            className="dark:invert"
            src="/dashboard.svg"
            alt="Vercel logomark"
            width={16}
            height={16}
            />
            Klick mich nicht
          </a>
        </div>
      </main>
    </div>
  );
}
