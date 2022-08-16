import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Dictionary, Package } from "@manuth/package-json-editor";
import fs from "fs-extra";
import GitBranch from "git-branch";
import G from "glob";
import npmWhich from "npm-which";

const { pathExists, writeJSON } = fs;
const { glob } = G;

(
    async () =>
    {
        let dirName = dirname(fileURLToPath(import.meta.url));
        let branchName = await GitBranch(dirName);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");
        let rootPackage = new Package(join(dirName, "..", Package.FileName));
        let workspacePackages: Package[] = [];
        let workspacePaths: string[];

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(dirName).sync("npm"),
                [
                    "version",
                    "--no-git-tag-version",
                    "--workspaces",
                    releaseName,
                    "--allow-same-version"
                ]);

            let workspaceSetting = rootPackage.AdditionalProperties.Get("workspaces");

            if (Array.isArray(workspaceSetting))
            {
                workspacePaths = workspaceSetting;
            }
            else
            {
                workspacePaths = (workspaceSetting as any)?.packages ?? [];
            }

            for (let pattern of workspacePaths)
            {
                for (let workspacePath of glob.sync(pattern, { cwd: dirname(rootPackage.FileName) }))
                {
                    let packageFileName = join(workspacePath, Package.FileName);

                    if (await pathExists(packageFileName))
                    {
                        workspacePackages.push(new Package(packageFileName));
                    }
                }
            }

            for (let workspacePackage of workspacePackages)
            {
                for (let dependencyCandidate of workspacePackages)
                {
                    for (let entry of [
                        [workspacePackage.Dependencies, "--save"],
                        [workspacePackage.DevelopmentDependencies, "--save-dev"],
                        [workspacePackage.OptionalDependencies, "--save-optional"],
                        [workspacePackage.PeerDependencies, "--save-peer"]
                    ] as Array<[Dictionary<string, string>, string]>)
                    {
                        if (entry[0].Has(dependencyCandidate.Name))
                        {
                            entry[0].Remove(dependencyCandidate.Name);

                            await writeJSON(
                                workspacePackage.FileName,
                                workspacePackage.ToJSON(),
                                {
                                    spaces: 2
                                });

                            spawnSync(
                                npmWhich(dirName).sync("npm"),
                                [
                                    "install",
                                    "--ignore-scripts",
                                    "--no-audit",
                                    "--workspace",
                                    workspacePackage.Name,
                                    entry[1],
                                    dependencyCandidate.Name
                                ]);
                        }
                    }
                }
            }

            spawnSync(
                npmWhich(dirName).sync("git"),
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
