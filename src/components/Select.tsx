import { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from './HeroIcons';

type Props = {
	sortBy: SortOption;
	setSortBy: (value: SortOption | any) => void;
	sortOptions: SortOption[];
};

/**
 * Styled implementation of Headless UI's Listbox
 */
const Select = ({ sortBy, setSortBy, sortOptions }: Props) => (
	<Listbox
		as="div"
		className="flex w-full flex-col gap-1"
		value={sortBy}
		onChange={setSortBy}
	>
		<Listbox.Button className="flex items-center justify-between rounded bg-green-500 px-2 py-1 text-white">
			<span>{sortBy}</span>
			<SelectorIcon />
		</Listbox.Button>

		<Listbox.Options className="flex flex-col divide-y overflow-hidden rounded border border-green-500 text-white">
			{sortOptions.map((option) => (
				// Make this a Fragment so the <li> can be conditionally styled with the render props
				<Listbox.Option key={option} value={option} as={Fragment}>
					<li className="flex cursor-pointer items-center justify-between px-2 py-1 ui-active:bg-green-600 ui-not-active:bg-green-500">
						<span>{option}</span>
						<CheckIcon className="hidden h-4 w-4 ui-selected:block" />
					</li>
				</Listbox.Option>
			))}
		</Listbox.Options>
	</Listbox>
);

export default Select;
