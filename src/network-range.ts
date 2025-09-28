import { ISubnetAddress, SubnetAddress } from "./subnet-address";

export interface INetworkRange {
	/** start IP, in DHCP is the network address */
	address: ISubnetAddress;
	/** end IP, in DHCP is the network broadcast */
	broadcast: ISubnetAddress;
	/** returns the amount of allocations in the network range  */
	get size(): number;
	/** return the string representation of the network range */
	get text(): string;
	/**
	 * returns true if a value is in the octet range
	 * @param value value to test
	 * @param ndx 0-based octet index
	 */
	validOctet(value: number, ndx: number): boolean;
	/**
	 * returns true if this range is equals to other range
	 * @param other range to test
	 */
	equals(other: INetworkRange): boolean;
	/**
	 * returns true if an IP address belongs to the network range
	 * @param value IP address or Network Range
	 */
	contains(value: ISubnetAddress | INetworkRange): boolean;
	/** returns the Network Range like x.x.x.x - x.x.x.x */
	toString(): string;
}

/**
 * implements a network range
 */
export class NetworkRange implements INetworkRange {

	readonly address: ISubnetAddress;

	readonly broadcast: ISubnetAddress;

	get size(): number {
		return this.broadcast.value - this.address.value + 1;
	}

	get text(): string {
		return `${this.address} - ${this.broadcast}`;
	}

	toString(): string {
		return this.text;
	}

	/**
	 * 
	 * @param address Network Range Address or IP start, or string with full network range like x.x.x.x - x.x.x.x
	 * @param broadcast Network Range Broadcast Address or IP end
	 */
	constructor(address: ISubnetAddress | string, broadcast?: ISubnetAddress) {
		if (typeof address == "string") {
			const { netAddress, netBroadcast } = parseRange(address);
			this.address = netAddress;
			this.broadcast = netBroadcast;
		} else {
			this.address = SubnetAddress.from(address);
			this.broadcast = SubnetAddress.from(broadcast ?? "");
		}
		//check range
		const broadcastOctets = this.broadcast.octets;
		if (this.address.octets.some((value, ndx) => value > broadcastOctets[ndx]) ||
			this.broadcast.LT(this.address)) {
			throw new Error(`invalid network range ${this.text}`)
		}
	}

	validOctet(value: number, ndx: number): boolean {
		return !isNaN(value) && value >= this.address.octets[ndx] && value <= this.broadcast.octets[ndx]
	}

	equals(other: INetworkRange): boolean {
		return this.address.equals(other.address) && this.broadcast.equals(other.broadcast);
	}

	contains(value: ISubnetAddress | INetworkRange): boolean {
		if (value instanceof SubnetAddress) {
			const ipOctets = value.octets;
			const broadcastOctets = this.broadcast.octets;
			return !this.address.octets.some((addressOctet, ndx) => ipOctets[ndx] < addressOctet || ipOctets[ndx] > broadcastOctets[ndx])
		} else
			if (value instanceof NetworkRange) {
				//a network range
				return this.contains(value.address) && this.contains(value.broadcast)
			}
		return false
	}

	/**
	 * creates a network range from an string
	 * @param str network range like x.x.x.x - x.x.x.x
	 */
	static create(str: string): INetworkRange {
		const { netAddress, netBroadcast } = parseRange(str);
		return new NetworkRange(netAddress, netBroadcast);
	}

}

/**
 * creates a network range from an string
 * @param str network range like x.x.x.x - x.x.x.x
 * @returns 
 */
export const parseRange = (str: string): {
	netAddress: ISubnetAddress,
	netBroadcast: ISubnetAddress
} => {
	let ranges = str.split("-").map(s => s.trim());
	if (ranges.length != 2) {
		throw new Error(`Invalid network range: ${str}`);
	}
	let address = SubnetAddress.from(ranges[0]);
	let to = SubnetAddress.from(ranges[1]);
	return {
		netAddress: address,
		netBroadcast: to
	}
}