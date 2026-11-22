import { githubCuration } from "../src/lib/content/github";
import { fetchRepositorySnapshots } from "../src/lib/github/provider";

const snapshot = await fetchRepositorySnapshots(githubCuration, { token: process.env.GITHUB_TOKEN });
console.log(JSON.stringify(snapshot, null, 2));
if (snapshot.repositories.some((repository) => repository.metadata === null)) process.exitCode = 1;
