import type { ITranslationStorage, IWord } from "./types";

const TRANSLATION_KEY = "translations";
const EXTENSION_DISABLED_KEY = "extensionDisabled";

const ENABLE_EXTENTION_FUNCTIONALITY = true;

export const loadLocalStorage = async (): Promise<IWord[]> => {
  if (!ENABLE_EXTENTION_FUNCTIONALITY) {
    console.log("Chrome Extension functionality disabled globally");
    return [];
  }

  return new Promise((resolve) => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations =
        (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

      resolve(Object.values(translations));
    });
  });
};

export const addToLocalStorage = async (word: IWord) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations =
        (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

      translations[word.id] = { ...word };

      chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, resolve);
    });
  });
};

export const removeFromLocalStorage = async (id: string) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations =
        (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

      delete translations[id];

      chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, resolve);
    });
  });
};

export const disableWordInLocalStorage = (id: string, disabled: boolean) => {
  if (!ENABLE_EXTENTION_FUNCTIONALITY) {
    console.log("Chrome Extension functionality disabled globally");
    return;
  }

  chrome.storage.local.get(TRANSLATION_KEY, (result) => {
    const translations = (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

    const word = translations[id];
    if (!word) return;

    translations[id] = {
      ...word,
      disabled,
    };

    chrome.storage.local.set({ [TRANSLATION_KEY]: translations });
  });
};

export const disableExtension = () => {
  if (!ENABLE_EXTENTION_FUNCTIONALITY) {
    console.log("Chrome Extension functionality disabled globally");
    return;
  }
  chrome.storage.local.get(EXTENSION_DISABLED_KEY, function (result) {
    let disabledHistory: boolean = false;
    if (result && result[EXTENSION_DISABLED_KEY]) {
      disabledHistory = result[EXTENSION_DISABLED_KEY] as boolean;
    }
    chrome.storage.local.set(
      { [EXTENSION_DISABLED_KEY]: !disabledHistory },
      () => {},
    );
  });
};
