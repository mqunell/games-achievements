import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Fragment } from 'react'
import { SettingsIcon } from './HeroIcons'

export const DisplayOptionsContainer = ({ children }: { children: React.ReactNode[] }) => (
	<Popover>
		<PopoverButton className="floating-button right-6 z-[4]">
			<SettingsIcon className="size-5" />
		</PopoverButton>

		<PopoverBackdrop className="fixed inset-0 z-[3] bg-black/20" />

		<PopoverPanel
			anchor="top end"
			transition
			className="z-[4] flex w-80 origin-bottom-right -translate-y-1.5 flex-col rounded-md border border-body bg-white px-4 pt-2 pb-4 shadow transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
		>
			{children.map((child, index) => (
				/* biome-ignore lint: list doesn't change, index is okay */
				<Fragment key={`display-option-group-${index}`}>
					{child}
					{index < children.length - 1 && <hr className="mt-5 mb-3" />}
				</Fragment>
			))}
		</PopoverPanel>
	</Popover>
)

export const DisplayOptionsGroup = ({
	header,
	subText,
	children,
}: {
	header: string
	subText?: string
	children: React.ReactNode
}) => (
	<div className="flex w-full flex-col gap-2">
		<h3 className="font-semibold">
			{header} <span className="font-normal text-sm italic">{subText}</span>
		</h3>
		{children}
	</div>
)
