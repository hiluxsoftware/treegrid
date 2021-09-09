"use strict";

import { existsSync, realpathSync } from "fs";
import { delimiter, isAbsolute, resolve } from "path";
import { dotenv } from "./paths";

delete require.cache[require.resolve("./paths")];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
    throw new Error(
        "The NODE_ENV environment variable is required but was not specified."
    );
}

const dotenvFiles = [
    `${dotenv}.${NODE_ENV}.local`,
    NODE_ENV !== "test" && `${dotenv}.local`,
    `${dotenv}.${NODE_ENV}`,
    dotenv,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
    if (existsSync(dotenvFile)) {
        require("dotenv-expand")(
            require("dotenv").config({
                path: dotenvFile,
            })
        );
    }
});

const appDirectory = realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(delimiter)
    .filter((folder) => folder && !isAbsolute(folder))
    .map((folder) => resolve(appDirectory, folder))
    .join(delimiter);

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
    const raw = Object.keys(process.env)
        .filter((key) => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                NODE_ENV: process.env.NODE_ENV || "development",
                PUBLIC_URL: publicUrl,
                WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
                WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
                WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
                FAST_REFRESH: process.env.FAST_REFRESH !== "false",
            }
        );
    const stringified = {
        "process.env": Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

    return { raw, stringified };
}

export default getClientEnvironment;
