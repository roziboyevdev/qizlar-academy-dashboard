export interface Profile {
  first_name: string;
  last_name: string;
  source: string;
}

export interface Donation {
  id: string;
  amount: number;
  provider: string;
  profile: Profile | {};
  date: string;
}



