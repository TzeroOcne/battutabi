export type Tab = {
  id: string,
  title: string,
  url?: string,
  file?: string,
};

export type LoadOptions = {
  url?: string,
  file?: string,
  visible?: boolean,
};
