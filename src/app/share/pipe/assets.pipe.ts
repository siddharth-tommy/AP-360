import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assets'
})
export class AssetsPipe implements PipeTransform {


  transform(assets: any, selectassetstype: any, selectassets: any, eventcode: any): any[] {
  


    if (!assets)
      return assets;

    if (assets === undefined && selectassets === undefined && eventcode === undefined)
      return assets;
    if (selectassets.length == 0 && eventcode.length == 0)
      return assets
    return assets.filter(function (assets) {

      if (selectassetstype.length != 0) {
        for (var j = 0; j < selectassetstype.length; j++) {
          if (selectassetstype[j] == assets.AssetTypeID) {
            if (eventcode.length != 0) {
              for (var j = 0; j < eventcode.length; j++) {
                if (eventcode[j] == 'LogOn') {
                  if (assets.LogOn == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'LogOff') {
                  if (assets.LogOff == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'MaintainanceLockout') {
                  if (assets.MaintainanceLockout == 'Y') {
                    return assets;
                  }

                }
                else if (eventcode[j] == 'BypassCode') {
                  if (assets.BypassCode == 'Y') {
                    return assets;
                  }

                }
                else if (eventcode[j] == 'ImpactAlarm') {
                  if (assets.ImpactAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'CheckListAlarm') {
                  if (assets.CheckListAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'PMDueAlarm') {
                  if (assets.PMDueAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'LowFuel') {
                  if (assets.LowFuel == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'Assetfault') {
                  if (assets.AssetFault == 'Y') {
                    return assets;
                  }
                }
              }
            }
            else {
              return assets;
            }
          }
        }
      }

      if (selectassets.length == 0) {

        if (eventcode.length != 0) {
          for (var j = 0; j < eventcode.length; j++) {
            
            if(assets.LogOn==undefined){
              for(let k=0;k<assets.length;k++){
                if (eventcode[j] == 'LogOn') {
                  if (assets[k].LogOn == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'LogOff') {
                  if (assets[k].LogOff == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'MaintainanceLockout') {
                  if (assets[k].MaintainanceLockout == 'Y') {
                    return assets[k];
                  }
    
                }
                else if (eventcode[j] == 'BypassCode') {
                  if (assets[k].BypassCode == 'Y') {
                    return assets[k];
                  }
    
                }
                else if (eventcode[j] == 'ImpactAlarm') {
                  if (assets[k].ImpactAlarm == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'CheckListAlarm') {
                  if (assets[k].CheckListAlarm == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'PMDueAlarm') {
                  if (assets[k].PMDueAlarm == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'LowFuel') {
                  if (assets[k].LowFuel == 'Y') {
                    return assets[k];
                  }
                }
                else if (eventcode[j] == 'Assetfault') {
                  if (assets[k].AssetFault == 'Y') {
                    return assets[k];
                  }
                }
              }
            }else{
              if (eventcode[j] == 'LogOn') {
                if (assets.LogOn == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'LogOff') {
                if (assets.LogOff == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'MaintainanceLockout') {
                if (assets.MaintainanceLockout == 'Y') {
                  return assets;
                }

              }
              else if (eventcode[j] == 'BypassCode') {
                if (assets.BypassCode == 'Y') {
                  return assets;
                }

              }
              else if (eventcode[j] == 'ImpactAlarm') {
                if (assets.ImpactAlarm == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'CheckListAlarm') {
                if (assets.CheckListAlarm == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'PMDueAlarm') {
                if (assets.PMDueAlarm == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'LowFuel') {
                if (assets.LowFuel == 'Y') {
                  return assets;
                }
              }
              else if (eventcode[j] == 'Assetfault') {
                if (assets.AssetFault == 'Y') {
                  return assets;
                }
              }
          }
          }
        } else {
          return assets;
        }
      }
      else {
        for (var j = 0; j < selectassets.length; j++) {
          if (selectassets[j] == assets.ID) {

            if (eventcode.length != 0) {
              for (var j = 0; j < eventcode.length; j++) {
                if (eventcode[j] == 'LogOn') {
                  if (assets.LogOn == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'LogOff') {
                  if (assets.LogOff == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'MaintainanceLockout') {
                  if (assets.MaintainanceLockout == 'Y') {
                    return assets;
                  }

                }
                else if (eventcode[j] == 'BypassCode') {
                  if (assets.BypassCode == 'Y') {
                    return assets;
                  }

                }
                else if (eventcode[j] == 'ImpactAlarm') {
                  if (assets.ImpactAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'CheckListAlarm') {
                  if (assets.CheckListAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'PMDueAlarm') {
                  if (assets.PMDueAlarm == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'LowFuel') {
                  if (assets.LowFuel == 'Y') {
                    return assets;
                  }
                }
                else if (eventcode[j] == 'Assetfault') {
                  if (assets.AssetFault == 'Y') {
                    return assets;
                  }
                }
              }
            }
            else {
              return assets;
            }

          }
        }
      }







    });





  }
}

