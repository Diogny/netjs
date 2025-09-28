import { NetClassType, NetworkClassA, NetworkClassAny, NetworkClassB, NetworkClassC, NetworkClassD, NetworkClassE } from "./common";
import { INetworkRange, NetworkRange } from "./network-range";
import { ISubnetAdress, SubnetAdress } from "./subnet-address";

export interface INetworkClass {
	/** return the network class type */
	get type(): NetClassType;
	/** returns the start of the CIDR for the class */
	get startCIDR(): number;
	/** returns the default of the CIDR for the class */
	get defaultCIDR(): number;
	/** returns the default or public range */
	get publicRange(): INetworkRange;
	/** returns the private range */
	get privateRange(): INetworkRange;
	/** returns the default subnet mask of the network class */
	get defaultMask(): ISubnetAdress;
}

//really good explanation
//https://www.meridianoutpost.com/resources/articles/IP-classes.php

export class NetworkClass implements INetworkClass {

	readonly startCIDR: number;

	readonly defaultCIDR: number;

	readonly publicRange: INetworkRange;

	readonly privateRange: INetworkRange;

	readonly defaultMask: ISubnetAdress;

	/**
	 * Creates a network class
	 * @param type network class type
	 */
	constructor(public readonly type: NetClassType) {
		switch (this.type) {
			case NetworkClassAny:
				this.startCIDR = 1;
				this.defaultCIDR = 1;
				this.publicRange = NetworkRange.create("0.0.0.0-255.255.255.255");
				// private and public same, but shouldn't have a private range, full range
				this.privateRange = NetworkRange.create("0.0.0.0-255.255.255.255");
				this.defaultMask = SubnetAdress.from("255.255.255.255");
				break;
			case NetworkClassA:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.publicRange = NetworkRange.create("1.0.0.0-126.255.255.255");
				this.privateRange = NetworkRange.create("10.0.0.0-10.255.255.255");
				this.defaultMask = SubnetAdress.from("255.0.0.0");
				break
			case NetworkClassB:
				this.startCIDR = 16;
				this.defaultCIDR = 16;
				this.publicRange = NetworkRange.create("128.0.0.0-191.255.255.255");
				this.privateRange = NetworkRange.create("172.16.0.0-172.31.255.255");
				this.defaultMask = SubnetAdress.from("255.255.0.0");
				break;
			case NetworkClassC:
				this.startCIDR = 16;
				this.defaultCIDR = 24;
				this.publicRange = NetworkRange.create("192.0.0.0-223.255.255.255");
				this.privateRange = NetworkRange.create("192.168.0.0-192.168.255.255");
				this.defaultMask = SubnetAdress.from("255.255.255.0");
				break;
			case NetworkClassD:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.publicRange = NetworkRange.create("224.0.0.0-239.255.255.255");
				// private and public same, but shouldn't have a private range
				this.privateRange = NetworkRange.create("224.0.0.0-239.255.255.255");
				this.defaultMask = SubnetAdress.from("255.0.0.0");
				break;
			case NetworkClassE:
				this.startCIDR = 8;
				this.defaultCIDR = 8;
				this.publicRange = NetworkRange.create("240.0.0.0-255.255.255.255");
				// private and public same, but shouldn't have a private range
				this.privateRange = NetworkRange.create("240.0.0.0-255.255.255.255");
				this.defaultMask = SubnetAdress.from("255.0.0.0");
				break;
		}
	}

	/**
	 * returns the default network class information
	 * @param type network class type
	 * @returns 
	 */
	static defaultClass(type: NetClassType): NetworkClass | undefined {
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