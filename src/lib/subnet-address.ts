import { chunkString, integer, pad } from "./common";

export const
	NetworkAddressText = "NetworkAddress",
	BroadcastAddressText = "BroadcastAddress";
const SubnetAddressOffsetArray = [NetworkAddressText, BroadcastAddressText] as const;
export type SubnetAddressOffsetType = typeof SubnetAddressOffsetArray[number];

/**
 * represents a subnet mask with four byte values (0-255), 32-bit 0s & 1s
 */
export interface ISubnetAddress {
	/** returns the four octets */
	get octets(): number[];
	/** returns the four octets formatted as x.x.x.x */
	get octetsStr(): string;
	/** returns the 32-bits unsigned 4-bytes numeric value */
	get value(): number;
	/** returns the 32-bits binary number of 0s & 1s */
	get binary(): string;
	/** returns the 32-bits binary number formated by 4-chunks of 8 bits like 00000000.00000000.00000000.00000000 */
	get binaryStr(): string;
	/** return the string reperesentation like x.x.x.x */
	toString(): string;
	/**
	 * check subnet address is less than other
	 * @param than another subnet address
	 */
	LT(than: ISubnetAddress): boolean;
	/**
	 * check subnet address is less or equal than other
	 * @param than another subnet address
	 */
	LTE(than: ISubnetAddress): boolean;
	/**
	 * check subnet address been equal
	 * @param to another subnet address
	 */
	equals(to: ISubnetAddress): boolean;
	/**
	 * check subnet address is greater than other
	 * @param than another subnet address
	 */
	GT(than: ISubnetAddress): boolean;
	/**
	 * check subnet address is greater or equal than other
	 * @param than another subnet address
	 */
	GTE(than: ISubnetAddress): boolean;
	/**
	 * returns a NOT of the Subnet address
	 * @returns NOT Subnet mask
	 */
	not(): ISubnetAddress;
	/**
	 * apply an AND mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	and(mask: ISubnetAddress): ISubnetAddress;
	/**
	 * apply a OR mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	or(mask: ISubnetAddress): ISubnetAddress;
	/**
	 * apply a XOR mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	xor(mask: ISubnetAddress): ISubnetAddress;
	/**
	 * returns a new Subnet Address with 3rd octet offset by a type
	 * @param value offset value type
	 */
	offset(value: SubnetAddressOffsetType): ISubnetAddress;
}

export class SubnetAddress implements ISubnetAddress {

	#octets: number[];
	get octets(): number[] {
		return Array.from(this.#octets)
	}

	get octetsStr(): string {
		return this.#octets.join(".")
	}

	/**
	 * max value: 4294967295
	 * 
	 * '11111111111111111111111111111111'
	 */
	get value(): number {
		return Number((BigInt(this.#octets[0]) << 24n) + BigInt(this.#octets[1] << 16) + BigInt(this.#octets[2] << 8) + BigInt(this.#octets[3]))
	}

	get binary(): string {
		return pad(this.value.toString(2), 32, '0');
	}

	get binaryStr(): string {
		const bin = this.binary;
		return chunkString(bin, 8).join(".")
	}

	public toString = (): string => this.#octets.join(".");

	/**
	 * creates a four octets subnet mask class
	 * @param values "x.x.x.x" where x 0-255 OR [255,255,255,0]
	 */
	constructor(values: string | number[]) {
		let
			array: number[];
		if (typeof values == "string") {
			array = (values ?? "").split(".").map(v => integer(v));	//parseInt
		} else {
			array = Array.from(values);
		}
		//check array
		if (array.length != 4 || array.some(v => v < 0 || v > 255)) {
			throw new Error(`invalid octets: [${array.join(",")}]`)
		}
		this.#octets = array;
	}

	LT(than: ISubnetAddress): boolean {
		let comp = addressComparer(this.octets, than.octets);
		let result = comp == -1;
		return result;
	}

	LTE(than: ISubnetAddress): boolean {
		let comp = addressComparer(this.octets, than.octets);
		let result = comp == -1 || comp == 0;
		return result;
	}

	equals(to: ISubnetAddress): boolean {
		return this.#octets.length == to.octets.length &&
			to.octets.every((value, ndx) => value == this.#octets[ndx])
	}

	GT(than: ISubnetAddress): boolean {
		let comp = addressComparer(this.octets, than.octets);
		let result = comp == 1;
		return result;
	}

	GTE(than: ISubnetAddress): boolean {
		let comp = addressComparer(this.octets, than.octets);
		let result = comp == 1 || comp == 0;
		return result;
	}

	not(): ISubnetAddress {
		let not = this.octets.map(v => (~v >>> 0) & 255);  //(v => [...pad(v.toString(2), 8, '0')].map(c => Math.abs(~c) & 1).join('')).map(s => parseInt(s, 2));
		return SubnetAddress.from(not)
	}

	and(mask: ISubnetAddress): ISubnetAddress {
		const maskOctets = mask.octets;
		return SubnetAddress.from(this.octets.map((val, ndx) => val & maskOctets[ndx]));
	}

	or(mask: ISubnetAddress): ISubnetAddress {
		const maskOctets = mask.octets;
		return SubnetAddress.from(this.octets.map((val, ndx) => val | maskOctets[ndx]));
	}

	xor(mask: ISubnetAddress): ISubnetAddress {
		const maskOctets = mask.octets;
		return SubnetAddress.from(this.octets.map((val, ndx) => val ^ maskOctets[ndx]));
	}

	offset(value: SubnetAddressOffsetType): ISubnetAddress {
		let
			offset = 0;
		switch (value) {
			case NetworkAddressText:
				offset = 1;
				break;
			case BroadcastAddressText:
				offset = -1;
				break;
		}
		if (!offset) {
			return this as ISubnetAddress;
		}
		let octets = this.octets;
		octets[3] += offset;
		return SubnetAddress.from(octets)
	}

	/**
	 * creates a subnet address
	 * @param address string, or subnet address, or array of numbers
	 * @returns 
	 */
	static from(src: string | ISubnetAddress | number[]): ISubnetAddress {
		return new SubnetAddress(typeof src == "string" ? src : (Array.isArray(src) ? src : src.octets))
	}

}

/**
 * network address comparer, stops if one octet is greater or less than the other
 * @param thisOctets 
 * @param thanOctets 
 * @returns -1 for less than, 0 for equal, 1 for greater than
 */
const addressComparer = (thisOctets: number[], thanOctets: number[]): number => {
	//start from ndx = 0, if one greater found, return true
	let ndx = 0;
	while (ndx < thisOctets.length) {
		const delta = thisOctets[ndx] - thanOctets[ndx];
		if (delta > 0) {
			//found an octet greater in this, is GREATER
			return 1;
		} else if (delta < 0) {
			//found an octet less in this, is LESS
			return -1;
		}
		//else octets are EQUAL
		ndx++;
	}
	//if we reach here,they're EQUAL
	return 0;
}
