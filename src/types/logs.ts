export type LogSeverity = 'info' | 'warn' | 'error'

export type LogLine = {
	timestamp: Date
	severity: LogSeverity
	message: string
}
