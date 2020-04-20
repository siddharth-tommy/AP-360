import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operators'
})
export class OperatorsPipe implements PipeTransform {


  transform(operators: any, selectedoperator: any, eventcode: any): any[] {
    if (!operators)
      return operators;

    if (selectedoperator === undefined && eventcode === undefined)
      return operators;

    if (selectedoperator.length == 0 && eventcode.length == 0)
      return operators;

    return operators.filter(function (operators) {


      if (selectedoperator.length == 0) {

        if (eventcode.length != 0) {
          for (var j = 0; j < eventcode.length; j++) {
            if (eventcode[j] == 'LogOn') {
              if (operators.LogOn == 'Y') {
                return operators;
              }
            }
            else if (eventcode[j] == 'LogOff') {
              if (operators.LogOff == 'Y') {
                return operators;
              }

            }
            else if (eventcode[j] == 'MaintainanceLockout') {
              if (operators.MaintainanceLockout == 'Y') {
                return operators;
              }

            }
            else if (eventcode[j] == 'BypassCode') {
              if (operators.BypassCode == 'Y') {
                return operators;
              }

            }
            else if (eventcode[j] == 'ImpactAlarm') {
              if (operators.ImpactAlarm == 'Y') {
                return operators;
              }
            }
            else if (eventcode[j] == 'CheckListAlarm') {
              if (operators.CheckListAlarm == 'Y') {
                return operators;
              }
            }
            else if (eventcode[j] == 'PMDueAlarm') {
              if (operators.PMDueAlarm == 'Y') {
                return operators;
              }
            }
            else if (eventcode[j] == 'LowFuel') {
              if (operators.LowFuel == 'Y') {
                return operators;
              }
            }
            else if (eventcode[j] == 'Assetfault') {
              if (operators.AssetFault == 'Y') {
                return operators;
              }
            }
          }
        }
        else {
          return operators;
        }


      }
      else {
        for (var i = 0; i < selectedoperator.length; i++) {
          if (selectedoperator[i] == operators.ID) {
            if (eventcode.length != 0) {
              for (var j = 0; j < eventcode.length; j++) {
                if (eventcode[j] == 'LogOn') {
                  if (operators.LogOn == 'Y') {
                    return operators;
                  }
                }
                else if (eventcode[j] == 'LogOff') {
                  if (operators.LogOff == 'Y') {
                    return operators;
                  }

                }
                else if (eventcode[j] == 'MaintainanceLockout') {
                  if (operators.MaintainanceLockout == 'Y') {
                    return operators;
                  }

                }
                else if (eventcode[j] == 'BypassCode') {
                  if (operators.BypassCode == 'Y') {
                    return operators;
                  }

                }
                else if (eventcode[j] == 'ImpactAlarm') {
                  if (operators.ImpactAlarm == 'Y') {
                    return operators;
                  }
                }
                else if (eventcode[j] == 'CheckListAlarm') {
                  if (operators.CheckListAlarm == 'Y') {
                    return operators;
                  }
                }
                else if (eventcode[j] == 'PMDueAlarm') {
                  if (operators.PMDueAlarm == 'Y') {
                    return operators;
                  }
                }
                else if (eventcode[j] == 'LowFuel') {
                  if (operators.LowFuel == 'Y') {
                    return operators;
                  }
                }
                else if (eventcode[j] == 'Assetfault') {
                  if (operators.AssetFault == 'Y') {
                    return operators;
                  }
                }
              }
            }
            else
            {
              return operators;
            }
              
            }
          }
        }
      });





  }

}
