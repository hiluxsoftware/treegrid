const { readFileSync } = require("fs");
const { join } = require("path");

const pathCommitInfo = join(process.cwd(), ".gittemplates", "commit");
const contentCommitInfo = readFileSync(pathCommitInfo).toString();

console.log(contentCommitInfo);
