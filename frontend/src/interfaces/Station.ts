export interface Station {
  _id: string;
  name: string;
  description?: string;
  streamUrl?: string;
  imageUrl: string;
  location: string;
  genre: string[];
  isActive: boolean;
  type: 'Radio Station' | 'TV Station';
  liveShow?: string;
  listenerz?: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  frequency?: string;

}

export interface StationFormData
  extends Omit<Station, '_id' | 'genre' | 'listenerz' | 'createdBy' | 'updatedBy' | 'deletedBy' | 'deletedAt'> {
  genres: string; // Comma-separated string for form input
  listenerz: string; // String for form input
}