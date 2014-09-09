function waiter (callback) {
	var message = 'yolo';
	setTimeout(function () {
	callback(message);

	}, 5000)
}

waiter(function (message) {
	console.log(message);
})

console.log('dummy')