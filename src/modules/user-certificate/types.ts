


export interface UserCertificate {
  id: string;
  user: {
    phone_number: string;
    email: string | null;
  };
  course: {
    name: string;
  }[];
  profile: {
    first_name: string;
    last_name: string;
    address: {
      country: string;
      region: string;
      district: string;
      neighborhood: string;
    };
  };
}
