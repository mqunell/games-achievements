import Link from 'next/link'
import { Fragment } from 'react'
import { ArrowLeftIcon } from '@/components/HeroIcons'
import { readLogs } from '@/db/queries'
import LocalTimestamp from './LocalTimestamp'

export const revalidate = 600

const severityIcons: { [K in LogSeverity]: string } = {
	info: 'ℹ️',
	warn: '⚠️',
	error: '❌',
}

const LogsPage = async () => {
	const logs: LogLine[] = await readLogs()

	return (
		<div className="h-screen w-screen p-8">
			<section className="w-full rounded bg-white px-6 py-4">
				<h1 className="mb-2 text-lg">Logs</h1>

				<div className="grid font-mono text-sm md:grid-cols-[auto_1fr] md:gap-x-4">
					{logs.map((line, index) => (
						/* biome-ignore lint: list doesn't change, and index is more unique than the real data */
						<Fragment key={index}>
							<div>
								<LocalTimestamp timestamp={line.timestamp} />
							</div>
							<div className="mb-2">
								{severityIcons[line.severity]} {line.message}
							</div>
						</Fragment>
					))}
				</div>
			</section>

			<Link href="/">
				<div className="floating-button left-6">
					<ArrowLeftIcon className="size-5" />
				</div>
			</Link>
		</div>
	)
}

export default LogsPage
