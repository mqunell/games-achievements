import Link from 'next/link'

const ConditionalLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
	if (!href) {
		return <>{children}</>
	}

	return <Link href={href}>{children}</Link>
}

export default ConditionalLink
