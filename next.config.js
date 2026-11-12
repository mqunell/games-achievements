module.exports = {
	reactStrictMode: true,
	images: {
		minimumCacheTTL: 2678400, // 31 days
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'steamcdn-a.akamaihd.net',
				pathname: '/steam/apps/*/header.jpg',
				search: '',
			},
		],
	},
}
