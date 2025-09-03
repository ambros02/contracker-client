'use client';

import {useEffect, useState} from "react";
import {RepositoryData} from "@/types/repositoryData";
import {RepoSetupData} from "@/types/repoSetupData";
import {useApi} from "@/hooks/useApi";
import {RepoBasicInfo} from "@/types/repoBasicInfo";
import {ContributorData} from "@/types/contributorData";
import {uncertaintyConverter} from "@/types/enums/uncertainty";
import {Rating} from "@/types/rating";

import styles from "@/styles/repository/page.module.css"


interface AnalyzeRepoResponse {
  clientRepository: RepositoryData;
  serverRepository: RepositoryData;
}

interface RatingResponse {
  clientRatings: RatingValues;
  serverRatings: RatingValues;
}

interface RatingValues {
  [contributorNames: string]: Rating;
}

export default function RepositoryPage() {

  const [repoData, setRepoData] = useState<RepoBasicInfo | null>(null);
  const [contributorNames, setContributorNames] = useState<Record<string, boolean>>({});
  const apiService = useApi();

  useEffect(() => {

    const repositoryData = localStorage.getItem("repositoryInfo");
    if (repositoryData) {
      const repositoryInfo: RepoBasicInfo = JSON.parse(repositoryData);
      console.log("hi")
      console.log(repositoryInfo);
      setRepoData(repositoryInfo);

      let contributorNameMap: Record<string, boolean> = {};
      const previousNames = localStorage.getItem("contributorNames");
      if (previousNames){
        contributorNameMap = JSON.parse(previousNames);
      } else {
        repositoryInfo.contributorNames.forEach((name: string) => {
          contributorNameMap[name] = false;
        });
      }

      setContributorNames(contributorNameMap);
    }
  }, []);

  const analyzeRepo = async () => {
    const repoSetupData: RepoSetupData = JSON.parse(localStorage.getItem("repoSetupData")!);
    const payload = {
      repositoryOwner: repoSetupData.repositoryOwner,
      clientRepositoryName: repoSetupData.clientRepositoryName,
      serverRepositoryName: repoSetupData.serverRepositoryName,
      branchName: "main"
    }
    const response: AnalyzeRepoResponse = await apiService.post("/contributions", payload);

    localStorage.setItem("serverRepositoryData", JSON.stringify(response.serverRepository));
    localStorage.setItem("clientRepositoryData", JSON.stringify(response.clientRepository));
    localStorage.setItem("contributionsAnalyzed", "true");



    await analyzeProject(repoSetupData.projectId);
    console.log("getting ratings")
    await getRatings();
    console.log("ratings done")
    alert("finished analyzing repositories");

  }

  const analyzeProject = async (projectId: number) => {
    const isOrg = JSON.parse(localStorage.getItem("isOrg")!);
    const repoSetupData: RepoSetupData = JSON.parse(localStorage.getItem("repoSetupData")!);

    const payload = {
      repositoryOwner: repoSetupData.repositoryOwner,
      projectId: projectId,
      isOrg: isOrg
    }

    const response = await apiService.post("/project", payload)

    localStorage.setItem("serverRepositoryData", JSON.stringify(response));
    localStorage.setItem("projectAnalyzed", "true");
  }

  const getRatings = async () => {
    const response: RatingResponse = await apiService.get("/ratings")



    const serverResponse = response.serverRatings;
    const clientResponse = response.clientRatings;

    let serverData  = JSON.parse(localStorage.getItem("serverRepositoryData")!);
    let clientData  = JSON.parse(localStorage.getItem("clientRepositoryData")!);

    for (const [githubUsername, rating] of Object.entries(serverResponse)) {
      let contributor: ContributorData = serverData.contributors.find((con: ContributorData) => con.githubUsername === githubUsername);

      let contributorClientRating = clientResponse[contributor.githubUsername];
      let contributorServerRating = serverResponse[contributor.githubUsername];

      console.log("hoi")
      console.log(clientResponse)
      console.log(contributor.githubUsername)
      console.log(contributorClientRating)

      contributorClientRating = {
        ...contributorClientRating,
        taskRatingUncertainty: uncertaintyConverter(contributorClientRating.taskRatingUncertainty)
      }

      contributorServerRating = {
        ...contributorServerRating,
        taskRatingUncertainty: uncertaintyConverter(contributorServerRating.taskRatingUncertainty)
      }

      contributor = {
        ...contributor,
        clientRating: contributorClientRating,
        serverRating: contributorServerRating,
      }

      console.log(contributor);
    }



    localStorage.setItem("serverRepositoryData", JSON.stringify(serverData));
    localStorage.setItem("clientRepositoryData", JSON.stringify(clientData));
  }

  const handleUserButton = (githubUsername: string) => {
    setContributorNames((contributorNames: Record<string, boolean>) => (
      {
        ...contributorNames,
        [githubUsername]: !contributorNames[githubUsername],
      }
    ))
    console.log(contributorNames);
  }

  const sendContributorsSelection = async () => {

    const relevantContributors = Object.entries(contributorNames).filter(([name, crossed]) => (!crossed)).map(([name, crossed]) => name);
    const payload = {"contributorNames": relevantContributors}

    await apiService.post("/contributors", payload);
    localStorage.setItem("contributorNames", JSON.stringify(contributorNames));
  }

  return (
    <div>
      {
        repoData?.repositoryStartDate ? (
          <div>
            <h1>Project starting date</h1>
            <p>{repoData.repositoryStartDate}</p>
          </div>
        ) : <p>did not load start date yet</p>
      }
      <h1 className={styles.contributorTitle}>contributors</h1>
      {
          contributorNames ? (
          <div className={styles.contributorContainer}>
            {Object.keys(contributorNames).map((contributorName, index) => (
              <button
                key={index}
                className={
                contributorNames[contributorName] ? `${styles.contributorButton} ${styles.contributorButtonDisabled}` : styles.contributorButton
              }
                onClick={() => handleUserButton(contributorName)}
              >{contributorName}</button>
            ))}
          </div>
        ) : <p>did not load contributors yet</p>
      }
      {
        repoData ? (
          <div className={styles.buttonContainer}>
            <button className={styles.analyzeButton} onClick={sendContributorsSelection}>set Contributors</button>
            <button className={styles.analyzeButton} onClick={() => analyzeRepo()}>analyze repository</button>
          </div>
        ) : <p>load a repository first so you can analyze it</p>
      }
    </div>
  )
}