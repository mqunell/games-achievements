import { Field, Label, Switch } from '@headlessui/react'
import clsx from 'clsx'

type Props = {
	label: string | React.ReactNode
	checked: boolean
	onClick: () => void
}

/**
 * Styled implementation of Headless UI's Switch
 */
const Toggle = ({ label, checked, onClick }: Props) => (
	<Field>
		<div className="flex items-center gap-1">
			<Switch
				checked={checked}
				onChange={() => onClick()}
				className={clsx(
					checked ? 'bg-green-500' : 'bg-black',
					'relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full transition-colors duration-500',
				)}
			>
				<span
					className={clsx(
						checked ? 'translate-x-5' : 'translate-x-1',
						'inline-block size-4 transform rounded-full bg-white transition duration-500',
					)}
				/>
			</Switch>
			<Label>{label}</Label>
		</div>
	</Field>
)

export default Toggle
