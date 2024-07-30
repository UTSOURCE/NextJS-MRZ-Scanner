import "dynamsoft-license";
import "dynamsoft-capture-vision-router";
import "dynamsoft-label-recognizer";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CaptureVisionRouter, CapturedResultReceiver } from "dynamsoft-capture-vision-router";
import { CoreModule } from "dynamsoft-core";
import { MutableRefObject, useEffect, useRef } from "react";
import { LabelRecognizerModule, RecognizedTextLinesResult } from "dynamsoft-label-recognizer";
import React from "react";

export interface MRZScannerProps{
  isScanning?:boolean;
  onInitialized?:()=>void;
  onScanned?:(results:RecognizedTextLinesResult)=>void;
}

const MRZScanner: React.FC<MRZScannerProps> = (props:MRZScannerProps) => {
  const initialized = useRef(false);
  const cameraEnhancer = useRef<CameraEnhancer|null>(null);
  const router = useRef<CaptureVisionRouter|null>(null);
  const container:MutableRefObject<HTMLDivElement|null>  = useRef(null);
  useEffect(()=>{
    init();
  },[])

  useEffect(()=>{
    if (props.isScanning === true) {
      startScanning();
    }else{
      stopScanning();
    }
  },[props.isScanning])

  const init = async () => {
    if (initialized.current == false) {
      initialized.current = true;
      await initCameraEnhancer();
      await initLabelRecognizer();
      if (props.onInitialized) {
        props.onInitialized();
      }
      if (props.isScanning === true) {
        startScanning();
      }
    }
  }

  const initLabelRecognizer = async () => {
    // Preload "LabelRecogznier" module for recognizing text. It will save time on the initial recognizing by skipping the module loading.
    await CoreModule.loadWasm(["DLR"]);
    await LabelRecognizerModule.loadRecognitionData("MRZ");
    router.current = await CaptureVisionRouter.createInstance();
    router.current.initSettings("/template.json");
    // Define a callback for results.
    const resultReceiver = new CapturedResultReceiver();
    resultReceiver.onRecognizedTextLinesReceived = (result: RecognizedTextLinesResult) => {
      console.log(result);
      if (props.onScanned) {
        props.onScanned(result);
      }
    };
    router.current.addResultReceiver(resultReceiver);
    if (cameraEnhancer.current) {
      router.current.setInput(cameraEnhancer.current);
    }
  }

  const initCameraEnhancer = async () => {
    const cameraView = await CameraView.createInstance();
    cameraEnhancer.current = await CameraEnhancer.createInstance(cameraView);
    container.current!.append(cameraView.getUIElement());
  }

  const startScanning = async () => {
    stopScanning();
    if (cameraEnhancer.current && router.current) {
      cameraEnhancer.current.open();
      router.current.startCapturing("ReadMRZ")
    }
  }

  const stopScanning = () => {
    if (cameraEnhancer.current && router.current) {
      router.current.stopCapturing();
      cameraEnhancer.current.close();
    }
  }

  return (
    <div ref={container} style={{width:"100%",height:"100%"}}></div>
  )
}

export default MRZScanner;