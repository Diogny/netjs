import { ISubnetAddress, SubnetAddress } from "./lib/subnet-address";
import { ISubnetMask, SubnetMask } from "./lib/subnet-mask";
import { INetworkRange, NetworkRange } from "./lib/network-range";
import { INetworkClass, NetworkClass } from "./lib/network-class";
import { IDHCP, DHCP } from "./lib/dhcp";
import { IIP, IP } from "./lib/ip";
import { IMAC, MAC } from "./lib/mac";
import { ICIDR, CIDR } from "./lib/cidr";
import { ISubnet, Subnet } from "./lib/subnet";

export {
	ISubnetAddress, SubnetAddress,
	ISubnetMask, SubnetMask,
	INetworkRange, NetworkRange,
	INetworkClass, NetworkClass,
	IDHCP, DHCP,
	IIP, IP,
	IMAC, MAC,
	ICIDR, CIDR,
	ISubnet, Subnet
}
export {
	binary, chunkString, chunkRightString, integer, pad, padRight, removeTrailingZeros,
	NetworkClassAny, NetworkClassA, NetworkClassB, NetworkClassC, NetworkClassD, NetworkClassE
} from "./lib/common";
