import { IIP, IP } from "./ip";
import { ISubnetAdress, SubnetAdress } from "./subnet-address";
import { SubnetMask } from "./subnet-mask";

/**
 * interface for a network CIDR (Classless Inter-Domain Routing) mask scheme like 192.168.0.1/24
 */
export interface ICIDR {
	/** contains the Subnet mask part */
	subnetMask: ISubnetAdress;
	/** contains the host mask part, also known as WildCard mask */
	hostMask: ISubnetAdress;
	/** contains the IP part */
	ip: IIP;
	/** contains a valid CIDR number 1-30 {@link CIDR.Min}-{@link CIDR.Max} */
	cidr: number;
	/** returns the CIDR scheme like  192.168.0.1/24 */
	toString(): string;
}

/**
 * implements a network CIDR mask scheme like 192.168.0.1/24
 */
export class CIDR implements ICIDR {

	readonly subnetMask: ISubnetAdress;

	readonly hostMask: ISubnetAdress;

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
		// const m = SubnetMask.fromCIDR(this.cidr);
		// let mask = chunkString(padRight(new Array(this.cidr + 1).join('1'), 32, "0"), 8).map(v => parseInt(v, 2));
		this.subnetMask = SubnetMask.fromCIDR(this.cidr);
		// //compare m with mask and see if equal
		// if (!m.equal(this.subnetMask)) {
		// 	console.log(m, ' NOT EQUAL ', this.subnetMask)
		// }
		this.hostMask = SubnetAdress.from(this.subnetMask.not());
		this.ip = new IP(match.groups?.ip ?? "");
	}
}