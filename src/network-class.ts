import { NetClassType, NetworkClassA, NetworkClassAny, NetworkClassB, NetworkClassC, NetworkClassD, NetworkClassE } from "./common";
import { NetworkNamedRange } from "./network-named-range";
import { INetworkRangeManager, NetworkRangeManager } from "./network-range-manager";
import { ISubnetAddress, SubnetAddress } from "./subnet-address";

export interface INetworkClass {
	/** return the network class type */
	get type(): NetClassType;
	/** returns the start of the CIDR for the class */
	get startCIDR(): number;
	/** returns the default of the CIDR for the class */
	get defaultCIDR(): number;
	/** returns the default subnet mask of the network class */
	get defaultMask(): ISubnetAddress;
	/** returns the default or `public` range of the network class */
	get ranges(): INetworkRangeManager;
}

/**
 * Implements a Network class by type of network
 */
export class NetworkClass implements INetworkClass {

	readonly startCIDR: number;

	readonly defaultCIDR: number;

	readonly defaultMask: ISubnetAddress;

	readonly ranges: INetworkRangeManager;

	/**
	 * Creates a network class
	 * @param type network class type
	 */
	constructor(public readonly type: NetClassType) {
		switch (this.type) {
			case NetworkClassAny:
				this.startCIDR = 1;
				this.defaultCIDR = 1;
				this.defaultMask = SubnetAddress.from("255.255.255.255");
				this.ranges = new NetworkRangeManager("0.0.0.0-255.255.255.255");
				break;
			case NetworkClassA:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.defaultMask = SubnetAddress.from("255.0.0.0");
				this.ranges = new NetworkRangeManager("1.0.0.0-126.255.255.255");
				this.ranges.add(new NetworkNamedRange("10.0.0.0-10.255.255.255", void 0, "private"));
				this.ranges.add(new NetworkNamedRange("127.0.0.0-127.255.255.255", void 0, "special"));
				break
			case NetworkClassB:
				this.startCIDR = 16;
				this.defaultCIDR = 16;
				this.defaultMask = SubnetAddress.from("255.255.0.0");
				this.ranges = new NetworkRangeManager("128.0.0.0-191.255.255.255");
				this.ranges.add(new NetworkNamedRange("172.16.0.0-172.31.255.255", void 0, "private"));
				break;
			case NetworkClassC:
				this.startCIDR = 16;
				this.defaultCIDR = 24;
				this.defaultMask = SubnetAddress.from("255.255.255.0");
				this.ranges = new NetworkRangeManager("192.0.0.0-223.255.255.255");
				this.ranges.add(new NetworkNamedRange("192.168.0.0-192.168.255.255", void 0, "private"));
				break;
			case NetworkClassD:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.defaultMask = SubnetAddress.from("255.0.0.0");
				this.ranges = new NetworkRangeManager("224.0.0.0-239.255.255.255");
				break;
			case NetworkClassE:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.defaultMask = SubnetAddress.from("255.0.0.0");
				this.ranges = new NetworkRangeManager("240.0.0.0-255.255.255.255");
				break;
		}
	}

	/**
	 * returns the default network class information
	 * @param type network class type
	 * @returns 
	 */
	static defaultClass(type: NetClassType): NetworkClass {
		return DefaultNetworkClassMap[type];
	}
}

const DefaultNetworkClassMap: { [key in NetClassType]: NetworkClass } = {
	[NetworkClassAny]: new NetworkClass(NetworkClassAny),
	[NetworkClassA]: new NetworkClass(NetworkClassA),
	[NetworkClassB]: new NetworkClass(NetworkClassB),
	[NetworkClassC]: new NetworkClass(NetworkClassC),
	[NetworkClassD]: new NetworkClass(NetworkClassD),
	[NetworkClassE]: new NetworkClass(NetworkClassE)
}