import { NetClassArray, NetClassArrayMap, NetClassType, NetworkClassAny } from "./common";
import { ISubnetAddress, SubnetAddress } from "./subnet-address";

export const localhostIP = "127.0.0.1";
export const broadcastIP = "255.255.255.255";

/**
 * interface for a network IP address
 */
export interface IIP extends ISubnetAddress {
	/** return the network class type */
	get type(): NetClassType;
	/** returns true if IP is localhost 127.0.0.1 */
	get localhost(): boolean;
}

/**
 * Implements a network IP (Internet Protocol ) address
 */
export class IP extends SubnetAddress implements IIP {

	get type(): NetClassType {
		const octet0 = this.octets[0];
		//if it's 0 then it's a ClassAny network
		if (octet0 === 0) {
			return NetworkClassAny;
		}
		//otherwise inspect the 4 leftmost bits
		return NetClassArray[NetClassArrayMap[octet0 >> 4]]
	}

	get localhost(): boolean {
		return this.toString() == localhostIP;
	}

	/**
	 * localhost or loopback IP `127.0.0.1`
	 * @returns 
	 */
	static localhost(): IIP {
		return new IP(localhostIP);
	}

	/**
	 * broadcast IP `255.255.255.255`
	 * @returns 
	 */
	static broadcast(): IIP {
		return new IP(broadcastIP);
	}
}