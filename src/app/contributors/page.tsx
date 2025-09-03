'use client';

import {useEffect, useState} from "react";
import {ContributorData} from "@/types/contributorData";
import {RepositoryData} from "@/types/repositoryData";
import {CodeContributor} from "@/app/contributors/codeContributor";
import styles from "@/styles/app/contributors/page.module.css"
import {ContributionDisplay} from "@/types/enums/contributionDisplay";
import {TaskContributor} from "@/app/contributors/taskContributor";
import {RatingContributor} from "@/app/contributors/ratingContributor";
import {RepoBasicInfo} from "@/types/repoBasicInfo";


export default function ContributorPage () {

  const [repositoryData, setRepositoryData] = useState<RepositoryData | null>(null)
  const [contributorDisplayData, setContributorDisplayData] = useState<ContributorData | null>(null)
  const [week_numbers, setWeek_numbers] = useState<number[]>([])
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null)
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(0)
  const [selectedMeasurement, setSelectedMeasurement] = useState<ContributionDisplay | null>(null)


  useEffect(() => {
    const contributionsAnalyzed = (!!localStorage.getItem("contributionsAnalyzed"))

    if (contributionsAnalyzed) {
      const clientData = JSON.parse(localStorage.getItem("clientRepositoryData")!);
      const serverData = JSON.parse(localStorage.getItem("serverRepositoryData")!);
      const repositoryInfo: RepoBasicInfo = JSON.parse(localStorage.getItem("repositoryInfo")!);

      const repositoryData: RepositoryData = {
        client: clientData,
        server: serverData,
        contributorNames: repositoryInfo.contributorNames,
        startDate: repositoryInfo.repositoryStartDate as string,
        totalTasks: serverData.totalTasks,
      }

      console.log(repositoryData)

      setRepositoryData(
        repositoryData
      );
    }
  }, []);

  useEffect(() => {
    if (selectedContributor && (selectedMeasurement != null)) {
       if (selectedMeasurement === ContributionDisplay.TASKS){
        getTasks(selectedContributor);
      } else if (selectedMeasurement === ContributionDisplay.CODING){
         getContributionsFromWeek(selectedContributor, selectedWeekNumber);
       } else if (selectedMeasurement === ContributionDisplay.PULLREQUESTS){
         //TODO implement site for pull requests
       }
    }
  }, [selectedContributor, selectedWeekNumber, selectedMeasurement]);

  useEffect(() => {
    console.log("hi")
    console.log(repositoryData)
    const first_date = repositoryData?.startDate;
    const last_date = repositoryData?.server.lastCommitDate;

    if(first_date && last_date){
      const milliseconds_per_week = 1000 * 60 * 60 * 24 * 7
      const first_day = new Date(first_date);
      const last_day = new Date(last_date);
      const diff_in_milliseconds = last_day.getTime() - first_day.getTime();
      const amountWeeks = Math.ceil(diff_in_milliseconds/milliseconds_per_week)
      const week_range = () => Array.from({length: amountWeeks}, (_, i) => i);
      setWeek_numbers(week_range())
    }

  }, [repositoryData]);

  const handleContributorSelection = (username: string) => {
    setSelectedContributor(username);
  }


  /*
  week_end_datetime_midnight = pytz.utc.localize(datetime.combine(week_start, datetime.min.time()) + timedelta(days=7))
  commits_in_week = []
  if branch_name in self.__commits.keys():
    for commit in self.__commits[branch_name]:
      if commit.get_date() <= week_end_datetime_midnight:
        commits_in_week.append(commit)
    return commits_in_week
  else:
    raise AttributeError(f"{self.__github_username} does not have commits on branch {branch_name}, make sure that you analyzed it beforehand")

   */

  const getTasks = (contributorUsername: string) => {
    console.log(repositoryData)
    const displayUnfilteredContributor: ContributorData = repositoryData!.server.contributors.find(con => con.githubUsername === contributorUsername)!;

    setContributorDisplayData(displayUnfilteredContributor);
  }

  const getContributionsFromWeek = (contributorUsername: string, weekNumber: number) => {
    const first_date = repositoryData?.startDate;
    const last_date = repositoryData?.server.lastCommitDate;
    if (!(first_date && last_date)){
      alert("please set a starting date in the setup")
    } else {

      //TODO: add handling for server/client
      const displayUnfilteredContributor: ContributorData = repositoryData.server.contributors.find((con: ContributorData) => con.githubUsername === contributorUsername)!;

      if (weekNumber === 0){
        setContributorDisplayData(displayUnfilteredContributor);
      } else{
        const firstDay= new Date(first_date);
        const firstWeekDay = new Date(firstDay.getTime() + (1000 * 60 * 60 * 24 * (7*(weekNumber-1))));
        const lastWeekDay = new Date(firstWeekDay.getTime() + (1000 * 60 * 60 * 24 * 7));

        let displayCommits = []


        for (let commit of displayUnfilteredContributor.commits) {
          if (new Date(commit.commitDate) < firstWeekDay){
            continue;
          } else if (new Date(commit.commitDate) < lastWeekDay){
            displayCommits.push(commit);
          } else {
            break
          }
        }

        const displayContributorData: ContributorData = {
          ...displayUnfilteredContributor,
          commits: displayCommits,
        }
        setContributorDisplayData(displayContributorData);
      }
    }
  }

  const handleMeasurementSelection = (measurement: ContributionDisplay) => {
    setSelectedMeasurement(measurement);
  }

  const handleWeekSelection = (weekNumber: number) => {
    setSelectedWeekNumber(weekNumber);
  }

  return (
    <div>
      <div className={styles.selectionContainer}>
        {
          repositoryData ? (
            repositoryData.contributorNames.map((contributorName: string) => (
              <button
                className={styles.selectionButtons}
                key={contributorName}
                onClick={() => handleContributorSelection(contributorName)}
              >{contributorName}</button>
              ))
          ) : <p>there are no contributors yet, analyze the repo first</p>
        }
      </div>

      <div className={styles.selectionContainer}>
        <button className={styles.selectionButtons} onClick={() => handleMeasurementSelection(ContributionDisplay.RATING)}>Rating</button>
        <button className={styles.selectionButtons} onClick={() => handleMeasurementSelection(ContributionDisplay.TASKS)}>Tasks</button>
        <button className={styles.selectionButtons} onClick={() => handleMeasurementSelection(ContributionDisplay.CODING)}>Coding sessions</button>
        <button className={styles.selectionButtons} onClick={() => handleMeasurementSelection(ContributionDisplay.PULLREQUESTS)}>Pull Requests</button>
      </div>

      <div>
        {
          (repositoryData && selectedMeasurement === ContributionDisplay.CODING) ? (
            <div className={styles.selectionContainer}>
              <button className={styles.selectionButtons} onClick={() => {handleWeekSelection(0)}}>
                Overall
              </button>
              {week_numbers.map((number) => (
                <button
                  className={styles.selectionButtons}
                  key={number}
                  onClick={() => {handleWeekSelection(number+1)}}
                >{`Week ${number + 1}`}</button>
              ))}
            </div>
          ) : <></>
        }
      </div>

      {
        (contributorDisplayData && selectedMeasurement === ContributionDisplay.RATING) ? (
          <div>
            <RatingContributor key={contributorDisplayData.githubUsername} contributor={contributorDisplayData} />
          </div>
        ) : <></>
      }

      {
        (contributorDisplayData && selectedMeasurement === ContributionDisplay.CODING) ? (
          <div>
            <CodeContributor key={contributorDisplayData.githubUsername} contributor={contributorDisplayData} />
          </div>
        ) : <></>
      }

      {
        (contributorDisplayData && selectedMeasurement === ContributionDisplay.TASKS) ? (
          <div>
            <TaskContributor key={contributorDisplayData.githubUsername} contributor={contributorDisplayData} />
          </div>
        ) : <></>
      }

    </div>
  )
}