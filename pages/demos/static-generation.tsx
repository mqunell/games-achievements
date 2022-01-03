import Head from 'next/head';
import { GetStaticProps } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export const getStaticProps: GetStaticProps = async () => {
	await dbConnect();

	const result = await User.find({});
	const users = result.map((doc) => {
		const user = doc.toObject();
		user._id = user._id.toString();
		return user;
	});

	return { props: { users }, revalidate: 10 };
};

export default function StaticGeneration({ users }) {
	return (
		<div className="p-8">
			<Head>
				<title>SSG Demo</title>
				<meta name="description" content="SSG Demo" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-lg underline">Static Generation</h1>
			<ul>{users && users.map((user) => <li key={user._id}>{user.name}</li>)}</ul>
		</div>
	);
}
