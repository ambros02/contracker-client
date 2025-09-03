import {ContributorData} from "@/types/contributorData";


export interface RepositoryData {
  contributorNames: string[];
  startDate: string;
  client: {
    contributors: ContributorData[];
    lastCommitDate: Date;
  }
  server: {
    contributors: ContributorData[];
    lastCommitDate: Date;
  }
  totalTasks: number,
}