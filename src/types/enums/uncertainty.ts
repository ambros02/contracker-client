


export enum Uncertainty {
  LOW,
  MEDIUM,
  HIGH,
  ABSOLUTE,
}

export const uncertaintyConverter = (uncertainty: any) => {

  console.log("hi")
  console.log(uncertainty)

  if (uncertainty === "LOW"){
    return Uncertainty.LOW
  } else if (uncertainty === "MEDIUM"){
    return Uncertainty.MEDIUM
  } else if (uncertainty === "HIGH"){
    return Uncertainty.HIGH
  } else if (uncertainty === "ABSOLUTE"){
    return Uncertainty.ABSOLUTE
  } else {
    throw new Error(`Unrecognized uncertainty: ${uncertainty}`)
  }
}
