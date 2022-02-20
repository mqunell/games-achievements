import { Listbox } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';

interface SortOption {
	text: string;
	field: string;
	direction: number;
}

interface SelectProps {
	sortBy: SortOption;
	setSortBy: (value: SortOption) => void;
	sortOptions: SortOption[];
}

/**
 * Styled implementation of Headless UI's Listbox
 */
export default function Select({ sortBy, setSortBy, sortOptions }: SelectProps) {
	return (
		<Listbox value={sortBy} onChange={setSortBy}>
			<Listbox.Button className="flex items-center justify-between rounded bg-green-500 py-1 px-2 text-white">
				<span>{sortBy.text}</span>
				<SelectorIcon className="h-5 w-5" aria-hidden="true" />
			</Listbox.Button>
			<Listbox.Options className="flex flex-col gap-[1px] overflow-hidden rounded border border-green-500 bg-black text-white">
				{sortOptions.map((option) => (
					<Listbox.Option
						key={`${option.field}${option.direction}`}
						value={option}
						className="bg-green-500 py-1 px-2"
					>
						{option.text}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
	);
}
