import { BrandsEnum } from "./BrandsEnum";

export interface CardParams {
  year?: number | null;
  brand?: BrandsEnum[] | null;
  name?: string | null;
}
