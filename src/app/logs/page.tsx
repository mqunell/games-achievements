import { Fragment } from 'react'
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
		</div>
	)
}

export default LogsPage
