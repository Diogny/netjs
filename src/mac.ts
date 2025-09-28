import { chunkString, pad } from "./lib";

export interface IMAC {
	/** returns the six values in decimal numbers */
	get values(): number[];
	/** returns the 48-bits unsigned 6-bytes numeric value as a BigInt */
	get integer(): BigInt;
	/** returns the string representation f the MAC address */
	get text(): string;
	/** returns the MAC address as XX:XX:XX:XX:XX:XX */
	toString(): string;
}

/**
 * Defines a MAC (Media Access Control) address
 */
export class MAC implements IMAC {

	#values: number[];
	get values(): number[] {
		return Array.from(this.#values)
	}

	get integer(): BigInt {
		return (BigInt(this.#values[0]) << 40n) +
			(BigInt(this.#values[1]) << 32n) +
			(BigInt(this.#values[2]) << 24n) +
			BigInt(this.#values[3] << 16) +
			BigInt(this.#values[4] << 8) +
			BigInt(this.#values[5])
	}

	get text(): string {
		return this.#values.map(v => pad(v.toString(16), 2, '0')).join(":").toUpperCase()
	}

	toString(): string {
		return this.text
	}

	/**
	 * 
	 * @param text XX:XX:XX:XX:XX:XX MAC address with separators . : - OR XXXXXXXXXXXX 
	 */
	constructor(text: string) {
		let
			arr: string[] = [];
		if (/^(?:[0-9A-Fa-f]{1,2}[.:-]){5}(?:[0-9A-Fa-f]{1,2})$/.exec(text)) {
			arr = text.split(/[.:-]/);
		} else //second try XXXXXXXXXX hex chars
			if (/^[0-9A-Fa-f]{12}$/.exec(text)) {
				arr = chunkString(text, 2)
			}
		//
		if (!arr.length ||
			(this.#values = arr.map(s => parseInt(s, 16))).some(val => isNaN(val) || val < 0 || val > 255) ||
			this.#values.length != 6
		) {
			throw new Error(`invalid MAC: ${text}`)
		}
		//(this.#values = text.split(/[.:-]/).map(s => parseInt(s, 16))).some(val => isNaN(val) || val < 0 || val > 255) ||
		// this.#values.length != 6) 
	}

}