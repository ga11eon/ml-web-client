import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private canvasContext: any;
  private canvas: HTMLCanvasElement;

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
  }

  drawDefaultImage(): void {
    this.loadImageOnCanvasAndResizeCanvasToFitImage('assets/cat.png');
  }

  loadImageOnCanvasAndResizeCanvasToFitImage(imageUrl: any): void {
    // Create a new Image
    let img = new Image();
    // Setting up a function with the code to run after the image is loaded
    img.onload = () => {
      // Set the canvas to the same size as the image.
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      // if scaling needed ?
      if (true) {

      }
      // Scaling
      this.canvasContext.scale(0.3, 0.3);
      // Draw the image on to the canvas.
      this.canvasContext.drawImage(img, 0, 0);
    };
    // Now that we have set up the image "onload" handler, we can assign
    // an image URL to the image.
    img.src = imageUrl;
  };
}
