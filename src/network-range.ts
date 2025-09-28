import { ISubnetAdress, SubnetAdress } from "./subnet-address";

export interface INetworkRange {
	/** start IP, in DHCP is the network address */
	address: ISubnetAdress;
	/** end IP, in DHCP is the network broadcast */
	broadcast: ISubnetAdress;
	/** returns the amount of allocations in the network range  */
	get size(): number;
	/** return the string representation of the network range */
	get range(): string;
	/**
	 * returns true if a value is in the octet range
	 * @param value value to test
	 * @param ndx 0-based octet index
	 */
	validOctet(value: number, ndx: number): boolean;
	/**
	 * returns true if an IP address belongs to the network range
	 * @param ip IP address
	 */
	belongs(ip: ISubnetAdress): boolean;
	/** returns the Network Range like x.x.x.x - x.x.x.x */
	toString(): string;
}

/**
 * implements a network range
 */
export class NetworkRange implements INetworkRange {

	readonly address: ISubnetAdress;

	readonly broadcast: ISubnetAdress;

	get size(): number {
		return this.broadcast.value - this.address.value + 1;
	}

	get range(): string {
		return `${this.address} - ${this.broadcast}`;
	}

	toString(): string {
		return this.range;
	}

	/**
	 * 
	 * @param address Network Range Address or IP start
	 * @param broadcast Network Range Broadcast Address or IP end
	 */
	constructor(address: ISubnetAdress, broadcast: ISubnetAdress) {
		this.address = SubnetAdress.from(address);
		this.broadcast = SubnetAdress.from(broadcast);
		//check range
		const broadcastOctets = this.broadcast.octets;
		if (this.address.octets.some((value, ndx) => value > broadcastOctets[ndx])) {
			throw new Error(`invalid network range ${this.range}`)
		}
	}

	validOctet(value: number, ndx: number): boolean {
		return !isNaN(value) && value >= this.address.octets[ndx] && value <= this.broadcast.octets[ndx]
	}

	belongs(ip: ISubnetAdress): boolean {
		const ipOctets = ip.octets;
		const broadcastOctets = this.broadcast.octets;
		return !this.address.octets.some((addressOctet, ndx) => ipOctets[ndx] < addressOctet || ipOctets[ndx] > broadcastOctets[ndx])
	}

	/**
	 * creates a network range from an string
	 * @param str network range like x.x.x.x - x.x.x.x
	 */
	static create(str: string): INetworkRange {
		let ranges = str.split("-").map(s => s.trim());
		if (ranges.length != 2) {
			throw new Error(``);
		}
		let address = SubnetAdress.from(ranges[0]);
		let to = SubnetAdress.from(ranges[1]);
		return new NetworkRange(address, to);
	}

}