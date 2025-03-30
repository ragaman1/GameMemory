export type User = {
    id: string;
    username: string;
    createdAt: number;
  };
  
  export type UserScore = {
    userId: string;
    username: string;
    score: number;
    level: number;
    date: number;
  };
  
  export type UserSession = {
    user: User | null;
    isAuthenticated: boolean;
  };