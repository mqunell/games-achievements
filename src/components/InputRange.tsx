type Props = {
	title: string
	value: number
	setValue: Function
}

const InputRange = ({ title, value, setValue }: Props) => (
	<label className="grid grid-cols-[1fr_28px] gap-x-2">
		<span className="col-span-2">{title}</span>
		<input
			className="w-full accent-green-500"
			type="range"
			min="0"
			max="100"
			step="20"
			value={value}
			onChange={(e) => setValue(parseInt(e.target.value))}
		/>
		{value}
	</label>
)

export default InputRange
