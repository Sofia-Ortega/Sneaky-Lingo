export interface IWord {
  originalWord: string;
  replaceWord: string;
  disabled: boolean;
}

export type ITranslationStorage = Record<string, IWord>;
