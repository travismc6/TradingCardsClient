export interface ChecklistCard {
  id: number;
  number: string;
  name: string;
  notes: string;
  brand: number;
  year: number;
  setId: number;
  inCollection: boolean;
  collectionCardId: number | null;
}
