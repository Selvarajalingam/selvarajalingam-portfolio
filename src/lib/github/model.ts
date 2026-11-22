export type RepositoryLink = { name: string; url: string };
export type RepositoryMetadata = { stars: number; forks: number; language: string | null; checkedAt: string };
export type RepositorySnapshot = RepositoryLink & { metadata: RepositoryMetadata | null };
export type GitHubSnapshot = { repositories: RepositorySnapshot[] };
