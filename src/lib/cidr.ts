import { IIP, IP } from "./ip";
import { ISubnetAddress, SubnetAddress } from "./subnet-address";
import { SubnetMask } from "./subnet-mask";

/**
 * interface for a network CIDR (Classless Inter-Domain Routing) mask scheme like 192.168.0.1/24
 */
export interface ICIDR {
	/** contains the Subnet mask part */
	subnetMask: ISubnetAddress;
	/** contains the host mask part, also known as WildCard mask */
	hostMask: ISubnetAddress;
	/** contains the IP part */
	ip: IIP;
	/** contains a valid CIDR number 1-30 {@link CIDR.Min}-{@link CIDR.Max} */
	cidr: number;
	/** returns the CIDR scheme like  192.168.0.1/24 */
	toString(): string;
}

/**
 * Classless Inter-Domain Routing (CIDR)
 * 
 * Implements a network CIDR mask scheme like 192.168.0.1/24
 */
export class CIDR implements ICIDR {

	readonly subnetMask: ISubnetAddress;

	readonly hostMask: ISubnetAddress;

	readonly ip: IIP;

	readonly cidr: number;

	toString(): string {
		return `${this.ip}/${this.cidr}`;
	}

	/** minimum usable CIDR number */
	static readonly Min = 1;
	/** maximum usable CIDR number */
	static readonly Max = 30;

	/**
	 * creates a CIDR class with an IP & a subnet mask
	 * @param text `x.x.x.x/y` where x: 0-255, and y: 1-30 {@link CIDR.Min}-{@link CIDR.Max}
	 */
	constructor(text: string) {
		const match = /^\s*(?<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*\/(?<value>\d{1,2})\s*$/.exec(text);

		if (!match) {
			throw new Error(`invalid CIDR: ${text}`)
		}
		this.cidr = parseInt(match.groups?.value ?? "");
		if (this.cidr < CIDR.Min || this.cidr > CIDR.Max) {
			throw new Error(`invalid CIDR: ${this.cidr}, ${CIDR.Min}-${CIDR.Max}`);
		}
		//
		this.subnetMask = SubnetMask.fromCIDR(this.cidr);
		//
		this.hostMask = SubnetAddress.from(this.subnetMask.not());
		this.ip = new IP(match.groups?.ip ?? "");
	}

}