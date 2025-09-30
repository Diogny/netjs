export const
	NetworkClassAny = "Class Any",
	NetworkClassA = "Class A",
	NetworkClassB = "Class B",
	NetworkClassC = "Class C",
	NetworkClassD = "Class D",
	NetworkClassE = "Class E";

export const NetClassArray = [NetworkClassA, NetworkClassB, NetworkClassC, NetworkClassD, NetworkClassE] as const;
export type NetClassType = typeof NetworkClassAny | typeof NetClassArray[number];

export
	const NetClassArrayMap = [
		/**
		 * Class A  0xxx    0000(0)  - 0111(7)	 0-127
		 * private 10.0.0.0 - 10.255.255.255
		 * loopback 127.0.0.0 - 127.255.255.255 localhost 127.0.0.1
		 * default mask 255.0.0.0		/8			starts at /8	10 = 00001010
		 */
		0, 0, 0, 0, 0, 0, 0, 0,
		/**
		 * Class B  10xx	1000(8)  - 1011(11)	 128-191
		 * private 172.16.0.0 - 172.31.255.255
		 * default mask 255.255.0.0		/16			starts at /16	16 = 00010000	31 = 00011111
		 */
		1, 1, 1, 1,
		/**
		 * Class C  110x	1100(12) - 1101(13)	 192-223
		 * private 192.168.0.0 - 192.168.255.255
		 * default mask 255.255.255.0	/24			starts at /16	168 = 10101000
		 */
		2, 2,
		/**
		 * Class D	1110	1110(14)			 224-239
		 * 
		 */
		3,
		/**
		 * Class E	1111	1111(15)			 240-255
		 * broadcast
		 */
		4
	];

/**
* used for string & numbers
* @param t string
* @param e amount
* @param ch pad char
*/
export const pad = (t: string, e: number, ch?: any) =>
	new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch || '0') + t;

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
