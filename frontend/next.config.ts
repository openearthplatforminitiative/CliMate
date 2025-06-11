import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "marylandmatters.org",
				pathname: "/wp-content/uploads/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
				pathname: "/assets/**",
			},
		],
	},
}

export default nextConfig
