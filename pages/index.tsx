import Head from 'next/head';
import Link from 'next/link';
import { getUsers } from '../lib/users';

export default function Home() {
	return (
		<div className="flex flex-col gap-2 p-8">
			<Head>
				<title>Next.js App</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<HomeLink url="/demos/static-generation" text="Static Generation" />
			<HomeLink url="/demos/server-side-rendering" text="Server-side Rendering" />
			<HomeLink url="/demos/client-side-rendering" text="Client-side Rendering" />

			<p>../lib/users: {getUsers().toString()}</p>
		</div>
	);
}

const HomeLink = ({ url, text }: { url: string; text: string }) => {
	return (
		<Link href={url}>
			<a className="text-blue-500 hover:underline">{text}</a>
		</Link>
	);
};
