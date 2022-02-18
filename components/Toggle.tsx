import { Switch } from '@headlessui/react';

interface ToggleProps {
	text: string;
	checked: boolean;
	onClick: Function;
}

/**
 * Styled implementation of Headless UI's Switch
 */
export default function Toggle({ text, checked, onClick }: ToggleProps) {
	return (
		<Switch.Group key={`toggle-${text}`}>
			<div className="flex items-center gap-1">
				<Switch
					checked={checked}
					onChange={() => onClick()}
					className={`${
						checked ? 'bg-green-500' : 'bg-black'
					} relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-500`}
				>
					<span className="sr-only">{text}</span>
					<span
						className={`${
							checked ? 'translate-x-5' : 'translate-x-1'
						} inline-block h-4 w-4 transform rounded-full bg-white transition duration-500`}
					/>
				</Switch>
				<Switch.Label className="text-black">{text}</Switch.Label>
			</div>
		</Switch.Group>
	);
}
