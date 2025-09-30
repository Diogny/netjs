import { chunkString, padRight } from "./common";
import { ISubnetAddress, SubnetAddress } from "./subnet-address";

export interface ISubnetMask extends ISubnetAddress {
	/** */
}

export class SubnetMask extends SubnetAddress implements ISubnetMask {

	/**
	 * creates a subnet mask from a CIDR number
	 * @param cidr CIDR 1-32
	 * @returns 
	 */
	static fromCIDR(cidr: number): ISubnetMask {
		if (cidr < 1 || cidr > 32) {
			throw new Error(`Invalid CIDR: ${cidr}`);
		}
		let mask = chunkString(padRight(new Array(cidr + 1).join('1'), 32, "0"), 8).map(v => parseInt(v, 2));
		return new SubnetMask(mask)
	}
}