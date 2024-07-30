"use client"
import "dynamsoft-license";
import "dynamsoft-capture-vision-router";
import "dynamsoft-label-recognizer";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CaptureVisionRouter, CapturedResultReceiver } from "dynamsoft-capture-vision-router";
import { CoreModule } from "dynamsoft-core";
import { LicenseManager } from "dynamsoft-license";
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
      configure();
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

  const configure = () => {
    /** LICENSE ALERT - README
     * To use the library, you need to first specify a license key using the API "initLicense()" as shown below.
     */

    LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");

    /**
     * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dbr&package=js to get your own trial license good for 30 days.
     * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
     * For more information, see https://www.dynamsoft.com/barcode-reader/programming/javascript/user-guide/?ver=9.6.20&utm_source=github#specify-the-license or contact support@dynamsoft.com.
     * LICENSE ALERT - THE END
     */

    CoreModule.engineResourcePaths = {
      std: 'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.2.10/dist/',
      dip: 'https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30/dist/',
      core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.2.30/dist/",
      license: "https://cdn.jsdelivr.net/npm/dynamsoft-license@3.2.21/dist/",
      cvr: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.2.30/dist/",
      dlr: "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@3.2.30/dist/",
      dce: "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.2/dist/",
      dnn: 'https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-dnn@1.0.20/dist/',
      dlrData: 'https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer-data@1.0.10/dist/',
      utility: 'https://cdn.jsdelivr.net/npm/dynamsoft-utility@1.2.20/dist/'
    };
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