import type { ITranslationStorage, IWord } from "./types";

const TRANSLATION_KEY = "translations";
const EXTENSION_DISABLED_KEY = "extensionDisabled";

const ENABLE_EXTENTION_FUNCTIONALITY = true;

export const loadLocalStorage = async (): Promise<IWord[]> => {
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return new Promise((resolve) => resolve([]));
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
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return new Promise((resolve) => resolve([]));
  }

  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations =
        (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

      if (translations[word.originalWord] != null) {
        reject(new Error("Word already exits"));
      }

      translations[word.originalWord] = { ...word };

      chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, resolve);
    });
  });
};

export const removeFromLocalStorage = async (originalWord: string) => {
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return new Promise((resolve) => resolve([]));
  }
  return new Promise<void>((resolve) => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations =
        (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

      delete translations[originalWord];

      chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, resolve);
    });
  });
};

export const disableWordInLocalStorage = (
  originalWord: string,
  disabled: boolean,
) => {
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return;
  }

  chrome.storage.local.get(TRANSLATION_KEY, (result) => {
    const translations = (result[TRANSLATION_KEY] as ITranslationStorage) ?? {};

    const word = translations[originalWord];
    if (!word) return;

    translations[originalWord] = {
      ...word,
      disabled,
    };

    chrome.storage.local.set({ [TRANSLATION_KEY]: translations });
  });
};

export const disableExtension = (newDisabledState: boolean) => {
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return new Promise((resolve) => resolve([]));
  }

  chrome.storage.local.set(
    { [EXTENSION_DISABLED_KEY]: newDisabledState },
    () => {},
  );
};

export const isExtensionDisabledGlobally = async () => {
  if (
    !ENABLE_EXTENTION_FUNCTIONALITY ||
    typeof chrome === "undefined" ||
    !chrome.storage?.local
  ) {
    console.log("Chrome Extension functionality disabled globally");
    return new Promise<boolean>((resolve) => resolve(false));
  }

  return await new Promise<boolean>((resolve) => {
    chrome.storage.local.get(EXTENSION_DISABLED_KEY, function (result) {
      let disabledHistory: boolean = false;

      if (result && result[EXTENSION_DISABLED_KEY]) {
        disabledHistory = result[EXTENSION_DISABLED_KEY] as boolean;
        resolve(disabledHistory == true);
      } else {
        resolve(false);
      }
    });
  });
};
