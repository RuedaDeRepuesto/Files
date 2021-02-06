import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { File } from '../_models/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(public http:HttpClient) { }



  public async getAll(){
    return this.http.get<File[]>(`${environment.APIurl}file`).toPromise();
  }


  public post(file): Observable<any> {
    var formData: any = new FormData();

    formData.append("file", file);

    return this.http.post(`${environment.APIurl}file`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe();
  }

  public async delete(file){
    return this.http.delete<File>(`${environment.APIurl}file/${file.id}`).toPromise();
  }

  public async put(file){
    return this.http.put<File>(`${environment.APIurl}file`,file).toPromise();
  }
}
