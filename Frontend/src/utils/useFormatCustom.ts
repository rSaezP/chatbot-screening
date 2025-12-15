export default function useFormatCustom() {

  function formatLargeNumber(value: number, locale: string = 'en') {
    return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value)
  }

  function formatSpacesUnderscores(value: string) {
    return value.replace(/\s+/g, '_');
  }

  return { 
    formatLargeNumber,
    formatSpacesUnderscores
  } 
}