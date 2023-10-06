export interface CollectionCard {
  id: number;
  number: string;
  name: string;
  notes: string;
  setName: string;
  brandName: string;
  year: number;
  grade: number | null;
  frontImageUrl: string;
  backImageUrl: string;
  defaultFrontImageUrl: string;
  defaultBackImageUrl: string;
}
