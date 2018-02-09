/**
 * Collection is an abstract data type for storing and manipulating collections of data
 *
 * @class app.data.Collection
 * @extends Array
 * @param {Array} [data]
 */

app.data.Collection = function Collection(data) {
	this._currentIndex = 0;
	this._cyclic = false;
	if (data) {
		this.setData(data);
	}
};

app.data.Collection.prototype = Object.create(Array.prototype);
app.data.Collection.prototype.constructor = app.data.Collection;

/**
 * @property currentIndex
 * @public
 * @type {Number}
 */
Object.defineProperty(app.data.Collection.prototype, "currentIndex", {
	get: function get() {
		return this._currentIndex;
	},
	set: function set(index) {
		this._currentIndex = parseInt(index, 10);
	}
});

/**
 * @property cyclic
 * @public
 * @type {Boolean}
 */
Object.defineProperty(app.data.Collection.prototype, "cyclic", {
	get: function get() {
		return this._cyclic;
	},
	set: function set(isCyclic) {
		this._cyclic = Boolean(isCyclic);
	}
});

/**
 * @method setData
 * @public
 * @param {Array} data
 */
app.data.Collection.prototype.setData = function setData(data) {
	this._currentIndex = 0;
	while (this.length) {
		this.pop();
	}
	if (data instanceof Array) {
		this.push.apply(this, data);
	}
};

/**
 * @method hasPrevious
 * @public
 * @return {Boolean}
 */
app.data.Collection.prototype.hasPrevious = function hasPrevious() {
	if (this._cyclic) {
		return (this.length > 1);
	}
	return Boolean(this[this._currentIndex - 1]);
};

/**
 * @method hasNext
 * @public
 * @return {Boolean}
 */
app.data.Collection.prototype.hasNext = function hasNext() {
	if (this._cyclic) {
		return (this.length > 1);
	}
	return Boolean(this[this._currentIndex + 1]);
};

/**
 * @method current
 * @public
 * @return {Mixed}
 */
app.data.Collection.prototype.current = function current() {
	return this[this._currentIndex];
};

/**
 * @method previous
 * @public
 * @return {Mixed}
 */
app.data.Collection.prototype.previous = function previous() {
	if (this.hasPrevious()) {
		if (this._cyclic) {
			this._currentIndex = (this._currentIndex + this.length - 1) % this.length;
		} else {
			this._currentIndex--;
		}
		return this.current();
	}
	return null;
};

/**
 * @method next
 * @public
 * @return {Mixed}
 */
app.data.Collection.prototype.next = function next() {
	if (this.hasNext()) {
		if (this._cyclic) {
			this._currentIndex = (this._currentIndex + 1) % this.length;
		} else {
			this._currentIndex++;
		}
		return this.current();
	}
	return null;
};

/**
 * @method isCurrentFirst
 * @public
 * @return {Boolean}
 */
app.data.Collection.prototype.isCurrentFirst = function isCurrentFirst() {
	return (this._currentIndex === 0);
};

/**
 * @method isCurrentLast
 * @public
 * @return {Boolean}
 */
app.data.Collection.prototype.isCurrentLast = function isCurrentLast() {
	return (this._currentIndex === this.length - 1);
};
