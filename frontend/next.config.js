const { i18n } = require("./next-i18next.config");


/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: /\.css?$/,
                loader: "url-loader",
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                issuer: /\.[jt]sx?$/,
                use: ["babel-loader", "@svgr/webpack", "url-loader"],
            }
        );

        return config;
    },
    reactStrictMode: true,
    i18n,
};

module.exports = nextConfig;
