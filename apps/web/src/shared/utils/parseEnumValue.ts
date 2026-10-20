/** Returns the enum member matching `value`, or undefined for empty or unknown input. */
export const parseEnumValue = <T extends string>(
	enumObject: Readonly<Record<string, T>>,
	value: string,
): T | undefined => Object.values(enumObject).find((member) => member === value);
