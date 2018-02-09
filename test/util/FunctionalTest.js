
describe("$util.Functional tests", function() {

	var addOne = function (n) {
			return n + 1;
		},
		multiplyByThree = function (n) {
			return n * 3;
		},
		multiply = function (n1, n2) {
			return n1 * n2;
		},
		addThreeNumbers = function (n1, n2, n3) {
			return n1 + n2 + n3;
		},
		stringArray = ["first", "second", "third"];

	describe("compose()", function() {
		it("Performs right to left function composition", function() {
			var composed = $util.Functional.compose(multiplyByThree, addOne);
			expect(composed(4)).toBe(15);
		});
	});

	describe("curry()", function() {
		it("Creates a curried function", function() {
			var curried = $util.Functional.curry(addThreeNumbers),
				curried2 = curried(5),
				curried3 = curried2(5);
			expect(typeof curried(5)).toBe("function");
			expect(typeof curried2(5)).toBe("function");
			expect(curried3(5)).toBe(15);
		});
		it("Creates a curried function", function() {
			var curried = $util.Functional.curry(addThreeNumbers);
			expect(curried(5)(5)(5)).toBe(15);
			expect(curried(5, 5)(5)).toBe(15);
			expect(curried(5)(5, 5)).toBe(15);
		});
	});

	describe("fork()", function() {
		it("Returns a function for performing a forking operation", function() {
			var forked = $util.Functional.fork(multiply, multiplyByThree, addOne);
			expect(forked(4)).toBe(60);
		});
	});

	describe("partial()", function() {
		it("Creates a partially applied function", function() {
			var multiplyByTwo = $util.Functional.partial(multiply, 2);
			expect(multiplyByTwo(25)).toBe(50);
		});
	});

	describe("pipe()", function() {
		it("Performs left to right function composition", function() {
			var composed = $util.Functional.pipe(addOne, multiplyByThree);
			expect(composed(4)).toBe(15);
		});
	});

	describe("previous()", function() {
		it("Returns the previous element in an array in a cyclic manner", function() {
			expect($util.Functional.previous(stringArray, 2)).toBe("second");
			expect($util.Functional.previous(stringArray, 0)).toBe("third");
		});
	});

	describe("next()", function() {
		it("Returns the next element in an array in a cyclic manner", function() {
			expect($util.Functional.next(stringArray, 2)).toBe("first");
			expect($util.Functional.next(stringArray, 0)).toBe("second");
		});
	});

	describe("last()", function() {
		it("Returns the last element in an array", function() {
			expect($util.Functional.last(stringArray)).toBe("third");
		});
	});

	describe("range()", function() {
		it("Returns an array of length 5, starting at 0", function() {
			var range = $util.Functional.range(5);
			expect(Array.isArray(range)).toBe(true);
			expect(range[0]).toEqual(0);
			expect(range[4]).toEqual(4);
			expect(range[5]).toBe(undefined);
		});
		it("Returns an array of length 5, starting at 1", function() {
			var range = $util.Functional.range(5, 1);
			expect(range[0]).toEqual(1);
			expect(range[4]).toEqual(5);
			expect(range[5]).toBe(undefined);
		});
		it("Returns an array of length 5, starting at -3", function() {
			var range = $util.Functional.range(5, -3);
			expect(range[0]).toEqual(-3);
			expect(range[4]).toEqual(1);
			expect(range[5]).toBe(undefined);
		});
		it("Returns an array of length 0", function() {
			var range = $util.Functional.range(-30);
			expect(Array.isArray(range)).toBe(true);
			expect(range.length).toEqual(0);
		});
		it("Returns an array of length 0", function() {
			var range = $util.Functional.range(-30, 30);
			expect(Array.isArray(range)).toBe(true);
			expect(range.length).toEqual(0);
		});
	});

});