export const
	NetworkClassAny = "Class Any",
	NetworkClassA = "Class A",
	NetworkClassB = "Class B",
	NetworkClassC = "Class C",
	NetworkClassD = "Class D",
	NetworkClassE = "Class E";

export const NetClassArray = [NetworkClassA, NetworkClassB, NetworkClassC, NetworkClassD, NetworkClassE] as const;
export type NetClassType = typeof NetworkClassAny | typeof NetClassArray[number];

export
	const NetClassArrayMap = [
		/**
		 * Class A  0xxx    0000(0)  - 0111(7)	 0-127
		 * private 10.0.0.0 - 10.255.255.255
		 * loopback 127.0.0.0 - 127.255.255.255 localhost 127.0.0.1
		 * default mask 255.0.0.0		/8			starts at /8	10 = 00001010
		 */
		0, 0, 0, 0, 0, 0, 0, 0,
		/**
		 * Class B  10xx	1000(8)  - 1011(11)	 128-191
		 * private 172.16.0.0 - 172.31.255.255
		 * default mask 255.255.0.0		/16			starts at /16	16 = 00010000	31 = 00011111
		 */
		1, 1, 1, 1,
		/**
		 * Class C  110x	1100(12) - 1101(13)	 192-223
		 * private 192.168.0.0 - 192.168.255.255
		 * default mask 255.255.255.0	/24			starts at /16	168 = 10101000
		 */
		2, 2,
		/**
		 * Class D	1110	1110(14)			 224-239
		 * 
		 */
		3,
		/**
		 * Class E	1111	1111(15)			 240-255
		 * broadcast
		 */
		4
	];