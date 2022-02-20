import { Disclosure } from '@headlessui/react';

/**
 * Styled and specific implementation of Headless UI's Disclosure
 */
export default function DisplayOptions({ children }) {
	return (
		<div className="w-full rounded bg-white p-3">
			<Disclosure>
				<Disclosure.Button className="w-full rounded bg-blue-600 py-2 text-white">
					Display options
				</Disclosure.Button>

				<Disclosure.Panel className="pt-2">
					<div className="flex w-full flex-col gap-2">{children}</div>
				</Disclosure.Panel>
			</Disclosure>
		</div>
	);
}
