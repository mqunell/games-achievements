type LogSeverity = 'info' | 'warn' | 'error'

type LogLine = {
	timestamp: Date
	severity: LogSeverity
	message: string
}
