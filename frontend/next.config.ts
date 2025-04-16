import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	images: {
		remotePatterns: [
			new URL(
				"https://marylandmatters.org/wp-content/uploads/2022/12/AdobeStock_290929282-scaled.jpeg"
			),
		],
	},
}

export default nextConfig
