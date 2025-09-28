import { INetworkRange, NetworkRange } from "./network-range";
import { BroadcastAddressText, ISubnetAdress, NetworkAdressText, SubnetAdress } from "./subnet-address";

export interface IDHCP extends INetworkRange {
	/** returns the amount of host in the Network Range */
	get hosts(): number;
}

/**
 * implements a DHCP pool network range
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
		return `${this.address.offset(NetworkAdressText)} - ${this.broadcast.offset(BroadcastAddressText)}`;
	}

	/**
	 * Creates a DHCP range
	 * @param address Network Address or IP start
	 * @param broadcast Network Broadcast Address or IP end
	 */
	constructor(address: ISubnetAdress, broadcast: ISubnetAdress) {
		let
			startOctets = address.octets,
			endOctets = broadcast.octets;
		// if (shrink) {
		// 	//skip Network Address
		// 	startOctets[3] += 1;
		// 	//skip Broadcast Address
		// 	endOctets[3] -= 1;
		// }
		super(SubnetAdress.from(startOctets), SubnetAdress.from(endOctets));
	}
}