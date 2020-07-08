import { spawnSync } from "child_process";
import branch = require("git-branch");
import npmWhich = require("npm-which");

(
    async () =>
    {
        let branchName = await branch(__dirname);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(__dirname).sync("lerna"),
                [
                    "version",
                    releaseName,
                    "-y"
                ]);
        }
        else
        {
            console.error(`This method is not allowed on the current branch \`${branchName}\``);
        }
    })();
