export interface CollectionDetails {
  id: number;
  totalCards: number;
  collectionSets: CollectionSetDetails[];
}

export interface CollectionSetDetails {
  setId: number;
  setName: string;
  setYear: number;
  brandId: number;
  setCount: number;
  collectionCount: number;
  uniqueCollectionCount: number;
}
