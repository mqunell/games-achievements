import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientSideRendering() {
	const { data, error } = useSWR('/api/hello', fetcher);

	// Determine the output to display based on useSWR results
	const getFetchText = () => {
		if (error) return 'Failed to load';
		if (!data) return 'Loading...';
		return data.text;
	};

	return (
		<div className="p-8">
			<Head>
				<title>CSR Demo</title>
				<meta name="description" content="CSR Demo" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-lg underline">Client-side Rendering</h1>
			<p>The `useSWR` hook fetches data from `api/hello`:</p>
			<p>{getFetchText()}</p>
		</div>
	);
}
