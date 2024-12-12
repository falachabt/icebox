// types/criterion.ts
export interface Criterion {
    id: string;
    name: string;
    description: string;
    weight: number;
    isVotable: boolean;
    createdAt: Date;
    updatedAt: Date;
  }