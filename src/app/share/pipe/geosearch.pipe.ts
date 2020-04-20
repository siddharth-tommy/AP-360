import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'geosearch'
})
export class GeosearchPipe implements PipeTransform {

  transform(JsonObject: any[], terms: any): any[] {
    if (!JsonObject)
        return JsonObject;
    if (terms === undefined)
        return JsonObject;
    return JsonObject.filter(function (JsonObject) {
        if (JsonObject.name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
            return JsonObject;
        }
        else if (JsonObject.GeoFences!=undefined && JsonObject.GeoFences.length > 0) {
            for (var i = 0; i < JsonObject.GeoFences.length; i++) {
                if (JsonObject.GeoFences[i].name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
                    return JsonObject;
                }
            }

        }

        else {
            // code...
            return '';
        }




    });

}

}
