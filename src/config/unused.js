$config.addDefaultSettings({

	/*
	 * sets the STB environment
	 * {String} IP, (expects network, will signon)
	 * DVB, (no signon, runs channel scan)
	 * HYBRID (signon if network otherwise DVB)
	 * HYBRID-SI (signon if network and IPSI otherwise DVB)
	 */
	"stb.environment": {
		value   : "HYBRID-SI",
		override: true
	}
});
