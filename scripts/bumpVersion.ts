import { spawnSync } from "node:child_process";
import GitBranch from "git-branch";
import npmWhich from "npm-which";

(
    async () =>
    {
        let branchName = await GitBranch(__dirname);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(__dirname).sync("npm"),
                [
                    "--no-git-tag-version",
                    "version",
                    "--workspaces",
                    releaseName,
                    "--allow-same-version"
                ]);

            spawnSync(
                npmWhich(__dirname).sync("git"),
                [
                    "commit",
                    "-a",
                    "-m",
                    `Bump the version number to ${releaseName}`
                ]);
        }
        else
        {
            console.error(`This method is not allowed on the current branch \`${branchName}\``);
        }
    })();
