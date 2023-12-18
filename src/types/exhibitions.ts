export interface Exhibition {
  added: Date;
  gallery: string;
  location: string;
  title: string;
  year: number;
}

export default interface Exhibitions {
  [key: string]: Exhibition;
}
