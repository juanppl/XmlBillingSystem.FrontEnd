import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class XmlExportService {

  constructor() { }

  public downloadXmlFile(filename: string, object: any): void {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(object);

    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}
