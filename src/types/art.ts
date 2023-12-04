export default interface Art {
  added: Date;
  collection: string;
  imagePath: null | string;
  imageURL: null | string;
  medium: string;
  size: string;
  sold: boolean;
  thumbPath: null | string;
  thumbURL: null | string;
  title: string;
}

export interface ArtFormInfo {
  title: string;
  validTitle: boolean;
  medium: string;
  validMedium: boolean;
  size: string;
  validSize: boolean;
  sold: boolean;
  image: null | File;
  validImage: boolean;
}
