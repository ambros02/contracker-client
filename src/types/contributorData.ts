import {CommitData} from "@/types/commitData";
import {PullRequestData} from "@/types/pullRequestData";
import {TaskData} from "@/types/taskData";
import {Rating} from "@/types/rating";


export interface ContributorData {
  githubUsername: string;
  commits: CommitData[];
  pullRequests: PullRequestData[];
  totalLinesContributed: number;
  completedTasks: TaskData[];
  clientRating: Rating;
  serverRating: Rating;
}
