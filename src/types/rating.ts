import {Uncertainty} from "@/types/enums/uncertainty";


export interface Rating {
  totalRating: number;
  codeRating: number;
  taskRating: number;
  taskRatingUncertainty: Uncertainty;
}