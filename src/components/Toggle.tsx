import { Field, Label, Switch } from '@headlessui/react';

type Props = {
	label: string | React.ReactNode;
	checked: boolean;
	onClick: Function;
};

/**
 * Styled implementation of Headless UI's Switch
 */
const Toggle = ({ label, checked, onClick }: Props) => (
	<Field>
		<div className="flex items-center gap-1">
			<Switch
				checked={checked}
				onChange={() => onClick()}
				className={`${
					checked ? 'bg-green-500' : 'bg-black'
				} relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-500`}
			>
				<span
					className={`${
						checked ? 'translate-x-5' : 'translate-x-1'
					} inline-block size-4 transform rounded-full bg-white transition duration-500`}
				/>
			</Switch>
			<Label>{label}</Label>
		</div>
	</Field>
);

export default Toggle;
