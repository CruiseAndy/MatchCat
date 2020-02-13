
/* Types */
import { LANGUAGE_CHANGE } from './types';

/* Tools */

export const languageChange = country => {
  return {
    type: LANGUAGE_CHANGE,
    country
  };
};