import { isArray, isString } from 'lodash';
import UrlPattern from 'url-pattern';

export function isUrlMatch(urlToMatch: string, urlTemplate: string): boolean;
export function isUrlMatch(urlToMatch: string, urlTemplate: string[]): boolean;
export function isUrlMatch(urlToMatch: any, urlTemplate: any): boolean {
  if (isArray(urlTemplate)) {
    const urlMatches = urlTemplate.filter((url: string) => {
      const pattern = new UrlPattern(url);
      const match = pattern.match(urlToMatch);
      return match && true;
    });

    return urlMatches.length ? true : false;
  }

  if (isString(urlTemplate)) {
    const pattern = new UrlPattern(urlTemplate);
    return pattern.match(urlToMatch) && true;
  }

  return false;
}
