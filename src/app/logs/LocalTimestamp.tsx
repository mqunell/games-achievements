'use client'

// This component needs to be rendered in the browser for accurate timestamp conversions
const LocalTimestamp = ({ timestamp }: { timestamp: Date }) => (
	<>{timestamp.toLocaleString('en-US')}</>
)

export default LocalTimestamp
