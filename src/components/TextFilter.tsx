import clsx from 'clsx';

type Props = {
	filterText: string;
	setFilterText: Function;
};

const TextFilter = ({ filterText, setFilterText }: Props) => (
	<input
		type="text"
		className={clsx(
			'mb-1 rounded-lg border border-black px-3 py-1 outline outline-0 focus-visible:border-green-500 focus-visible:outline-1 focus-visible:outline-green-500',
			{ 'border-green-500': filterText?.length },
		)}
		placeholder="Name"
		onChange={(e) => setFilterText(e.target.value)}
	/>
);

export default TextFilter;
