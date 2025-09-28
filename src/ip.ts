import { NetClassArray, NetClassArrayMap, NetClassType, NetworkClassAny } from "./common";
import { ISubnetAdress, SubnetAdress } from "./subnet-address";

/**
 * interface for a network IP address
 */
export interface IIP extends ISubnetAdress {
	/** return the network class type */
	get type(): NetClassType;
	/** returns true if IP is localhost 127.0.0.1 */
	get localhost(): boolean;
	//[ndx: number]: number;
}

/**
 * Implements a network IP (Internet Protocol ) address
 */
export class IP extends SubnetAdress implements IIP {

	get type(): NetClassType {
		const octet0 = this.octets[0];
		//if it's 0 then it's a ClassAny network
		if (octet0 === 0) {
			return NetworkClassAny;
		}
		//otherwise inspect the 4 leftmost bits
		return NetClassArray[NetClassArrayMap[octet0 >> 4]]
		// const O0 = this.#octets[0];
		// if (O0 >= 0 && O0 <= 127) {				// 0---		0-127		loopback 127.0.0.0 - 127.255.255.255 localhost 127.0.0.1
		// 	return NetClassA
		// }
		// else if (O0 >= 128 && O0 <= 191) {		// 10--		128-191		private 10.0.0.0 - 10.255.255.255
		// 	return NetClassB
		// }
		// else if (O0 >= 192 && O0 <= 223) {		// 110-		192-223		private 172.16.0.0 - 172.31.255.255
		// 	return NetClassC
		// }
		// else if (O0 >= 224 && O0 <= 239) {		// 1110		224-239		private 192.168.0.0 - 192.168.255.255
		// 	return NetClassD
		// } else {
		// 	return NetClassE						// 1111		240-255
		// }
	}

	get localhost(): boolean {
		return this.toString() == "127.0.0.1";
	}
}