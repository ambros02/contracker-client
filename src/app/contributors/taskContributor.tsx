import {ContributorData} from "@/types/contributorData";
import styles from "@/styles/app/contributors/taskContributor.module.css";


interface ContributorProps {
  contributor: ContributorData
}

export const TaskContributor = ({contributor}: ContributorProps) => {


  return (
    <div className={styles.contributorContainer}>
      <h1>{contributor.githubUsername}</h1>
      <p>{`total tasks contributed to final project: ${contributor.completedTasks.length}`}</p>
      <ul>
        {
          contributor.completedTasks.map((task, index) => (
            <li key={index} className={styles.taskListItems}>
              <div>
                <h3>{`task number: ${task.id}`}</h3>
                <h3>{`task: ${task.title}`}</h3>
                <h3>{`task status: ${task.status}`}</h3>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}




export interface TaskData {
  id: number;
  title: string;
  milestone: number;
  timeEstimate: number;
  week: number;
  priority: string;
  status: string;
  assignees: string[];
}
