import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locals/en.json";
import hi from "./locals/hi.json";
import bn from "./locals/bn.json";

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hi: { translation: hi }, bn: { translation: bn } },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;

