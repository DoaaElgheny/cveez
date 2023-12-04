import { Injectable, Inject } from '@angular/core';
import { WebApiService } from '../webApi.service';
@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private webApi: WebApiService) {}

  //
  preperImageAsBinary(file:any) {
    let Data = file;
    Data = Data.replace('data:application/pdf;base64,', '');
    Data = Data.replace('data:image/jpeg;base64,', '');
    Data = Data.replace('data:image/jpg;base64,', '');
    Data = Data.replace('data:image/png;base64,', '');
    Data = Data.replace('data:application/octet-stream;base64,', '');
    Data = Data.replace('data:application/xml;base64,', '');
    Data = Data.replace(
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
      ''
    );
    Data = Data.replace('data:image/svg+xml;base64,', '');
    Data = Data.replace('data:video/mp4;base64,', '');
    Data = Data.replace('data:video/mp3;base64,', '');

    return Data;
  }
  UploadMyFile(Data:any, name:any) {
    let file = this.preperImageAsBinary(Data);
    console.log(file);
    
    return this.webApi.post('api/app/upload/upload-cveez-file',{fileContent: file,
    fileName: name});
  }
}
