import { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import clsx from 'clsx';

interface SelectProps {
	sortBy: SortOption;
	setSortBy: (value: SortOption | any) => void;
	sortOptions: SortOption[];
}

/**
 * Styled implementation of Headless UI's Listbox
 */
const Select = ({ sortBy, setSortBy, sortOptions }: SelectProps) => (
	<Listbox
		as="div"
		className="flex w-full flex-col gap-1"
		value={sortBy}
		onChange={setSortBy}
	>
		<Listbox.Button className="flex items-center justify-between rounded bg-green-500 py-1 px-2 text-white">
			<span>{sortBy}</span>
			<SelectorIcon className="h-5 w-5" aria-hidden="true" />
		</Listbox.Button>

		<Listbox.Options className="flex flex-col divide-y overflow-hidden rounded border border-green-500 text-white">
			{sortOptions.map((option) => (
				// Make this a Fragment so the <li> can be conditionally styled with the render props
				<Listbox.Option key={option} value={option} as={Fragment}>
					{({ active, selected }) => (
						<li
							className={clsx(
								'flex cursor-pointer items-center justify-between py-1 px-2',
								!active ? 'bg-green-500' : 'bg-green-600'
							)}
						>
							<span>{option}</span>
							{selected && <CheckIcon className="h-4 w-4" />}
						</li>
					)}
				</Listbox.Option>
			))}
		</Listbox.Options>
	</Listbox>
);

export default Select;
