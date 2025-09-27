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