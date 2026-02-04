export interface IWordData {
  replace: string;
  disable: boolean;
}

export interface IWord {
  id: string;
  originalWord: string;
  replaceWord: string;
  disabled: boolean;
}

export type ITranslationStorage = Record<string, IWord>;
