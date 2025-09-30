import { INetworkRange, NetworkRange } from "./network-range";
import { BroadcastAddressText, ISubnetAddress, NetworkAddressText, SubnetAddress } from "./subnet-address";

export interface IDHCP extends INetworkRange {
	/** returns the amount of host in the Network Range */
	get hosts(): number;
}

/**
 * Dynamic Host Configuration Protocol (DHCP).
 * 
 * Implements a DHCP pool network range
 * 
 * even start & broadcast addresses are same a {@link NetworkRange} the {@link hosts} property returns network range - 2
 */
export class DHCP extends NetworkRange implements IDHCP {

	/** returns the network range minus 2, network address and broadcast address are not counted */
	get hosts(): number {
		return super.size - 2;
	}

	/** return the string representation of the DHCP range */
	get range(): string {
		return `${this.address.offset(NetworkAddressText)} - ${this.broadcast.offset(BroadcastAddressText)}`;
	}

	/**
	 * Creates a DHCP range
	 * @param address Network Address or IP start
	 * @param broadcast Network Broadcast Address or IP end
	 */
	constructor(address: ISubnetAddress, broadcast: ISubnetAddress) {
		let
			startOctets = address.octets,
			endOctets = broadcast.octets;
		super(SubnetAddress.from(startOctets), SubnetAddress.from(endOctets));
	}
}