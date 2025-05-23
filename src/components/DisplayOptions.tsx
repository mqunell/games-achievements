import { Fragment } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronUpIcon } from './HeroIcons'

// Styled and specific implementation of Headless UI's Disclosure
export const Container = ({
	footer,
	children,
}: {
	footer: string
	children: React.ReactNode[]
}) => (
	<div className="flex w-80 flex-col gap-2 rounded-sm bg-white p-3">
		<Disclosure>
			<DisclosureButton className="flex w-full cursor-pointer items-center justify-between rounded-sm bg-blue-600 px-3 py-2 text-white">
				<h2>Display options</h2>
				<ChevronUpIcon className="ui-open:rotate-180 ui-open:duration-500 ui-not-open:rotate-0 ui-not-open:duration-300 size-5 transform transition-transform ease-out" />
			</DisclosureButton>

			<Transition
				enter="transform transition duration-500 ease-out"
				enterFrom="-translate-y-2 opacity-0"
				enterTo="translate-y-0 opacity-100"
				leave="transform transition duration-300 ease-in"
				leaveFrom="translate-y-0 opacity-100"
				leaveTo="-translate-y-2 opacity-0"
			>
				<DisclosurePanel className="pt-2">
					<div className="flex w-full flex-col gap-2 border-b border-b-blue-800 pb-4">
						{children.map((child: React.ReactNode, index: number) => (
							<Fragment key={`display-option-group-${index}`}>
								{child}
								{index < children.length - 1 && <hr className="mt-3 mb-1" />}
							</Fragment>
						))}
					</div>
				</DisclosurePanel>
			</Transition>

			<span className="text-center italic">{footer}</span>
		</Disclosure>
	</div>
)

export const Group = ({ header, children }: { header: string; children: React.ReactNode }) => (
	<div className="flex w-full flex-col gap-2">
		<h3 className="font-semibold">{header}</h3>
		{children}
	</div>
)
