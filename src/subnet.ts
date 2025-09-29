import { CIDR, ICIDR } from "./cidr";
import { NetClassType } from "./common";
import { DHCP, IDHCP } from "./dhcp";

export const loopbackCIDR = "127.0.0.0/8";
export const linkLocalCIDR = "169.254.0.0/16";
export const multicastCIDR = "224.0.0.0/4";
export const reservedCIDR = "240.0.0.0/4";
export const CGNATCIDR = "100.64.0.0/10";
export const Docs01CIDR = "192.0.2.0/24";
export const Docs02CIDR = "198.51.100.0/24";
export const Docs03CIDR = "203.0.113.0/24";
export const benchmarkingCIDR = "198.18.0.0/15";

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
	 * creates a Subnet class with an IP & a subnet mask
	 * @param text `x.x.x.x/y` where x: 0-255, and y: 1-32
	 */
	constructor(text: string) {
		super(text);
		//create network address
		const address = this.ip.and(this.subnetMask);
		//create broadcast address
		const broadcast = address.or(this.hostMask); // IP.fromMask(this.address.or(this.mask.not()));
		//create DHCP network range
		this.dhcp = new DHCP(address, broadcast);
	}

	/**
	 * returns a collection of all reserved subnets
	 * @returns 
	 */
	static reservedSubnets(): ISubnet[] {
		return [
			Subnet.loopback(),
			Subnet.linkLocal(),
			Subnet.multicast(),
			Subnet.reserved(),
			Subnet.cgnat(),
			Subnet.docs01(),
			Subnet.docs02(),
			Subnet.docs03(),
			Subnet.benchmarking()
		]
	}

	/**
	 * returns the loopback address block for localhost
	 * @returns 
	 */
	static loopback(): ISubnet {
		return new Subnet(loopbackCIDR);
	}

	/**
	 * returns the Microsoft link-local block for self-assigned IP address, Automatic Private IP Addressing (APIPA)
	 * @returns 
	 */
	static linkLocal(): ISubnet {
		return new Subnet(linkLocalCIDR);
	}

	/**
	 * returns the group addressing for multicast communication
	 * @returns 
	 */
	static multicast(): ISubnet {
		return new Subnet(multicastCIDR);
	}

	/**
	 * Reserved for future use; commonly treated as invalid by hosts/routers.
	 * @returns 
	 */
	static reserved(): ISubnet {
		return new Subnet(reservedCIDR)
	}

	/**
	 * CGNAT (Shared address space). Used by ISPs for carrier-grade NAT; not the same as RFC1918 private space.
	 * @returns 
	 */
	static cgnat(): ISubnet {
		return new Subnet(CGNATCIDR);
	}

	/**
	 * TEST-NET 1/2/3. Documentation and examples; safe to use in manuals, posts, and labs. Not used on the Internet.
	 * @returns 
	 */
	static docs01(): ISubnet {
		return new Subnet(Docs01CIDR);
	}

	/**
	 * TEST-NET 1/2/3. Documentation and examples; safe to use in manuals, posts, and labs. Not used on the Internet.
	 * @returns 
	 */
	static docs02(): ISubnet {
		return new Subnet(Docs02CIDR);
	}

	/**
	 * TEST-NET 1/2/3. Documentation and examples; safe to use in manuals, posts, and labs. Not used on the Internet.
	 * @returns 
	 */
	static docs03(): ISubnet {
		return new Subnet(Docs03CIDR);
	}

	/**
	 * Benchmarking. Device and network interconnect testing/benchmarks (non-Internet use).
	 * @returns 
	 */
	static benchmarking(): ISubnet {
		return new Subnet(benchmarkingCIDR);
	}
}