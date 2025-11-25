// src/utils/helpers.js
export const formatDate = (iso) => new Date(iso).toLocaleString()

// formatNumber: 1234 -> "1.23K", 1200000 -> "1.2M"
export function formatNumber(n) {
	if (n === null || n === undefined) return ''
	const num = Number(n)
	if (Number.isNaN(num)) return String(n)
	const abs = Math.abs(num)
	if (abs < 1000) return String(num)
	if (abs < 1_000_000) return `${(num / 1000).toFixed( (abs>=10000)?1:2 ).replace(/\.0+$|\.([0-9]*?)0+$/,'$1')}K`
	return `${(num / 1_000_000).toFixed( (abs>=10_000_000)?1:2 ).replace(/\.0+$|\.([0-9]*?)0+$/,'$1')}M`
}