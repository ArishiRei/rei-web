export function useContext() {
  const { locale, setLocale } = useI18n()
  const localePath = useLocalePath()

  const setlang = (v: I18nLocales) => {
    setLocale(v)
  }

  return {
    setLocale: setlang,
    locale,
    localePath
  }
}