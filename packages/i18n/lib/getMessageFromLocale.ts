/**
 * This file is generated by generate-i18n.mjs
 * Do not edit this file directly
 */
import zh_CNMessage from '../locales/zh_CN/messages.json';

export function getMessageFromLocale(locale: string) {
  switch (locale) {
    case 'zh_CN':
      return zh_CNMessage;
    default:
      throw new Error('Unsupported locale');
  }
}

export const defaultLocale = (() => {
  const locales = ['zh_CN'];
  const firstLocale = locales[0];
  const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale.replace('-', '_');
  if (locales.includes(defaultLocale)) {
    return defaultLocale;
  }
  const defaultLocaleWithoutRegion = defaultLocale.split('_')[0];
  if (locales.includes(defaultLocaleWithoutRegion)) {
    return defaultLocaleWithoutRegion;
  }
  return firstLocale;
})();
