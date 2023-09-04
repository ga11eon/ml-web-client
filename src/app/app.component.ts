import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ServerAddressConfig} from "../../ServerAddressConfig";
import {BoundingBoxColorCollection} from "../../BoundingBoxColorCollection";
import {PyServerResponseMock} from "../../PyServerResponseMock";
import {WebClientService} from "./service/web-client.service";
import {Coordinate} from "./entity/Coordinate";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private canvasContext: any;
  private canvas: HTMLCanvasElement;
  private fileExtension: string;

  imageToProcessUrl: any;
  imageToProcess:any;
  addressList: any[];
  addressForm: FormGroup = new FormGroup({
    address: new FormControl('')
  })

  constructor(private webClient: WebClientService) {
    this.addressList = ServerAddressConfig;
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.drawDefaultImage();
    this.uploadDefaultImage();
  }

  public onFileSelect(event: any): void {
    let theFile = event.target.files[0];
    //check the file extension
    if (!this.fileHasProperExtension(theFile)) {
      alert('Please choose .png or .jpg file to upload');
      return;
    }
    this.saveSelectedFileExtension(theFile);
    //process selected file
    let reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onload = () => {
      this.imageToProcess = new Image();
      this.imageToProcess.src = reader.result;
      this.imageToProcessUrl = reader.result;
      this.imageToProcess.onload = () => {
        //display selected file
        this.loadImageOnCanvasAndResizeCanvasToFitImage(this.imageToProcessUrl);
      }
    }
  }

  public onAddressChange(): void {
    this.loadImageOnCanvasAndResizeCanvasToFitImage(this.imageToProcessUrl);
  }

  public async drawBoundingBoxes(): Promise<void> {
    //get coordinates to draw
    let coordinates: Coordinate[] = await this.getBoundingBoxesCoordinates(this.imageToProcess);
    //drawing
    for (let coordinate of coordinates) {
      //get color
      let theColor = this.getRandomColor();
      this.canvasContext.beginPath();
      //draw rectangle
      this.canvasContext.rect(
        coordinate.x1,
        coordinate.y1,
        coordinate.x2,
        coordinate.y2,
      );
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = theColor;
      //draw text
      this.canvasContext.font = '40px Yu Gothic Medium';
      this.canvasContext.textAlign="center";
      this.canvasContext.textBaseline = "middle";
      this.canvasContext.fillStyle = theColor;
      this.canvasContext.fillText(
        coordinate.className
        + '\n(' + coordinate.detectProb
        + ', ' + coordinate.classifyProb + ')',
        coordinate.x1 + (coordinate.x2 / 2),
        coordinate.y1 + (coordinate.y2 / 2)
      );
      this.canvasContext.stroke();
    }
  }

  private async getBoundingBoxesCoordinates(image: any): Promise<Coordinate[]> {
    let coordinates: Coordinate[] = [];
    //get the target backend address
    let chosenAddress = this.addressForm.controls['address'].value;
    if (chosenAddress == 'MOCK' || chosenAddress == '') {
      coordinates = this.extractCoordinatesFromPythonResponse(PyServerResponseMock);
      return coordinates;
    }
    //process the backend server response
    try {
      //get server response
      const pyResponse = <string> await this.webClient.sendToBackend(image, this.fileExtension, chosenAddress);
      //check if the server response has at least one coordinate string
      if (pyResponse.split(',').length - 1 < 6) {
        alert('Nothing found');
        return [];
      }
      //extract coordinates from pyResponse
      return this.extractCoordinatesFromPythonResponse(pyResponse);
    } catch (err: any) {
      alert('Unable to reach chosen server :-(');
      return [];
    }
  }

  private extractCoordinatesFromPythonResponse(pyResponse: string): Coordinate[] {
    let pyResponseAsString = JSON.stringify(pyResponse);
    //cut off edge [ and ] of whole response string
    pyResponseAsString =
      pyResponseAsString.slice(0, 0)
      + pyResponseAsString.slice(1);
    pyResponseAsString =
      pyResponseAsString.slice(0, pyResponseAsString.length - 1)
      + pyResponseAsString.slice(pyResponseAsString.length);
    //split
    let coordinateStrings: string[] = pyResponseAsString.split(',[');
    //cut off edge [ and ] of the 1st coordinate string
    coordinateStrings[0] =
      coordinateStrings[0].slice(0, 0)
      + coordinateStrings[0].slice(1);
    coordinateStrings[0] =
      coordinateStrings[0].slice(0, coordinateStrings[0].length - 1)
      + coordinateStrings[0].slice(coordinateStrings[0].length);
    //cut off edge [ and ] of 1+th coordinate string
    for (let j = 1; j < coordinateStrings.length; j++) {
      coordinateStrings[j] =
        coordinateStrings[j].slice(0, coordinateStrings[j].length - 1)
        + coordinateStrings[j].slice(coordinateStrings[j].length);
    }
    //get list of coordinates
    let boundingBoxCoordinateList: Array<Coordinate> = new Array<Coordinate>();
    for (let cs of coordinateStrings) {
      let stringData: string[] = cs.split(',');
      let boundingBoxCoordinate: Coordinate = {
        x1: parseInt(stringData[0]),
        y1: parseInt(stringData[1]),
        x2: parseInt(stringData[2]),
        y2: parseInt(stringData[3]),
        className: stringData[4],
        detectProb: parseFloat(stringData[5]),
        classifyProb: parseFloat(stringData[6])
      };
      boundingBoxCoordinateList.push(boundingBoxCoordinate);
    }
    return boundingBoxCoordinateList;
  }

  private drawDefaultImage(): void {
    this.loadImageOnCanvasAndResizeCanvasToFitImage('assets/sherlock.png');
  }

  private uploadDefaultImage(): void {
    this.imageToProcess = new Image();
    this.imageToProcess.src = 'assets/sherlock.png';
  }

  private loadImageOnCanvasAndResizeCanvasToFitImage(imageUrl: any): void {
    let img = new Image();
    img.onload = () => {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.canvasContext.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  private getRandomColor(): string {
    let min = Math.ceil(0);
    let max = Math.floor(BoundingBoxColorCollection.length);
    let randNumber = Math.floor(Math.random() * (max - min + 1) + min);
    return BoundingBoxColorCollection[randNumber];
  }

  private fileHasProperExtension(theFile: File): boolean {
    //in case selected file has '.' in its name
    let parts = theFile.name.split('.');
    //get the file extension
    let theFileExtension = theFile.name.split('.')[parts.length - 1];
    return (theFileExtension == 'png' || theFileExtension == 'jpg');
  }

  private saveSelectedFileExtension(theFile: File): void {
    //in case selected file has '.' in its name
    let parts = theFile.name.split('.');
    this.fileExtension = theFile.name.split('.')[parts.length - 1];
  }
}
