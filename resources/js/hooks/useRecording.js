import React, { useState, useRef } from "react";
import RecordRTC from "recordrtc";
import { useThesisStore } from "~/states/thesisState";
import shallow from "zustand/shallow";
let recorder = "";

export const useRecording = () => {
    const [videoData, setVideoData, setScreenRecordDetails, setRecordData] = useThesisStore(
        (state) => [state.videoData, state.setVideoData, state.setScreenRecordDetails, state.setRecordData],
        shallow
    );
    const recordedVideoUrl = useRef(null);
    const isOpenVideoModal = useRef(false);
    const recorderRef = useRef(null);
    const startDisable = useRef(false);
    const stopDisable = useRef(true);
    const cameraRef = useRef(null);
    const screenRef = useRef(null);
    const loadModal = useRef(false);
    const recordPreview = useRef(null);

    const startScreenRecord = () => {
        captureScreen((screen) => {
            captureCamera(async (camera) => {
                screen.width = window.screen.width;
                screen.height = window.screen.height;
                screen.fullcanvas = true;
                camera.width = 320;
                camera.height = 240;
                camera.top = screen.height - camera.height;
                camera.left = screen.width - camera.width;
                cameraRef.current = camera;
                screenRef.current = screen;
                recorder = RecordRTC([screen, camera], {
                    type: "video",
                });
                recorder.startRecording();
                recorder.screen = screen;
            });
        });
    };

    //to enable audio and video pass true to disable pass false
    const captureCamera = (cb) => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: false, //make it true for video
            })
            .then(cb);
    };

    //to capture screen  we need to make sure that which media devices are captured and add listeners to // start and stop stream
    const captureScreen = (callback) => {
        invokeGetDisplayMedia(
            (screen) => {
                addStreamStopListener(screen, () => {});
                callback(screen);
            },
            (error) => {
                console.error(error);
                alert(
                    "Unable to capture your screen. Please check console logs.\n" +
                        error
                );
                //  setState({
                //     ...state,
                //     stopDisable: true, startDisable: false
                // });
            }
        );
    };

    //tracks stop
    // const stopLocalVideo = async (screen, camera) => {
    //     // [screen, camera].forEach(async (stream) => {
    //     //     stream.getTracks().forEach(async (track) => {
    //     //         track.stop();
    //     //     });
    //     // });
    // };
    //getting media items
    const invokeGetDisplayMedia = (success, error) => {
        var displaymediastreamconstraints = {
            video: {
                displaySurface: "monitor", // monitor, window, application, browser
                logicalSurface: true,
                cursor: "always", // never, always, motion
            },
        };
        // above constraints are NOT supported YET
        // that's why overridnig them
        displaymediastreamconstraints = {
            video: true,
            audio: true,
        };
        if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices
                .getDisplayMedia(displaymediastreamconstraints)
                .then(success)
                .catch(error);
        } else {
            navigator
                .getDisplayMedia(displaymediastreamconstraints)
                .then(success)
                .catch(error);
        }
    };
    //adding event listener
    const addStreamStopListener = (stream, callback) => {
        stream.addEventListener(
            "ended",
            () => {
                callback();
                callback = () => {};
            },
            false
        );
        stream.addEventListener(
            "inactive",
            () => {
                callback();
                callback = () => {};
            },
            false
        );
        stream.getTracks().forEach((track) => {
            track.addEventListener(
                "ended",
                () => {
                    callback();
                    callback = () => {};
                },
                false
            );
            track.addEventListener(
                "inactive",
                () => {
                    callback();
                    callback = () => {};
                },
                false
            );
        });
        stream.getVideoTracks()[0].onended = () => {
            stop();
        };
    };
    // stop screen recording
    const stop = async () => {
        startDisable.current = true;
        recorder.stopRecording(stopRecordingCallback);
    };
    //destory screen recording
    const stopRecordingCallback = async () => {
        await stopLocalVideo(screenRef.current, cameraRef.current);
        let recordedVideoUrlData;
        if (recorder.getBlob()) {
            recordPreview.current = recorder.getBlob();
            recordedVideoUrlData = URL.createObjectURL(recorder.getBlob());
        }

        recordedVideoUrl.current = recordedVideoUrlData;
        screenRef.current = null;
        isOpenVideoModal.current = true;
        startDisable.current = false;
        stopDisable.current = true;
        cameraRef.current = null;
        setScreenRecordDetails(true);
        setVideoData(recordedVideoUrl.current);
        setRecordData(recordPreview.current)
        recorder.screen.stop();
        recorder.destroy();
        recorder = null;
    };
    // stop audio recording
    const stopLocalVideo = async (screen, camera) => {
        [screen, camera].forEach(async (stream) => {
            stream.getTracks().forEach(async (track) => {
                track.stop();
            });
        });
    };

    //close video modal
    const videoModalClose = () => {
        // setState({
        //     ...state,
        //     isOpenVideoModal: false,
        // });
    };


    

    return [startScreenRecord, videoData];
};
