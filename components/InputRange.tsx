interface InputRangeProps {
	title: string;
	value: number;
	setValue: Function;
}

export default function InputRange({ title, value, setValue }: InputRangeProps) {
	return (
		<label className="grid grid-cols-[1fr_28px] gap-x-2 text-black">
			<span className="col-span-2">{title}</span>
			<input
				className="w-full"
				type="range"
				min="0"
				max="100"
				step="20"
				value={value}
				onChange={(e) => setValue(parseInt(e.target.value))}
			/>
			{value}
		</label>
	);
}
