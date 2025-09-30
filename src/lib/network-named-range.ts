import { INetworkRange, NetworkRange } from "./network-range";
import { ISubnetAddress } from "./subnet-address";

/** this's the `default` full range */
export const publicRangeName = "public";

export interface INetworkNamedRange extends INetworkRange {
	/** 
	 * returns the name of the range.
	 * 
	 * the full range's name is `public`
	*/
	get name(): string;
	/** returns true if the network range is `public` or the whole network range */
	get isPublic(): boolean;
	/** returns a clone as a network named range */
	clone(): INetworkNamedRange;
}

export class NetworkNamedRange extends NetworkRange implements INetworkNamedRange {

	readonly name: string;

	get isPublic(): boolean {
		return this.name == publicRangeName
	}

	/**
	 * creates a network named range
	 * @param address Network Range Address or IP start, or string with full network range like x.x.x.x - x.x.x.x
	 * @param broadcast Network Range Broadcast Address or IP end
	 * @param name range name {@link publicName} aka `public` for full range
	 */
	constructor(address: ISubnetAddress | string, broadcast?: ISubnetAddress, name?: string) {
		super(address, broadcast);
		this.name = name ?? publicRangeName;
	}

	clone(): INetworkNamedRange {
		return new NetworkNamedRange(this.address, this.broadcast, this.name)
	}
}