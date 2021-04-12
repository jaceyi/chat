declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare const twemoji: any;

declare module 'draft-js' {
  import { KeyTypes } from 'chatUtils';

  export const EditorState: any;
  export const SelectionState: any;
  export const Modifier: any;
  export const CharacterMetadata: any;
  export const DefaultDraftBlockRenderMap: any;
  export const AtomicBlockUtils: any;
  export const genKey: () => string;
  export const ContentBlock: any;
  export const CompositeDecorator: any;
  export const RichUtils: any;
  export const Editor: any;
  export const convertToRaw: (contentState: any) => any;
  export const convertFromRaw: (raw: any) => any;
  export const getDefaultKeyBinding: (e: KeyboardEvent) => KeyTypes;
  export const KeyBindingUtil: any;
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
