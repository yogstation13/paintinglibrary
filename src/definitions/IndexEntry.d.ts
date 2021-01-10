declare interface IndexEntry {
  mtime: string;
  name: string;
  size: number;
  type: string;
}

declare interface Info {
  title: string;
  md5: string;
  ckey: string;
}

declare type Entry = Info & {
  dataUrl: string | null;
}
