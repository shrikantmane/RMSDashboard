import * as React from 'react';
import styles from './Sample.module.scss';
import { ISampleProps } from './ISampleProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { RxJsEventEmitter } from "../../../libraries/rxJsEventEmitter/RxJsEventEmitter";
import { EventData } from "../../../libraries/rxJsEventEmitter/EventData";
import { ISampleState } from './ISampleState';

export default class Sample extends React.Component<ISampleProps, ISampleState> {

  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();

  constructor(props: ISampleProps) {
    super(props);

    this.state = { monthValue : "" };

    // subscribe for event by event name.
    this._eventEmitter.on("myCustomEvent:start", this.receivedEvent.bind(this));
  }



  public render(): React.ReactElement<ISampleProps> {
    return (
      <div className={ styles.sample }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
              <h1>selected month value is: </h1>
              {this.state.monthValue}
            </div>
          </div>
        </div>
      </div>
    );
  }

  protected receivedEvent(data: EventData): void {
    
    // update the monthValue with the newly received data from the event subscriber.
    /*this.setState((selectedMonth: ISampleState): ISampleState => {
      selectedMonth.monthValue = data.text;
      return selectedMonth;
    });*/

    this.state = {
      monthValue : data.text
    };

    // set new state.
    this.setState((previousState: ISampleState, props: ISampleProps): ISampleState => {
      previousState.monthValue = this.state.monthValue;
      return previousState;
    });

  }
}
