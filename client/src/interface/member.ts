export interface Member {
  id: string;
  dateOfBirth: string; // Returned as string from API
  imageUrl?: string; // Optional (user may not have image)
  displayName: string;
  created: string; // ISO date string
  lastActive: string; // ISO date string
  gender: string;
  description?: string; // Optional (not required at signup)
  city: string;
  country: string;
}

export interface EditableMember {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}
