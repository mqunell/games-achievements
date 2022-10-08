import { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

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
		<Listbox
			as="div"
			className="flex w-full flex-col gap-1"
			value={sortBy}
			onChange={setSortBy}
		>
			<Listbox.Button className="flex items-center justify-between rounded bg-green-500 py-1 px-2 text-white">
				<span>{sortBy.text}</span>
				<SelectorIcon className="h-5 w-5" aria-hidden="true" />
			</Listbox.Button>

			<Listbox.Options className="flex flex-col divide-y overflow-hidden rounded border border-green-500 text-white">
				{sortOptions.map((option) => (
					<Listbox.Option
						key={`${option.field}${option.direction}`}
						value={option}
						as={Fragment} // Make this a Fragment so the <li> can be conditionally styled with the render props
					>
						{({ active, selected }) => (
							<li
								className={classNames(
									'flex cursor-pointer items-center justify-between py-1 px-2',
									!active ? 'bg-green-500' : 'bg-green-600'
								)}
							>
								<span>{option.text}</span>
								{selected && <CheckIcon className="h-4 w-4" />}
							</li>
						)}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
	);
}
