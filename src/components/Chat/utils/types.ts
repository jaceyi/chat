import type { KeyTypes } from 'chatUtils/bindKeyBindingFn';

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

export interface SetEditorState {
  (editorState: any): void;
}

export interface Suggestion {
  start: number;
  end: number;
  blockKey: string;
  rect: HTMLSpanElement | null;
}

export interface ChatStore {
  editor?: any;
  suggestion?: Suggestion | null;
  onViewerImage?: (data: { src: string; name: string }) => void;
  getWrapperWidth?: () => number;
  onResize?: Function;
  [prop: string]: any;
}

export type DraftHandleValue = 'handled' | 'not-handled';

export interface HandleKeyCommand {
  (command: KeyTypes, editorState: any): DraftHandleValue;
}

export type KeyCommand = Map<string, HandleKeyCommand>;
