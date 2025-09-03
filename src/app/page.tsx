'use client';

import styles from "@/styles/app/page.module.css";
import {useEffect} from "react";

export default function Home() {

  useEffect(() => {
    //let data = fetch(" http://127.0.0.1:8080/message")
  }, []);


  return (
    <>
      <h1 className={styles.welcomeText}>Welcome to Contracker where you can track the contributions of individual members of a github project</h1>
      <button className={styles.drawerButton}>go to setup</button>
    </>
  );
}
