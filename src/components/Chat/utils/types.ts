export type Mutability = 'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED';

export interface UploadFile {
  src: string;
  type: string;
  name: string;
}

export interface Raw {
  blocks: any[];
  entityMap: object;
}

export interface ChangeEditorState {
  (editorState: any): void;
}

export interface Suggestion {
  start: number;
  end: number;
  blockKey: string;
  rect: HTMLSpanElement;
}

export interface ChatStore {
  editor: any;
  suggestion: Suggestion;
}
