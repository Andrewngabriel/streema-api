export interface RadioStation {
  name: string | undefined;
  band: string | undefined;
  genre: string[];
  location: string | undefined;
  description?: string | undefined;
  url: string | undefined;
  streamURL?: string | undefined;
  links?: Link[] | undefined;
  thumbnail: Image | undefined;
  img?: Image | undefined;
}

interface CommonAttributes {
  name: string;
  slug: string | undefined;
}

export interface Region extends CommonAttributes { }
export interface Country extends CommonAttributes { }
export interface City extends CommonAttributes { }
export interface Genre extends CommonAttributes { }

export interface Link {
  title: string | undefined;
  url: string;
}

export interface Image {
  url: string | undefined;
  alt: string | undefined;
  width: string | undefined;
  height: string | undefined;
}
