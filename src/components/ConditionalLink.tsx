import Link from 'next/link'

type Props = {
	href: string
	children: React.ReactNode
}

const ConditionalLink = ({ href, children }: Props) => {
	if (!href) {
		return <>{children}</>
	}

	return <Link href={href}>{children}</Link>
}

export default ConditionalLink
