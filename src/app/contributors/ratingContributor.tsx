import {ContributorData} from "@/types/contributorData";
import styles from "@/styles/app/contributors/taskContributor.module.css";


interface ContributorProps {
  contributor: ContributorData
}

export const RatingContributor = ({contributor}: ContributorProps) => {


  return (
    <div className={styles.contributorContainer}>
      <h1>{contributor.githubUsername}</h1>
      <h2>{`total rating client: ${contributor.clientRating.totalRating}`}</h2>
      <h4>{`code rating: ${contributor.clientRating.codeRating}`}</h4>
      <h4>{`task rating: ${contributor.clientRating.taskRating}`}</h4>
      <h4>{`task rating uncertainty: ${contributor.clientRating.taskRatingUncertainty}`}</h4>
      <h2>{`total rating server: ${contributor.serverRating.totalRating}`}</h2>
      <h4>{`code rating: ${contributor.serverRating.codeRating}`}</h4>
      <h4>{`task rating: ${contributor.serverRating.taskRating}`}</h4>
      <h4>{`task rating uncertainty: ${contributor.serverRating.taskRatingUncertainty}`}</h4>
    </div>
  )
}