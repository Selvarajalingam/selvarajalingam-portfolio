import { inspectArtifacts } from "./audit-artifacts";
const report = inspectArtifacts();
console.log(JSON.stringify(report, null, 2));
if (report.issues.length) process.exitCode = 1;
