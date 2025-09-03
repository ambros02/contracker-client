



export interface CommitData {
  commitMessage: string;
  commitDate: string
  totalAdditions: number;
  totalDeletions: number;
  changedFileNames: string[];
}
