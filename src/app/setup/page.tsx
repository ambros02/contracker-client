'use client';

import React, {FormEvent, useContext, useEffect, useState} from "react";
import styles from "@/styles/setup/page.module.css"
import {useApi} from "@/hooks/useApi";
import {RepoSetupData} from "@/types/repoSetupData";
import {RepoBasicInfo} from "@/types/repoBasicInfo";
import UsernameDrawer from "@/app/setup/usernameDrawer";


interface RepoResponse {
  serverRepoError?: string;
  serverUsernames?: string[];
  possibleServerUsernames: string[];
  clientRepoError?: string;
  clientUsernames?: string[];
  possibleClientUsernames?: string[];
}

interface UsernameResponse {
  status?: string;
}

export default function SetupPage() {

  const apiService = useApi();
  const [formData, setFormData] = useState<RepoSetupData>();
  const [possibleUsernames, setPossibleUsernames] = useState<string[]>([]);
  const [usernameDrawer, setUsernameDrawer] = useState<boolean>(false);
  const [unmatchedUsernames, setUnmatchedUsernames] = useState<string[]>([]);

  useEffect(() => {
    let previousFilledInformation = localStorage.getItem("repoSetupData");

    if (previousFilledInformation){
      let previous_data = JSON.parse(previousFilledInformation)
      previous_data = {
        ...previous_data,
        projectStartDate: new Date(previous_data.projectStartDate),
      }
      setFormData(previous_data)
    }
    updatePossibleUsernames();
    updateMissingUsernames();
  }, []);

  const updatePossibleUsernames = () => {
    let previousPossibleUsernames = possibleUsernames;
    const possibleClientUsernames = localStorage.getItem("possibleClientUsernames");
    const possibleServerUsernames = localStorage.getItem("possibleServerUsernames");
    if (possibleClientUsernames){
      previousPossibleUsernames = [...previousPossibleUsernames, ...JSON.parse(possibleClientUsernames)]
    }
    if (possibleServerUsernames){
      previousPossibleUsernames = [...previousPossibleUsernames, ...JSON.parse(possibleServerUsernames)]
    }

    setPossibleUsernames((possibleUsernames) => (Array.from(new Set(previousPossibleUsernames))));
  }

  const updateMissingUsernames = () => {
    let missingClientUsernames = localStorage.getItem("unmatchedClient");
    let missingServerUsernames = localStorage.getItem("unmatchedServer");

    let allUnmatchedUsernames = unmatchedUsernames;

    if (missingClientUsernames){
      allUnmatchedUsernames =  [...allUnmatchedUsernames, ...JSON.parse(missingClientUsernames)]
    }
    if (missingServerUsernames){
      allUnmatchedUsernames = [...allUnmatchedUsernames, ...JSON.parse(missingServerUsernames)]
    }

    const uniqueUnmatchedUsernames = Array.from(new Set(allUnmatchedUsernames))
    setUnmatchedUsernames(uniqueUnmatchedUsernames);

  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload: Record<string, FormDataEntryValue> = {}
    formData.forEach((value, key) => {
      payload[key] = value
    })
    if (payload.projectAssociation === "organization") {
      localStorage.setItem("isOrg", JSON.stringify(true));
    } else {
      localStorage.setItem("isOrg", JSON.stringify(false));
    }

    localStorage.setItem("repoSetupData", JSON.stringify(payload))
    const response = await apiService.post<RepoBasicInfo | RepoResponse>("/setup", payload)
    let previousPossibleUsernames = possibleUsernames;

    let unmachtedNamesDialog = false;
    if ("clientRepoError" in response){
      unmachtedNamesDialog = true;
      localStorage.setItem("unmatchedClient", JSON.stringify(response.clientUsernames));
      localStorage.setItem("possibleClientUsernames", JSON.stringify(response.possibleClientUsernames));
      previousPossibleUsernames = [...previousPossibleUsernames, ...response.possibleClientUsernames!];
    }
    if ("serverRepoError" in response){
      unmachtedNamesDialog = true;
      localStorage.setItem("unmatchedServer", JSON.stringify(response.serverUsernames));
      localStorage.setItem("possibleServerUsernames", JSON.stringify(response.possibleServerUsernames));
      previousPossibleUsernames = [...previousPossibleUsernames, ...response.possibleServerUsernames!];
    }
    if (unmachtedNamesDialog){
      alert("unmatched usernames in the repo, please provide appropriate matching and try again");
    }


    updateMissingUsernames();
    setPossibleUsernames((possibleUsernames) => (Array.from(new Set(previousPossibleUsernames))));

    if (!("serverRepoError" in response) && !("clientRepoError" in response)){
      localStorage.setItem("repositoryInfo", JSON.stringify(response));
      localStorage.setItem("contributionsAnalyzed", "false");
      localStorage.setItem("projectAnalyzed", "false");
    }
  }

  const handleUsernameDrawer = () => {
    setUsernameDrawer((usernameDrawer) => (!usernameDrawer));
  }

  const handleSubmitUsernames: React.FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload: Record<string, FormDataEntryValue> = {}
    formData.forEach((value, key) => {
      if (value === ""){
        alert(`please enter a github usernames for all names which do not have a match, missing ${key}`)
        return
      }
      payload[key] = value
    })

    const response: UsernameResponse  = await apiService.post("/usernames", payload)
    if("status" in response){
      alert(response.status)
    }
  }

  const projectAssosicationFormOptions = [
    {
      value: "organization",
      label: "organization",
    },
    {
      value: "user",
      label: "user",
    }
  ]

  return (
    <div className={styles.container}>
      <button onClick={handleUsernameDrawer}>
        check usernames
      </button>
      <UsernameDrawer open={usernameDrawer} onClose={() => setUsernameDrawer(false)}>
      <div>
        <h2>please enter the GitHub usernames for the respective names</h2>
        <form onSubmit={handleSubmitUsernames} className={styles.usernamesForm}>
          {unmatchedUsernames.map((name, index) => (
            <div key={index}>
              <label htmlFor={name}>{name}</label>
              <input type="text" id={name} name={name}/>
            </div>
          ))}
          <button type="submit">submit names</button>
        </form>

        <div className={styles.possibleUsernamesContainer}>
          <h2>possible usernames</h2>
          {possibleUsernames.map((name, index) => (
            <h4 key={index}>{name}</h4>
          ))}
        </div>

      </div>
    </UsernameDrawer>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <label htmlFor="owner">Name of the repository owner / organization</label>
        <input className={styles.formInput} type="text" id="repositoryOwner" name="repositoryOwner" defaultValue={formData?.repositoryOwner}/>
        <label htmlFor="serverRepositoryName">Name of the server repository</label>
        <input className={styles.formInput} type="text" id="serverRepositoryName" name="serverRepositoryName" defaultValue={formData?.serverRepositoryName}/>
        <label htmlFor="clientRepositoryName">Name of the client repository</label>
        <input className={styles.formInput} type="text" id="clientRepositoryName" name="clientRepositoryName" defaultValue={formData?.clientRepositoryName}/>
        <label htmlFor="projectStartDate">Starting date of the project</label>
        <input className={styles.formInput} type="date" id="projectStartDate" name="projectStartDate" defaultValue={formData?.projectStartDate.toISOString().split('T')[0]}/>
        <label htmlFor="projectAssociation">Please select wheter the project is associated with a user or a project</label>
        <select key={formData?.projectAssociation} className={styles.formInput} name="projectAssociation" id="projectAssociation" defaultValue={formData?.projectAssociation}>
          {projectAssosicationFormOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <label htmlFor="projectId">The Id of the project</label>
        <input className={styles.formInput} type="number" id="projectId" name="projectId" defaultValue={formData?.projectId}/>
        <label htmlFor="contributorAmount">Amount of contributors in the project</label>
        <input className={styles.formInput} type="number" id="contributorAmount" name="contributorAmount" defaultValue={formData?.contributorAmount}/>
        <button className={styles.formSubmitButton} type="submit">Submit</button>
      </form>
    </div>
  );
}





