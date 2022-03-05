import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

/**
 * Styled and specific implementation of Headless UI's Disclosure
 */
export default function DisplayOptions({ children }) {
	return (
		<div className="w-full rounded bg-white p-3">
			<Disclosure>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full items-center justify-between rounded bg-blue-600 px-3 py-2 text-white">
							<span>Display options</span>
							<ChevronUpIcon
								className={classNames('h-5 w-5 transform transition-transform ease-out', {
									'rotate-180 duration-500': open,
									'rotate-0 duration-300': !open,
								})}
							/>
						</Disclosure.Button>

						<Transition
							enter="transform transition duration-500 ease-out"
							enterFrom="-translate-y-2 opacity-0"
							enterTo="translate-y-0 opacity-100"
							leave="transform transition duration-300 ease-in"
							leaveFrom="translate-y-0 opacity-100"
							leaveTo="-translate-y-2 opacity-0"
						>
							<Disclosure.Panel className="pt-2">
								<div className="flex w-full flex-col gap-2">{children}</div>
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
		</div>
	);
}
