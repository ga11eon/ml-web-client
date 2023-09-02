import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ServerAddressMock} from "../../ServerAddressMock";
import {BoundingBoxColorCollection} from "../../BoundingBoxColorCollection";
import {WebClientService} from "./service/web-client.service";
import {Coordinate} from "./entity/Coordinate";
import {BoundingBoxCoordinatesMock} from "../../BoundingBoxCoordinatesMock";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private canvasContext: any;
  private canvas: HTMLCanvasElement;

  imageToProcessUrl: any;
  imageToProcess:any;
  addressList: any[];
  addressForm: FormGroup = new FormGroup({
    address: new FormControl('')
  })

  constructor(private webClient: WebClientService) {
    this.addressList = ServerAddressMock;
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.drawDefaultImage();
  }

  public onFileSelect(event: any): void {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.imageToProcess = new Image();
      this.imageToProcessUrl = reader.result;
      this.loadImageOnCanvasAndResizeCanvasToFitImage(this.imageToProcessUrl);
    }
  }

  public drawBoundingBoxes(): void {
    let coordinates: Coordinate[] = this.getBoundingBoxesCoordinates(this.imageToProcess);
    for (let coordinate of coordinates) {
      let theColor = this.getRandomColor();

      this.canvasContext.beginPath();
      this.canvasContext.rect(
        coordinate.x1,
        coordinate.y1,
        coordinate.x2,
        coordinate.y2,
      );
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = theColor;

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

  //to implement..
  private getBoundingBoxesCoordinates(image: any): Coordinate[] {
    //let pyResponse = this.webClient.sendToBackend(this.imageToProcess);
    return this.extractCoordinatesFromPythonResponse('');
  }

  //to do..
  private extractCoordinatesFromPythonResponse(pyResponse: string): Coordinate[] {
    return BoundingBoxCoordinatesMock;
  }

  private drawDefaultImage(): void {
    this.loadImageOnCanvasAndResizeCanvasToFitImage('assets/sticker.png');
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
}
