import { pad } from "dabbjs";

/**
 * converts an string to a number, or NaN if invalid integer
 * @param number string representation of a number
 * @returns 
 */
export function integer(number: any) {
	return ~~number == number ? ~~number : NaN;
	//https://stackoverflow.com/questions/4168360/convert-an-entire-string-into-an-integer-in-javascript
}

/**
 * divides a string into chunks starting from the left
 * @param sStr string to divide into chunks
 * @param iLen chunk length
 * @returns array of strings
 */
export const chunkString = (sStr: string, iLen: number) => {
	return [...sStr].reduce((aChunks: string[], sChar, iIdx) => (
		aChunks.push(iIdx % iLen === 0 ? sChar : aChunks.pop() + sChar), aChunks), [])
}

export const chunkRightString = (sStr: string, iLen: number) => {
	const reverse = (s: string) => s.split('').reverse().join('');
	return reverse(chunkString(reverse(sStr), iLen).join(".")).split(".")
}

/**
 * padd left
 * @param t string
 * @param e amount
 * @param ch char
 * @returns 
 */
export const padRight = (t: string, e: number, ch: string) => t + new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch || '0');

/**
 * removes trailing, right most 0s from a number
 * @param num number
 * @returns 11111000b 248d turns to 00011111b 31d
 */
export const removeTrailingZeros = (num: number): number => {
	if (num != 0) {
		while (num % 2 == 0)
			num = num >> 1;
	}
	return num
}

/**
 * converts a numerical value into a binary number
 * @param value numeric value
 * @param digits digits to pad with 0s
 * @returns 
 */
export const binary = (value: number, digits?: number) => digits ? pad(value.toString(2), digits || 8, '0') : value.toString(2);
