import clsx from 'clsx'
import Image from 'next/image'

const PlatformIcon = ({ platform, size }: { platform: Platform; size: Size }) => (
	<div
		key={platform}
		className={clsx('relative shrink-0', {
			'size-5': size === 'small',
			'size-6': size === 'large',
		})}
	>
		<Image src={`/${platform}.svg`} alt={`${platform} logo`} fill={true} />
	</div>
)

export default PlatformIcon
