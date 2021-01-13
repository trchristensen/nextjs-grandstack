module.exports = {
  env: {
    BASEPATH: "http://localhost:3000",
    NEO4J_URI: "bolt://100.26.226.98:34603",
    NEO4J_USER: "neo4j",
    NEO4J_PASSWORD: "science-sentry-delegate",
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: [
        {
          loader: "comlink-loader",
          options: {
            singleton: true,
            name: "static/[hash].worker.js",
            publicPath: "/_next/",
          },
        },
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    return config;
  },
};
