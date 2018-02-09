
describe("app.data.Collection tests", function() {

	var stringArray = [],
		collection;

	beforeEach(function() {
		stringArray = ["first", "second", "third"];
		collection = null;
	});

	afterEach(function() {
	});

	describe("Collection() constructor", function() {
		it("Should set the collection data", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection[0]).toBe(stringArray[0]);
		});
	});

	describe("currentIndex", function() {
		it("Should set the collection data", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.currentIndex).toEqual(0);
			expect(collection.current()).toBe(stringArray[0]);
			collection.currentIndex = 2;
			expect(collection.currentIndex).toEqual(2);
			expect(collection.current()).toBe(stringArray[2]);
		});
	});

	describe("cyclic", function() {
		it("Should set the cyclic behaviour", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.cyclic).toEqual(false);
			collection.cyclic = true;
			expect(collection.cyclic).toEqual(true);
			collection.cyclic = 0;
			expect(collection.cyclic).toEqual(false);
			collection.cyclic = 1;
			expect(collection.cyclic).toEqual(true);
			collection.cyclic = "false";
			expect(collection.cyclic).toEqual(true);
		});
		it("Should not return a value before the start", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.hasPrevious()).toEqual(false);
			expect(collection.previous()).toEqual(null);
		});
		it("Should not return a value past the end", function() {
			var collection = new app.data.Collection(stringArray);
			collection.currentIndex = 2;
			expect(collection.hasNext()).toEqual(false);
			expect(collection.next()).toEqual(null);
		});
		it("Should return a value before the start", function() {
			var collection = new app.data.Collection(stringArray);
			collection.cyclic = true;
			expect(collection.hasPrevious()).toEqual(true);
			expect(collection.previous()).not.toEqual(null);
		});
		it("Should return a value past the end", function() {
			var collection = new app.data.Collection(stringArray);
			collection.currentIndex = 2;
			collection.cyclic = true;
			expect(collection.hasNext()).toEqual(true);
			expect(collection.next()).not.toEqual(null);
		});
	});

	describe("setData()", function() {
		it("Should set the collection data", function() {
			var collection = new app.data.Collection();
			collection.setData(stringArray);
			expect(collection[0]).toBe(stringArray[0]);
		});
	});

	describe("hasPrevious()", function() {
		it("empty", function() {
			var collection = new app.data.Collection();
			expect(collection.hasPrevious()).toBe(false);
			collection.cyclic = true;
			expect(collection.hasPrevious()).toBe(false);
		});
		it("containing one item", function() {
			var collection = new app.data.Collection(["item"]);
			expect(collection.hasPrevious()).toBe(false);
			collection.cyclic = true;
			expect(collection.hasPrevious()).toBe(false);
		});
		it("non-cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.hasPrevious()).toBe(false);
			collection.currentIndex = 2;
			expect(collection.hasPrevious()).toBe(true);
		});
		it("cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			collection.cyclic = true;
			expect(collection.hasPrevious()).toBe(true);
		});
	});

	describe("hasNext()", function() {
		it("empty", function() {
			var collection = new app.data.Collection();
			expect(collection.hasNext()).toBe(false);
			collection.cyclic = true;
			expect(collection.hasNext()).toBe(false);
		});
		it("containing one item", function() {
			var collection = new app.data.Collection(["item"]);
			expect(collection.hasNext()).toBe(false);
			collection.cyclic = true;
			expect(collection.hasNext()).toBe(false);
		});
		it("non-cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.hasNext()).toBe(true);
			collection.currentIndex = 2;
			expect(collection.hasNext()).toBe(false);
		});
		it("cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			collection.cyclic = true;
			collection.currentIndex = 2;
			expect(collection.hasNext()).toBe(true);
		});
	});

	describe("current()", function() {
		it("Should return the current item", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.current()).toBe(stringArray[0]);
			collection.currentIndex = 2;
			expect(collection.current()).toBe(stringArray[2]);
		});
	});

	describe("previous()", function() {
		it("empty", function() {
			var collection = new app.data.Collection();
			expect(collection.previous()).toBe(null);
		});
		it("containing one item", function() {
			var collection = new app.data.Collection(["item"]);
			expect(collection.previous()).toBe(null);
		});
		it("non-cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.previous()).toBe(null);
			collection.currentIndex = 2;
			expect(collection.previous()).toBe(stringArray[1]);
			expect(collection.currentIndex).toBe(1);
		});
		it("cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			collection.cyclic = true;
			expect(collection.previous()).toBe(stringArray[2]);
		});
	});

	describe("next()", function() {
		it("empty", function() {
			var collection = new app.data.Collection();
			expect(collection.next()).toBe(null);
		});
		it("containing one item", function() {
			var collection = new app.data.Collection(["item"]);
			expect(collection.next()).toBe(null);
		});
		it("non-cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			collection.currentIndex = 2;
			expect(collection.next()).toBe(null);
		});
		it("cyclic", function() {
			var collection = new app.data.Collection(stringArray);
			collection.cyclic = true;
			expect(collection.next()).toBe(stringArray[1]);
			expect(collection.currentIndex).toBe(1);
			collection.currentIndex = 2;
			expect(collection.next()).toBe(stringArray[0]);
		});
	});

	describe("isCurrentFirst()", function() {
		it("Should return if the current item is first", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.isCurrentFirst()).toBe(true);
			collection.next();
			expect(collection.isCurrentFirst()).toBe(false);
		});
	});

	describe("isCurrentLast()", function() {
		it("Should return if the current item is last", function() {
			var collection = new app.data.Collection(stringArray);
			expect(collection.isCurrentLast()).toBe(false);
			collection.currentIndex = 2;
			expect(collection.isCurrentLast()).toBe(true);
		});
	});

});