cosa = [1,2,3,4]

for (var i = cosa.length - 1; i >= 0; i--) {
	setTimeout(function () {
		console.log('a');
	},1500)
};

cosa.pop()