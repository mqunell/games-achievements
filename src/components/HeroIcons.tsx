const svgV1Props = (className?: string) => ({
	xmlns: 'http://www.w3.org/2000/svg',
	viewBox: '0 0 20 20',
	fill: 'currentColor',
	className: className ?? 'size-5',
})

const svgV2Props = (className?: string) => ({
	xmlns: 'http://www.w3.org/2000/svg',
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2,
	className: className ?? 'size-6',
})

// arrow-left solid v1.0.6
export const ArrowLeftIcon = ({ className }: { className?: string }) => (
	<svg {...svgV1Props(className)}>
		<path
			fillRule="evenodd"
			d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
			clipRule="evenodd"
		/>
	</svg>
)

// calendar-days outline v2.1.5
export const CalendarIcon = ({ className }: { className?: string }) => (
	<svg {...svgV2Props(className)}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
		/>
	</svg>
)

// check solid v1.0.6
export const CheckIcon = ({ className }: { className?: string }) => (
	<svg {...svgV1Props(className)}>
		<path
			fillRule="evenodd"
			d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
)

// check-circle outline v2.1.5
export const CheckCircleIcon = ({ className }: { className?: string }) => (
	<svg {...svgV2Props(className)}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		/>
	</svg>
)

// chevron-up solid v1.0.6
export const ChevronUpIcon = ({ className }: { className?: string }) => (
	<svg {...svgV1Props(className)}>
		<path
			fillRule="evenodd"
			d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
			clipRule="evenodd"
		/>
	</svg>
)

// clock outline v2.1.5
export const ClockIcon = ({ className }: { className?: string }) => (
	<svg {...svgV2Props(className)}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		/>
	</svg>
)

// selector solid v1.0.6
export const SelectorIcon = ({ className }: { className?: string }) => (
	<svg {...svgV1Props(className)}>
		<path
			fillRule="evenodd"
			d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
			clipRule="evenodd"
		/>
	</svg>
)

// trophy outline v2.1.1
export const TrophyIcon = ({ className }: { className?: string }) => (
	<svg {...svgV2Props(className)}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
		/>
	</svg>
)
