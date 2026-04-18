export interface OfflineStore {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  hours: StoreHours[];
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  description: string;
}

export interface StoreHours {
  days: string;
  open: string;
  close: string;
}
