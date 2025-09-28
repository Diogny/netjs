import { CIDR, ICIDR } from "./cidr";
import { NetClassType } from "./common";
import { DHCP, IDHCP } from "./dhcp";

export interface ISubnet extends ICIDR {
	/** return the network class type */
	get type(): NetClassType;
	/** contains the DHCP range of the network subnet */
	dhcp: IDHCP;
}

/**
 * Defines a Broadcast Domain for a network on Layer3.
 * 
 * Uses IP Address to comunicate between devices
 * 
 * Routed between subnets by the router
 * 
 * At Layer 3 (the Network layer), we connect multiple broadcast domains using IP addresses.
 */
export class Subnet extends CIDR implements ISubnet {

	readonly dhcp: IDHCP;

	get type(): NetClassType {
		return this.ip.type
	}

	/**
	 * creates a CIDR class with an IP & a subnet mask
	 * @param text `x.x.x.x/y` where x: 0-255, and y: 1-32
	 */
	constructor(text: string) {
		super(text);
		//create network address
		const address = this.ip.and(this.subnetMask);
		//create broadcast address
		// const netClass = NetworkClass.defaultClass(this.type) as NetworkClass;
		//netClass.privateRange.to has the last IP in case of
		// Class C 172.16.0.0 - 172.31.255.255
		const broadcast = address.or(this.hostMask); // IP.fromMask(this.address.or(this.mask.not()));
		//
		this.dhcp = new DHCP(address, broadcast);
	}
}