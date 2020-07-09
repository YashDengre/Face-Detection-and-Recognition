const camerxBox = document.getElementById("CameraContainer");

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
	faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)
function startVideo(){
	navigator.getUserMedia(
		{video: {}},
	stream => camerxBox.srcObject = stream,
	err => console.log(err)
	)
}

camerxBox.addEventListener('play',() => {
	const canvas = faceapi.createCanvasFromMedia(camerxBox)
	document.body.append(canvas)
	const displaySize = {width : camerxBox.width, height : camerxBox.height }
	faceapi.matchDimensions(canvas,displaySize)
	console.log('test')
	setInterval(async () =>{
		const detections = await faceapi.detectAllFaces(camerxBox,
			new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
			.withFaceExpressions()
		const resizedDetections = faceapi.resizeResults(detections,
			displaySize)
			canvas.getContext('2d').clearRect(0,0,canvas.width ,canvas.height)
			faceapi.draw.drawDetections(canvas,resizedDetections)
			faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
			faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
	},100)
})

// if (navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true })
//     .then(function (stream) {
//         camerxBox.srcObject = stream;
//     })
//     .catch(function (err0r) {
//       console.log("Something went wrong!");
//     });
// }