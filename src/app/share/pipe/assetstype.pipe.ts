import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetstype'
})
export class AssetstypePipe implements PipeTransform {

  transform(assets: any, selectassetstype: any, selectassets: any, eventcode: any): any[] {  

    if (!assets)
      return assets;

    if (selectassetstype === undefined && selectassets === undefined && eventcode === undefined)
      return assets;
    if (selectassetstype.length == 0 && selectassets.length == 0)
      return assets


    return assets.filter(function (assets) {
      for (var i = 0; i < selectassetstype.length; i++) {
        if (selectassetstype[i] == assets.ID) {
          return assets;
        }
      }
      if (assets.assets.length > 0) {
        for (var i = 0; i < assets.assets.length; i++) {
          for (var j = 0; j < selectassets.length; j++) {
            if (selectassets[j] == assets.assets[i].ID) {
              return assets;
            }
          }

          // for (var i = 0; i < assets.assets.length; i++) {
          //   for (var j = 0; j < eventcode.length; j++) {
          //     if (eventcode[j] == 'LogOn') {
          //       if (assets.assets[i].LogOn == 'Y') {
          //         return assets;
          //       }
          //     }
          //     else if (eventcode[j] == 'LogOff') {
          //       if (assets.assets[i].LogOff == 'Y') {
          //         return assets;
          //       }

          //     }
          //     else if (eventcode[j] == 'MaintainanceLockout') {
          //       if (assets.assets[i].MaintainanceLockout == 'Y') {
          //         return assets;
          //       }

          //     }
          //     else if (eventcode[j] == 'BypassCode') {
          //       if (assets.assets[i].BypassCode == 'Y') {
          //         return assets;
          //       }

          //     }
          //     else if (eventcode[j] == 'ImpactAlarm') {
          //       if (assets.assets[i].ImpactAlarm == 'Y') {
          //         return assets;
          //       }
          //     }
          //     else if (eventcode[j] == 'CheckListAlarm') {
          //       if (assets.assets[i].CheckListAlarm == 'Y') {
          //         return assets;
          //       }
          //     }
          //     else if (eventcode[j] == 'PMDueAlarm') {
          //       if (assets.assets[i].PMDueAlarm == 'Y') {
          //         return assets;
          //       }
          //     }
          //     else if (eventcode[j] == 'LowFuel') {
          //       if (assets.assets[i].LowFuel == 'Y') {
          //         return assets;
          //       }
          //     }
          //     else if (eventcode[j] == 'Assetfault') {
          //       if (assets.assets[i].AssetFault == 'Y') {
          //         return assets;
          //       }
          //     }
          //   }
          // }
        }
      }
      else {
        return '';
      }
    });
  }

}
