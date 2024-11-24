import { motion } from 'framer-motion'

// Page - motion and fromDirection are used for page transitions
export const Container = ({
	fromDirection,
	children,
}: {
	fromDirection: 'left' | 'right'
	children: React.ReactNode
}) => {
	const x = fromDirection === 'left' ? -200 : 200

	return (
		<motion.div
			initial={{ opacity: 0, x }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x }}
			transition={{ type: 'linear', duration: 0.5 }}
		>
			<div className="flex min-h-layout flex-col items-center gap-6 p-8 md:flex-row md:items-start">
				{children}
			</div>
		</motion.div>
	)
}

export const Sidebar = ({ children }: { children: React.ReactNode }) => (
	<div className="flex flex-col gap-8">{children}</div>
)

export const Content = ({ children }: { children: React.ReactNode }) => (
	<div className="flex w-full flex-wrap justify-center gap-8">{children}</div>
)
