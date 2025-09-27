import { pad } from "dabbjs";
import { chunkString, integer } from "./math";

export const
	NetworkAdressText = "NetworkAddress",
	BroadcastAddressText = "BroadcastAddress";
const SubnetAddressOffsetArray = [NetworkAdressText, BroadcastAddressText] as const;
export type SubnetAdressOffsetType = typeof SubnetAddressOffsetArray[number];

/**
 * represents a subnet mask with four byte values (0-255), 32-bit 0s & 1s
 */
export interface ISubnetAdress {
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
	 * check subnet address been equal
	 * @param to another subnet address
	 */
	equal(to: ISubnetAdress): boolean;

	/**
	 * returns a NOT of the Subnet address
	 * @returns NOT Subnet mask
	 */
	not(): ISubnetAdress;
	/**
	 * apply an AND mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	and(mask: ISubnetAdress): ISubnetAdress;
	/**
	 * apply a OR mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	or(mask: ISubnetAdress): ISubnetAdress;
	/**
	 * apply a XOR mask to the octets
	 * @param mask 32-bits 4-byte mask
	 * @returns masked Subnet mask
	 */
	xor(mask: ISubnetAdress): ISubnetAdress;
	/**
	 * returns a new Subnet Adrees with 3rd octet offset by a type
	 * @param value offset value type
	 */
	offset(value: SubnetAdressOffsetType): ISubnetAdress;
}

export class SubnetAdress implements ISubnetAdress {

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
			array = values;
		}
		//check array
		if (array.length != 4 || array.some(v => v < 0 || v > 255)) {
			throw new Error(`invalid octets: ${values}`)
		}
		this.#octets = array;
	}

	equal(to: ISubnetAdress): boolean {
		return this.#octets.length == to.octets.length &&
			to.octets.every((value, ndx) => value == this.#octets[ndx])
	}

	//https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
	//https://stackoverflow.com/questions/1133473/understanding-javascript-bitwise-not-operator-and-tostring-function
	//https://www.google.com/search?q=javascript+bitwise+not+unsigned+int&sca_esv=dad87895c19efbc5&sxsrf=AE3TifOePBywjbumRL3zXgJ1byg4pYI7WQ%3A1757548412808&ei=fA_CaJuIMZC0wN4P9uGvyAg&oq=javascript+bitwise+not+unsigned&gs_lp=Egxnd3Mtd2l6LXNlcnAiH2phdmFzY3JpcHQgYml0d2lzZSBub3QgdW5zaWduZWQqAggAMgUQIRigATIFECEYoAEyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGKsCSKk3ULkTWIgjcAF4AZABAJgB9gGgAYMJqgEFNS4yLjK4AQPIAQD4AQGYAgqgAqIJwgIHECMYsAMYJ8ICChAAGLADGNYEGEfCAgQQIxgnwgIGEAAYFhgewgIIEAAYFhgKGB7CAgsQABiABBiGAxiKBcICBRAAGO8FwgIIEAAYgAQYogTCAgUQIRifBZgDAIgGAZAGCZIHBTYuMi4yoAfaMbIHBTUuMi4yuAebCcIHBTAuOC4yyAcW&sclient=gws-wiz-serp
	not(): ISubnetAdress {
		//(~1 >>> 0).toString(2)
		//'11111111111111111111111111111110'
		// (~1 >>> 0) & 255  == 254
		let not = this.octets.map(v => (~v >>> 0) & 255);  //(v => [...pad(v.toString(2), 8, '0')].map(c => Math.abs(~c) & 1).join('')).map(s => parseInt(s, 2));
		return SubnetAdress.from(not)
	}

	and(mask: ISubnetAdress): ISubnetAdress {
		// let and = Number(BigInt(this.value) & BigInt(mask.value));
		// return new SubnetAdress(chunkString(pad(and.toString(2), 32, "0"), 8).map(s => parseInt(s, 2)))
		const maskOctets = mask.octets;
		return SubnetAdress.from(this.octets.map((val, ndx) => val & maskOctets[ndx]));
	}

	or(mask: ISubnetAdress): ISubnetAdress {
		// let or = Number(BigInt(this.value) | BigInt(mask.value));
		// return new SubnetAdress(chunkString(pad(or.toString(2), 32, "0"), 8).map(s => parseInt(s, 2)))
		const maskOctets = mask.octets;
		return SubnetAdress.from(this.octets.map((val, ndx) => val | maskOctets[ndx]));
	}

	xor(mask: ISubnetAdress): ISubnetAdress {
		// let xor = Number(BigInt(this.value) ^ BigInt(mask.value));
		// return new SubnetAdress(chunkString(pad(xor.toString(2), 32, "0"), 8).map(s => parseInt(s, 2)))
		const maskOctets = mask.octets;
		return SubnetAdress.from(this.octets.map((val, ndx) => val ^ maskOctets[ndx]));
	}

	offset(value: SubnetAdressOffsetType): ISubnetAdress {
		let
			offset = 0;
		switch (value) {
			case NetworkAdressText:
				offset = 1;
				break;
			case BroadcastAddressText:
				offset = -1;
				break;
		}
		if (!offset) {
			return this as ISubnetAdress;
		}
		let octets = this.octets;
		octets[3] += offset;
		return SubnetAdress.from(octets)
	}

	/**
	 * creates a subnet address
	 * @param address string, or subnet address, or array of numbers
	 * @returns 
	 */
	static from(src: string | ISubnetAdress | number[]): ISubnetAdress {
		return new SubnetAdress(typeof src == "string" ? src : (Array.isArray(src) ? src : src.octets))
	}

}