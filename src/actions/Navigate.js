$actions.Navigate = (function navigate() {
	var contextStack = new $util.Stack(),
		previewedContext = null;

	/**
	 * @function clearStack
	 */
	function clearStack() {
		contextStack.forEach(function (context) {
			o5.gui.ViewManager.close(context);
		});
		contextStack.clear();
	}

	/**
	 * @function closePreview
	 */
	function closePreview() {
		if (previewedContext) {
			o5.gui.ViewManager.close(previewedContext);
			previewedContext = null;
		}
	}

	/**
	 * @function open
	 * @param {String} context
	 */
	function open(context) {
		contextStack.push(context);
		o5.gui.ViewManager.openToTimeout(context); // Closes previous context already
	}

	/**
	 * @function to
	 * @param {String} context
	 */
	function to(context) {
		closePreview();
		contextStack.push(context);
		o5.gui.ViewManager.navigateToTimeout(context); // Closes previous context already
	}

	/**
	 * @function toDefault
	 */
	function toDefault() {
		closePreview();
		clearStack();  // Close all contexts in the stack (should not be needed unless previewed then activated)
		o5.gui.ViewManager.navigateToDefault();
	}

	/**
	 * @function preview
	 * @param {String} context
	 */
	function preview(context) {
		closePreview();
		previewedContext = context;
		o5.gui.ViewManager.preview(context);
	}

	/**
	 * @function back
	 */
	function back() {
		closePreview();
		o5.gui.ViewManager.close(contextStack.pop());
		if (contextStack.isEmpty()) {
			o5.gui.ViewManager.navigateToDefault();
		} else {
			o5.gui.ViewManager.navigateToTimeout(contextStack.peek());
		}
	}

	/**
	 * @function backTo
	 * @param {String} context
	 */
	function backTo(context) {
		while (!contextStack.isEmpty() && contextStack.peek() !== context) {
			o5.gui.ViewManager.close(contextStack.pop());
		}

		if (contextStack.isEmpty()) {
			o5.gui.ViewManager.navigateToDefault();
		} else {
			o5.gui.ViewManager.navigateToTimeout(context);
		}
	}
	
	/**
	 * @function init
	 */
	function init() {
		$util.Events.on("app:navigate:to", to);
		$util.Events.on("app:navigate:open", open);
		$util.Events.on("app:navigate:to:default", toDefault);
		$util.Events.on("app:navigate:preview", preview);
		$util.Events.on("app:navigate:back", back);
		$util.Events.on("app:navigate:back:to", backTo);
	}

	return {
		init: init
	};

})();
