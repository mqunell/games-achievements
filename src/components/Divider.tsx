import clsx from 'clsx'

const Divider = ({ className }: { className?: string }) => (
	<hr className={clsx('w-full border-body opacity-50', className)} />
)

export default Divider
