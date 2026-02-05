export interface IWord {
  id: string;
  originalWord: string;
  replaceWord: string;
  disabled: boolean;
}

export type ITranslationStorage = Record<string, IWord>;
