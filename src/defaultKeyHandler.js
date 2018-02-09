/*
 * @public
 * @method defaultKeyHandler
 * @param {Event} e
 */
 // eslint-disable-next-line complexity
$util.defaultKeyHandler = function defaultKeyHandler (e) {

	if (e.key >= "0" && e.key <= "9") {
		$util.Events.fire("channelEntry:number", e.key);
		e.stopImmediatePropagation();
		return;
	}
	var view = o5.gui.viewManager.activeView,
		themeName,
		name = view ? view.localName : "";

	console.log(e.key, e.which);
	switch (e.key) {

		case "DVR":
			$util.ControlEvents.fire("app-player", "fetch", {});
			$util.Events.fire("app:navigate:to", "player");
			break;
        case "Record":
		case "Favorites":
			if (o5.gui.viewManager.activeView.localName === "app-surf") {
				$util.ControlEvents.fire("app-surf", "favorite");
				e.stopImmediatePropagation();
			}
//			$util.ControlEvents.fire(":dialogPinEntryH", "show");
//			$util.ControlEvents.fire(":dialogPinEntryH", "focus");
//			handled = true;
			break;

		/*case "Yellow":
			$util.ControlEvents.fire("app-surf:surfScanProgListContRight", "select", "#surfScanPlayerBar");
			$util.ControlEvents.fire("app-surf:surfScanProgListContRight", "forward", "fetch");
			handled = true;
			break;*/
		case "Blue":
			$util.ControlEvents.fire("app-surf:surfScanProgListContRight", "select", "#surfFutureEventsList");
			$util.ControlEvents.fire("app-surf:surfScanProgListContRight", "forward", "fetch");
			break;

		case "Exit":
		case "Surf":
		case "Foxtel":
			// surfer will handle this temp key itself (it wants to fade out first)
			if (o5.gui.viewManager.activeView.localName !== "app-surf") {
				$util.Events.fire("app:navigate:to:default");
			}
			break;

		case "Guide":
			// small shortcut to launch HomeMenu on TV Guide page (to be revisted later)
			$util.ControlEvents.fire("app-home-menu", "fetch");
			$util.Events.fire("app:navigate:to", "home-menu");
			this._spinnerTimer = setTimeout(function () {
				$util.ControlEvents.fire("app-home-menu:portalMenu", "select", 1);
			}, 10);
			break;

		case "Settings":
			$util.Events.fire("app:navigate:to", "settings");
			break;

		case "Home":
		case "Menu":
		case "Active":
			if (o5.gui.viewManager.activeView.localName !== "app-home-menu") {
				$util.ControlEvents.fire("app-home-menu", "fetch");
				$util.Events.fire("app:navigate:to", "home-menu");
			}
			break;
		case "Search":
		case "Help":
			if (o5.gui.viewManager.activeView.localName !== "app-search-query") {
				$util.ControlEvents.fire("app-search-query", "fetch", '');
				$util.Events.fire("app:navigate:to", "searchQuery");
			}
			break;
		case "Mute":
		case "VolumeDown":
		case "VolumeUp":
			$util.ControlEvents.fire(":volume", "show");
			$util.ControlEvents.fire(":volume", "key:down", e);
			break;

		case "ThemeSwap":
			themeName = $config.getConfigValue("settings.view.theme") === "Rel6" ? "Rel8" : "Rel6";
			$config.saveConfigValue("settings.view.theme", themeName);
			document.querySelector('body').className = themeName + "Theme";
			name = name || "home-menu";
			$util.ControlEvents.fire("app-home-menu", "fetch");
			$util.Events.fire("app:navigate:to", name);
			break;
		case "Power":
			$util.PowerMgmt.handler();
			e.stopImmediatePropagation();
			break;
		default:
			break;
	}

	e.preventDefault();
};

// TODO: delete this line - temporary solution
o5.gui.UserInputManager._systemKeys[61539] = ["Settings"]; // RCU - Setup
o5.gui.UserInputManager._systemKeys[62722] = ["Surf"];			// RCU - Planner

o5.gui.UserInputManager._systemKeys[90] = ["ThemeSwap"]; // Z

//Added for 7268 RCU keys
o5.gui.UserInputManager._systemKeys[62723] = ["Foxtel"];// RCU - Foxtel
o5.gui.UserInputManager._systemKeys[62724] = ["Av"];			// RCU - Av
o5.gui.UserInputManager._systemKeys[62720] = ["OnDemand"]; // RCU - OnDemand
o5.gui.UserInputManager._systemKeys[62721] = ["Active"];			// RCU - Active

o5.gui.UserInputManager._systemKeys[86] = ["Foxtel"]; // Keyboard-V
o5.gui.UserInputManager._systemKeys[65] = ["Av"];			// Keyboard-A
o5.gui.UserInputManager._systemKeys[79] = ["OnDemand"]; // Keyboard-O
o5.gui.UserInputManager._systemKeys[66] = ["Active"];			// Keyboard-B
o5.gui.UserInputManager._systemKeys[83] = ["Settings"]; // Keyboard-S
o5.gui.UserInputManager._systemKeys[67] = ["Surf"];			// Keyboard-C
o5.gui.UserInputManager._systemKeys[35] = ["Forward"]; // Keyboard-End
o5.gui.UserInputManager._systemKeys[46] = ["Help"];			// Keyboard-Delete
o5.gui.UserInputManager._systemKeys[87] = ["Search"]; // Keyboard-W
