import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from './HeroIcons'

type Props = {
	sortBy: SortOption
	setSortBy: (value: SortOption | any) => void
	sortOptions: SortOption[]
}

/**
 * Styled implementation of Headless UI's Listbox
 */
const Select = ({ sortBy, setSortBy, sortOptions }: Props) => (
	<Listbox as="div" className="flex w-full flex-col gap-1" value={sortBy} onChange={setSortBy}>
		<ListboxButton className="flex cursor-pointer items-center justify-between rounded-sm bg-green-500 px-2 py-1 text-white">
			<span>{sortBy}</span>
			<SelectorIcon />
		</ListboxButton>

		<ListboxOptions className="flex flex-col divide-y overflow-hidden rounded-sm border border-green-500 text-white">
			{sortOptions.map((option) => (
				<ListboxOption
					key={option}
					value={option}
					className="ui-active:bg-green-600 ui-not-active:bg-green-500 flex cursor-pointer items-center justify-between px-2 py-1"
				>
					<span>{option}</span>
					<CheckIcon className="ui-selected:block hidden size-4" />
				</ListboxOption>
			))}
		</ListboxOptions>
	</Listbox>
)

export default Select
