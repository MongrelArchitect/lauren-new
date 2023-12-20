export interface Exhibition {
  added: Date;
  exhibitionId?: string;
  gallery: null | string;
  location: string;
  title: string;
  year: number;
}

export default interface Exhibitions {
  [key: string]: Exhibition;
}
