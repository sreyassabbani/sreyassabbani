import fs from "fs";

const rescript = JSON.parse(fs.readFileSync("./rescript.json"));
const transpileModules = ["rescript"].concat(rescript["bs-dependencies"]);

const repo = "sreyassabbani";

const config = {
	pageExtensions: ["jsx", "js"],
	output: "export",
	basePath: process.env.NODE_ENV == "production" ? `/${repo}` : "",
	assetPrefix: process.env.NODE_ENV == "production" ? `/${repo}` : "",
	env: {
		ENV: process.env.NODE_ENV,
	},
	devIndicators: false,
	// Enable Tailwind CSS v4 with Lightning CSS
	experimental: {
		cssChunking: "strict",
	},
	webpack: (config, options) => {
		const { isServer } = options;

		if (!isServer) {
			// We shim fs for things like the blog slugs component
			// where we need fs access in the server-side part
			config.resolve.fallback = {
				fs: false,
				path: false,
			};
		}

		// We need this additional rule to make sure that mjs files are
		// correctly detected within our src/ folder
		config.module.rules.push({
			test: /\.m?js$/,
			use: options.defaultLoaders.babel,
			exclude: /node_modules/,
			type: "javascript/auto",
			resolve: {
				fullySpecified: false,
			},
		});

		return config;
	},
};

export default {
	transpilePackages: transpileModules,
	...config,
};
