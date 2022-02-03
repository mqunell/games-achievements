import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import classNames from 'classnames';
import { Disclosure } from '@headlessui/react';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { Game, getGames, getGame } from '../../lib/games';
import { Achievement, getAchievements } from '../../lib/achievements';

interface GameAchievementProps {
	game: Game;
	achievements: Achievement[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	const games = await getGames();
	const paths = games.map(({ gameId }) => ({
		params: { gameId },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const gameId = params.gameId as string;

	const game = await getGame(gameId);
	const achievements = await getAchievements(gameId);

	return { props: { game, achievements }, revalidate: 3600 };
};

export default function GameAchievements({ game, achievements }: GameAchievementProps) {
	const [filters, setFilters] = useState({
		completed: true,
		uncompleted: true,
	});

	const toggleFilter = (key: 'completed' | 'uncompleted') => {
		const newFilters = { ...filters };
		newFilters[key] = !newFilters[key];
		setFilters(newFilters);
	};

	return (
		<div className="flex flex-col items-center gap-6 w-80 mx-auto my-8">
			<Head>
				<title>{game.name} Achievements</title>
				<meta name="description" content={`${game.name} achievements`} />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-2xl text-center">{game.name}</h1>

			<div className="w-full p-2 bg-white rounded">
				<div className="w-full rounded">
					<Disclosure>
						<Disclosure.Button className="w-full py-2 bg-blue-600 rounded">
							Filters &amp; Sorting
						</Disclosure.Button>

						<Disclosure.Panel className="pt-2 text-black">
							<div className="grid grid-cols-2 gap-2 w-full text-white">
								<button
									className="px-2 py-1 bg-green-500 rounded"
									onClick={() => toggleFilter('completed')}
								>
									Toggle
									<br />
									Completed
								</button>
								<button
									className="px-2 py-1 bg-green-500 rounded"
									onClick={() => toggleFilter('uncompleted')}
								>
									Toggle
									<br />
									Uncompleted
								</button>
							</div>
						</Disclosure.Panel>
					</Disclosure>
				</div>
			</div>

			<div className="flex flex-col w-full">
				{achievements ? (
					achievements.map((ach: Achievement) => (
						<AchievementCard key={ach.apiName} achievement={ach} filters={filters} />
					))
				) : (
					<p>None</p>
				)}
			</div>
		</div>
	);
}

function AchievementCard({ achievement, filters }) {
	const { name, description, completed, completedTime, globalCompleted } = achievement;

	// The HTML node
	const domRef = useRef<HTMLDivElement>();

	// Scrolled into view
	const [isVisible, setVisible] = useState(false);

	// Filtered in
	const initialHeight = useRef<number>();
	const [isFiltered, setFiltered] = useState(true);

	// Store the initial (full) height and create/attach the observer
	useEffect(() => {
		const node = domRef.current;

		initialHeight.current = node.clientHeight;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setVisible(entry.isIntersecting);
				}
			});
		});

		observer.observe(node);
		return () => observer.unobserve(node);
	}, []);

	// Call setFiltered() when the filters prop changes to cause a component re-render
	useEffect(() => {
		setFiltered(filters[completed ? 'completed' : 'uncompleted']);
	}, [filters, completed]);

	return (
		/* Container - Card and Checkmark sit in the same grid cell */
		<div
			className={classNames(
				`grid h-[${initialHeight.current} px] mb-8`,
				'opacity-0 translate-y-8 transition-[height_opacity_translate] duration-500',
				{ 'opacity-100 !translate-y-0': isVisible },
				{ 'h-0 mb-0 overflow-hidden': !isFiltered }
			)}
			ref={domRef}
		>
			{/* Checkmark overlay */}
			{completed && (
				<div className={classNames('row-start-1 col-start-1 relative')}>
					<div
						className={classNames(
							'absolute -top-3 -right-4 w-max h-max bg-green-500 rounded-full z-10',
							'scale-0 transition-transform duration-500 delay-500',
							{ 'scale-100': isVisible }
						)}
					>
						<BadgeCheckIcon className="w-8 h-8 m-1.5 text-white" />
					</div>
				</div>
			)}

			{/* Card text and bar */}
			<div className="row-start-1 col-start-1 relative flex flex-col text-black text-center bg-white rounded overflow-hidden">
				{/* Text */}
				<div className="flex flex-col items-center gap-1 p-4">
					<h2 className="text-lg font-semibold">{name}</h2>
					{description ? <p>{description}</p> : <p className="italic">Hidden</p>}
					{completed && (
						<>
							<hr className="w-1/6 my-2 border-black" />
							<p className="text-sm">
								{new Date(completedTime * 1000).toLocaleString('en-US')}
							</p>
						</>
					)}
				</div>

				{/* Completion bar */}
				<div className="w-full bg-blue-200">
					<div
						className={classNames(
							'p-1.5 bg-blue-600',
							'scale-x-0 transition-transform origin-left duration-500 delay-500',
							{ 'scale-x-100': isVisible }
						)}
						style={{ width: globalCompleted + '%' }}
					>
						<p className="w-max px-1.5 py-0.5 text-xs bg-white border border-black rounded">
							{globalCompleted.toFixed(1)}%
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
