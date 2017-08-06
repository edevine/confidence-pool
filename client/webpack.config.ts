import { Configuration } from 'webpack';
import * as path from 'path';

const config: Configuration = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'scripts/app/main.ts'),
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, 'scripts'),
        filename: 'app.js',
    },
};

export default config;
