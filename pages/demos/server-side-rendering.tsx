import Head from 'next/head';
import { GetServerSideProps } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export const getServerSideProps: GetServerSideProps = async () => {
	await dbConnect();

	const result = await User.find({});
	const users = result.map((doc) => {
		const user = doc.toObject();
		user._id = user._id.toString();
		return user;
	});

	return { props: { users } };
};

export default function ServerSideRendering({ users }) {
	return (
		<div className="p-8">
			<Head>
				<title>SSR Demo</title>
				<meta name="description" content="SSR Demo" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-lg underline">Server-side Rendering</h1>
			<ul>{users && users.map((user) => <li key={user._id}>{user.name}</li>)}</ul>
		</div>
	);
}
