// ex. '4:53'
export const formatDuration = (minutes: number) => {
	const hours = Math.trunc(minutes / 60).toString()
	const mins = (minutes % 60).toString().padStart(2, '0')

	return `${hours}:${mins}`
}

// ex. '9/23/26'
export const formatDate = (d: Date): string => {
	return d.toLocaleDateString('en-US', {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
	})
}

// ex. '9/22/26, 11:00:07 PM'
export const formatDateTime = (d: Date): string => {
	return d.toLocaleString('en-US', {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
	})
}
