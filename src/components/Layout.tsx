import { motion } from 'motion/react'

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
			transition={{ duration: 0.5 }}
			className="flex flex-col items-center gap-6 p-8"
		>
			{children}
		</motion.div>
	)
}

export const Cards = ({ children }: { children: React.ReactNode }) => (
	<div className="flex w-full flex-wrap justify-center gap-8">{children}</div>
)
