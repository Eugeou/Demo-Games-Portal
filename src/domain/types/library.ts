export type LibraryList = {
  saved: string[];
  liked: string[];
};

export type LibraryToggleResult = {
  active: boolean;
  ids: string[];
};
