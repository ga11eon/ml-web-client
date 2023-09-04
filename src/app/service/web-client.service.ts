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

  public sendToBackend(image: any, targetAddress: string) {
    let formData: FormData = new FormData();
    formData.append(
      'image',
      image /*new Blob([image.src], {type: 'image/png'})*/ //- in case Blob format is preferred
    );
    return this.http.post(
      targetAddress + this.backendUrl,
      formData,
      this.httpOptions
    ).toPromise();
  }
}
