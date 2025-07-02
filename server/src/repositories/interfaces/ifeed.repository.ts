export interface iFeedRepository {
      FetchSectionsData(types: string[]): Promise<any[]>;
}

