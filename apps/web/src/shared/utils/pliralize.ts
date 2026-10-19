/**
 * Returns the plural form of a given English word.
 *
 * This function applies basic English pluralization rules:
 * - If the word ends with 'y', it replaces the 'y' with 'ies'.
 * - If the word ends with 's', it appends 'es' to the word.
 * - Otherwise, it simply appends 's' to the word.
 *
 * Note: This function does not handle all irregular plural forms or complex English pluralization rules.
 *
 * @param word - The singular form of the word to pluralize.
 * @returns The pluralized form of the input word.
 *
 * @example
 * ```typescript
 * pluralize('city'); // returns 'cities'
 * pluralize('bus');  // returns 'buses'
 * pluralize('cat');  // returns 'cats'
 * ```
 */
export const pluralize = (word: string) => {
	if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
	if (word.endsWith('s')) return word + 'es';
	return word + 's';
};
