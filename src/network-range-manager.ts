import { INetworkNamedRange, NetworkNamedRange, publicRangeName } from "./network-named-range";

export interface INetworkRangeManager {

	/** get the registered sub-ranges */
	get all(): INetworkNamedRange[];
	/** returns the default or `public` network range created initially with manager constructor */
	get default(): INetworkNamedRange;
	/**
	 * returns true if this sub-range is registered
	 * @param name sub-range name
	 */
	has(name: string): boolean;
	/**
	 * finds a range
	 * @param name range name
	 */
	find(name: string): INetworkNamedRange | undefined;
	/**
	 * adds a sub-range to the `public` or default range
	 * 
	 * for now it only check sub-range is included in default `public` range
	 * 
	 * @param range sub-range
	 */
	add(range: INetworkNamedRange): boolean;
}

/**
 * implements a network range manager to handle multiple ranges
 */
export class NetworkRangeManager implements INetworkRangeManager {

	#all: INetworkNamedRange[];
	get all(): INetworkNamedRange[] {
		return Array.from(this.#all);
	}

	/**
	 * creates a network range manager with default `public` range
	 * @param publicRange string with full network range like x.x.x.x - x.x.x.x
	 */
	constructor(publicRange: string) {
		this.#all = [new NetworkNamedRange(publicRange, void 0, publicRangeName)];
	}

	get default(): INetworkNamedRange {
		return this.find(publicRangeName) as INetworkNamedRange;
	}

	has(name: string): boolean {
		return !!this.#all.find(r => r.name == name)
	}

	find(name: string): INetworkNamedRange | undefined {
		return this.#all.find(r => r.name == name)
	}

	add(range: INetworkNamedRange): boolean {
		//new range must be bigger than or less than public|default range
		if (this.has(range.name)) {
			return false;
		}
		this.#all.push(range.clone());
		return true
	}

}