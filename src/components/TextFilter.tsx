import clsx from 'clsx'

const TextFilter = ({
	filterText,
	setFilterText,
}: {
	filterText: string
	setFilterText: React.Dispatch<React.SetStateAction<string>>
}) => (
	<input
		type="text"
		className={clsx(
			'mb-1 rounded-lg border border-black px-3 py-1 focus-visible:border-green-500 focus-visible:outline-1 focus-visible:outline-green-500',
			{ 'border-green-500': filterText?.length },
		)}
		placeholder="Name"
		onChange={(e) => setFilterText(e.target.value)}
	/>
)

export default TextFilter
