import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebClientService {
  private backendUrl: string;
  private httpOptions: {headers: HttpHeaders};

  constructor(private http: HttpClient) {
    this.backendUrl = '/predictions/garbage_cont_classify';
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'image/png'})
    }
  }

  public sendToBackend(image: any, fileExtension: string, targetAddress: string) {
    let formData: FormData = new FormData();
    formData.append(
      'image',
      //replace argument below with 'image' param, in case not Blob format is preferred
      new Blob([image.src], {type: 'image/' + fileExtension})
    );
    return this.http.post(
      targetAddress + this.backendUrl,
      formData,
      this.httpOptions
    ).toPromise();
  }
}
