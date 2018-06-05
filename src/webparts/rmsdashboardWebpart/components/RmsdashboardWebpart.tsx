import * as React from 'react';
import styles from './RmsdashboardWebpart.module.scss';
import { IRmsdashboardWebpartProps } from './IRmsdashboardWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Button } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IRmsdashboardWebpartState } from './IRmsdashboardWebpartState';

import { RxJsEventEmitter } from '../../../libraries/rxJsEventEmitter/RxJsEventEmitter';
import { EventData } from '../../../libraries/rxJsEventEmitter/EventData';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption} from 'office-ui-fabric-react/lib/Dropdown';

export default class SenderWp extends React.Component<IRmsdashboardWebpartProps, IRmsdashboardWebpartState> {

  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();
  
  constructor(props: IRmsdashboardWebpartProps) {
    super(props);

    this.state = 
        { 
          selectedMonthName: new Date().getMonth().toLocaleString()
        }   
    
    this.senderData();  
  }

  public render(): React.ReactElement<IRmsdashboardWebpartProps> {
   
    return (
        <div className="ms-Grid">
        <div className="ms-Grid-row" style={{"border": "1px solid","padding": "5px 5px 5px 5px","border-color": "darkgrey"}}>
        <span style={{"float": "left","font-size": "15pt"}}>Recruiting Dashboard</span>
        <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2" style={{"float": "right"}} >
              <Dropdown
                    onChanged={ this.changeState }
                    placeHolder='Select an Option'
                    defaultSelectedKey= {new Date().getMonth().toLocaleString()}
                    options={ [
                        { key: '0', text: 'Jan' },
                        { key: '1', text: 'Feb' },
                        { key: '2', text: 'Mar' },
                        { key: '3', text: 'Apr' },
                        { key: '4', text: 'May' },
                        { key: '5', text: 'Jun' },
                        { key: '6', text: 'Jul' },
                        { key: '7', text: 'Aug' },
                        { key: '8', text: 'Sept' },
                        { key: '9', text: 'Oct' },
                        { key: '10', text: 'Nov' },
                        { key: '11', text: 'Dec' }
                      ] } />
        </div>
        </div>
        </div>
    );
  }

  /**
   * Data to all receivers.
   */
  protected senderData(): void {
        this._eventEmitter.emit("myCustomEvent:start", { selectedMonth: this.state.selectedMonthName } as EventData);
      }

  public changeState = (item: IDropdownOption): void =>{
      console.log('here is the things updating...' + item.key + ' ' + item.text + ' ' + item.selected);
      console.log('current month is: ' + new Date().getMonth());
        this.state = {
          selectedMonthName : item.key.toString()
        }
        this.senderData();
    }
  
}
