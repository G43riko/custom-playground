// import * as faceapi from "@vladmandic/face-api";
// declare const faceapi: any;
import { faceapi } from "../custom";

const video = document.getElementById("video") as HTMLVideoElement;

const startVideo = (): void => {
    navigator.getUserMedia(
        {video: {}},
        (stream) => video.srcObject = stream as any,
        (err) => console.error(err),
    );
};


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
    faceapi.nets.faceExpressionNet.loadFromUri("../models"),
]).then(startVideo);


video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections        = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                               .withFaceLandmarks()
                                               .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawContour(canvas, resizedDetections)
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.05, new faceapi.Point(100, 100));
    }, 1000 / 60);
});