'use client';

import React, {useState} from "react";
import styles from "@/styles/app/page.module.css";
import {useRouter} from "next/navigation";




export const MainDrawer: React.FC<{}> = () => {

  const router = useRouter();


  const displayEdit: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.push("/setup");
  }

  const displayRepository: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.push("/repository")
  }

  const displayContributors: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.push("/contributors");
  }

  return (
    <div className={styles.leftDrawer}>
      <button className={styles.drawerButton} onClick={displayRepository}>repository data</button>
      <button className={styles.drawerButton} onClick={displayContributors}>contributor data</button>
      <button className={styles.drawerButton} onClick={displayEdit}>edit information</button>
    </div>
  )
}