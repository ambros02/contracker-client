import {ContributorData} from "@/types/contributorData";

import styles from "@/styles/app/contributors/codeContributor.module.css"


interface ContributorProps {
  contributor: ContributorData
}

export const CodeContributor: React.FC<ContributorProps> = ({contributor}) => {

  return (
    <div className={styles.contributorContainer}>
      <h1>{`github username: ${contributor.githubUsername}`}</h1>
      <p>{`total lines contributed to final project: ${contributor.totalLinesContributed}`}</p>
      <ul>
        {
          contributor.commits.map((commit, index) => (
            <li key={index} className={styles.commitListItems}>
              <div>
                <h3>{`commit number: ${index+1}`}</h3>
                <h3>{`commit date: ${commit.commitDate}`}</h3>
                <p>{`commit message: ${commit.commitMessage}`}</p>
                <p>{`total additions: ${commit.totalAdditions}`}</p>
                <p>{`total deletions: ${commit.totalDeletions}`}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}