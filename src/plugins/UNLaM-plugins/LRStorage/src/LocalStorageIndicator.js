define(
	[],
	function () {

		var LOCAL_STORAGE_WARNING = [
			"Using browser local storage for persistence.",
			"Anything you create or change will only be saved",
			"in this browser on this machine."
		].join(' ');

		/**
		 * Indicator for local storage persistence. Provides a minimum
		 * level of feedback indicating that local storage is in use.
		 * @constructor
		 * @memberof platform/persistence/local
		 * @implements {Indicator}
		 */
		function LocalStorageIndicator() {
		}

		LocalStorageIndicator.prototype.getCssClass = function () {
			return "c-indicator--clickable icon-suitcase s-status-caution";
		};
		LocalStorageIndicator.prototype.getGlyphClass = function () {
			return 'caution';
		};
		LocalStorageIndicator.prototype.getText = function () {
			return "Off-line storage";
		};
		LocalStorageIndicator.prototype.getDescription = function () {
			return LOCAL_STORAGE_WARNING;
		};

		return LocalStorageIndicator;
	}
);
