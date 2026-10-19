import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Build a normalized className string from multiple inputs and resolve Tailwind class conflicts.
 *
 * This helper accepts the same kinds of values as clsx (strings, arrays, objects, etc. via ClassValue),
 * combines them into a single string, then passes the result through twMerge to deduplicate and resolve
 * conflicting Tailwind utility classes.
 *
 * @param inputs - One or more ClassValue arguments (strings, arrays, objects, etc.) compatible with clsx.
 * @returns A single string suitable for a React `className` prop with Tailwind classes merged and conflicts resolved.
 *
 * @example
 * // returns "btn btn-primary mt-2"
 * cn('btn', { 'btn-primary': isPrimary }, ['mt-2', conditional && 'hidden'])
 *
 * @see https://github.com/lukeed/clsx
 * @see https://github.com/dcastil/twmerge
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
