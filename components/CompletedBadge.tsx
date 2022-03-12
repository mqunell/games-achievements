import { BadgeCheckIcon } from '@heroicons/react/solid';

export default function CompletedBadge() {
	return (
		<div className="absolute -top-3 -right-4 z-10 h-max w-max rounded-full bg-green-500 p-1.5">
			<BadgeCheckIcon className="h-8 w-8 text-white" />
		</div>
	);
}
