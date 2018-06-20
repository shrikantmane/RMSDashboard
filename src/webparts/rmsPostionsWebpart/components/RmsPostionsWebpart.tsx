import * as React from 'react';
import styles from './RmsPostionsWebpart.module.scss';
import { IRmsPostionsWebpartProps } from './IRmsPostionsWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import ReactProgressMeter from 'react-progress-meter';
import 'bootstrap/dist/css/bootstrap.min.css';
import Progress from 'react-progressbar';

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import { canAnyMenuItemsCheck } from 'office-ui-fabric-react/lib/ContextualMenu';

import { RxJsEventEmitter } from "../../../libraries/rxJsEventEmitter/RxJsEventEmitter";
import { EventData } from "../../../libraries/rxJsEventEmitter/EventData";

<link href="path-to-react-table-filter/lib/styles.css" rel="stylesheet" />

export interface IReactSpfxState {

  items: [
    {
      "Position_x0020_Title": "",
      "Practice": { "Title": "" },
      "No_x0020_of_x0020_Openings": "",
      "Exp_x0020_Date_x0020_of_x0020_Jo": "",
      "Priority": { "Title": "" },
      "Feedback_x0020_Status": "",
      "Positions_x0020_Closed": ""

    }],
    monthValue : string;

}

export default class RmsPostionsWebpart extends React.Component<IRmsPostionsWebpartProps, IReactSpfxState> {

  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();
 

  public constructor(props: IRmsPostionsWebpartProps, state: IReactSpfxState) {
    super(props);
    this.state = {
      items: [
        {
          "Position_x0020_Title": "",
          "Practice": { "Title": "" },
          "No_x0020_of_x0020_Openings": "",
          "Exp_x0020_Date_x0020_of_x0020_Jo": "",

          "Priority": { "Title": "" },
          "Feedback_x0020_Status": "",
          "Positions_x0020_Closed": "",

        }
      ],
      monthValue: new Date().getMonth().toLocaleString()
 };
    // subscribe for event by event name.
    this._eventEmitter.on("myCustomEvent:start", this.receivedEvent.bind(this));

    this.getBorderColor = this.getBorderColor.bind(this);
    this.getPriorityColor = this.getPriorityColor.bind(this);
    this.differenceInDays = this.differenceInDays.bind(this);
    this.GetListData = this.GetListData.bind(this);

  }

  getBorderColor(Feedback_x0020_Status) {
    let displayColor = '#ffffff';
    switch (Feedback_x0020_Status) {
      case 'New':
        displayColor = '#E6B719';
        break;
      case 'Freeze':
        displayColor = '#E62919';
        break;
      case 'Updated':
        displayColor = '#0A7522';
        break;
      case 'Update Needed':
        displayColor = '#E66A19';
        break;

    }
    return displayColor;
  }

  getPriorityColor(Priority) {
    let disColor = '#ffffff';
    switch (Priority) {
      case 'High':
        disColor = '#E6B719';
        break;
      case 'Low':
        disColor = '#E62919';
        break;
      case 'Medium':
        disColor = '#0A7522';
        break;


    }
    return disColor;
  }

  getDaysColor(status) {
    let dayColor = '#ffffff';
    if (status.includes("past")) {
      dayColor = '#0A7522';
    }
    else {
      dayColor = '#E62919';
    }
    return dayColor;
  }

  differenceInDays(firstDate, secondDate) {
    return Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  }

  noOfDays(noofdays) {
    if (noofdays > 0) {
      var left = Math.abs(noofdays) + ' ' + 'left';
      return left;
    }
    else {
      var past = Math.abs(noofdays) + ' ' + 'past';
      return past;
    }
  }

  GetListData(url: string) {
    // Retrieves data from SP list  
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: Response) => {

        return response.json();

      });
  }

  public componentDidMount() {
    debugger;
    let firstDate = null;
    let enddate: any;
    let start = null;
    let end = null;

    let today, year;
    today = new Date();
    year = today.getFullYear();
    var Monthnumber = today.getMonth();
    var endDay = new Date(year, Monthnumber + 1, 0);
    console.log(Monthnumber);
    var endDate = endDay.getFullYear() + '-' + (endDay.getMonth() + 1) + '-' + endDay.getDate() + 'T00:00:00Z';
    console.log(endDate);
    var firstDay = new Date(year, Monthnumber, 1);
    firstDate = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + firstDay.getDate() + 'T00:00:00Z';
    console.log(firstDate);
    var reactHandler = this;
    jquery.ajax({

      url: `${this.props.siteurl}/_api/web/lists/getbytitle('RRF')/items?$top=${this.props.sliderproperty}&$select=*,Practice/Title,Priority/Title&$expand=Practice,Priority&$filter=%20Created%20ge%20datetime%27` + firstDate + `%27%20and%20Created%20le%20datetime%27` + endDate + `%27`,

      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandler.setState({
          items: resultData.d.results

        });

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });

  }

  public render(): React.ReactElement<IRmsPostionsWebpartProps> {
    console.log("this", this);
    let compRef = this;
    let displayColor, disColor, dayColor, status;
    let noofdays: Number;

    var someArray = this.state.items;
    for (var _i = 0; _i < someArray.length; _i++) {
      var item = someArray[_i];
      displayColor = this.getBorderColor(item.Feedback_x0020_Status);
      disColor = this.getPriorityColor(item.Priority.Title);
      console.log(disColor);
      console.log(item.Priority.Title);
    }


    const italicText = {
      color: disColor as 'disColor',
      background: 'rgba(0,0,0,.075)' as 'grey'
    }
    const undertext = {
      color: dayColor as 'dayColor',
      background: 'rgba(0,0,0,.075)' as 'grey'
    }

    const viewFields: IViewField[] = [

      {
        name: 'Position_x0020_Title',
        displayName: 'Title',
        sorting: true,
        maxWidth: 80,

      },
      {
        name: 'Practice.Title',
        displayName: 'Departments',
        sorting: true,
        maxWidth: 80
      },
      {
        name: 'No_x0020_of_x0020_Openings',
        displayName: "Openings",
        sorting: true,
        maxWidth: 80
      },
      {
        name: 'Exp_x0020_Date_x0020_of_x0020_Jo',
        displayName: "Due Date",
        sorting: true,
        maxWidth: 80,
        render: (item: any) => {
          let today;
          let date: any;
          today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var start = new Date(date);
          var end = new Date(item.Exp_x0020_Date_x0020_of_x0020_Jo);
          noofdays = compRef.differenceInDays(start, end);
          status = compRef.noOfDays(noofdays);
          dayColor = compRef.getDaysColor(status);
          const undertext = {
            color: dayColor as 'dayColor',

          }
          return <div style={undertext} >{status}</div>
        }
      },
      {
        name: 'Priority.Title',
        displayName: "Priority",
        sorting: true,
        maxWidth: 80,

      },
      {
        name: 'Positions_x0020_Closed',
        displayName: "Closed",
        sorting: true,
        maxWidth: 80,
        render: (items: any) => {
          return <div >
            <Progress completed={items.Positions_x0020_Closed}
            />
            <div >{items.Positions_x0020_Closed.split('.')[0]}%</div>
          </div>
        }
      },
      {
        name: 'Feedback_x0020_Status',
        displayName: "Status",
        sorting: true,
        maxWidth: 100,
        render: (item: any) => {

          var dispColor = this.getBorderColor(item.Feedback_x0020_Status);
          const bolText = {
            background: dispColor as 'displayColor',
            color: 'white' as 'white',
            height: '31px' as '31px',
            padding: '5px' as '5px'
          }
          return <div style={bolText}><span>&nbsp;&nbsp;</span>{item.Feedback_x0020_Status}</div>
        }
      }
    ];

    return (
      <div >
        <ListView
          items={this.state.items}
          viewFields={viewFields}
        />
      </div>
    );
  }

  protected receivedEvent(data: EventData): void {

    // update the monthValue with the newly received data from the event subscriber.
    this.state = {
      items: [
        {
          "Position_x0020_Title": "",
          "Practice": { "Title": "" },
          "No_x0020_of_x0020_Openings": "",
          "Exp_x0020_Date_x0020_of_x0020_Jo": "",

          "Priority": { "Title": "" },
          "Feedback_x0020_Status": "",
          "Positions_x0020_Closed": "",

        }
      ],
      monthValue: data.selectedMonth,
    };
    var a = this.state.monthValue;
    var Monthnumber = parseInt(a);
    let firstDate = null;
    let enddate: any;
    let start = null;
    let end = null;

    let today, year;
    today = new Date();
    year = today.getFullYear()
    var endDay = new Date(year, Monthnumber + 1, 0);
    var endDate = endDay.getFullYear() + '-' + (endDay.getMonth() + 1) + '-' + endDay.getDate() + 'T00:00:00Z';
    var firstDay = new Date(year, Monthnumber, 1);
    firstDate = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + firstDay.getDate() + 'T00:00:00Z';
    switch (this.state.monthValue) {
      case '0':
        start = firstDate;
        end = endDate;
        break;
      case '1':
        start = firstDate;
        end = endDate;
        break;
      case '2':
        start = firstDate;
        end = endDate;
        break;
      case '3':
        start = firstDate;
        end = endDate;
        break;
      case '4':
        start = firstDate;
        end = endDate;
        break;
      case '5':
        start = firstDate;
        end = endDate;
        break;
      case '6':
        start = firstDate;
        end = endDate;
        break;
      case '7':
        start = firstDate;
        end = endDate;
      case '8':
        start = firstDate;
        end = endDate;
        break;
      case '9':
        start = firstDate;
        end = endDate;
        break;
      case '10':
        start = firstDate;
        end = endDate;
        break;
      case '11':
        start = firstDate;
        end = endDate;
        break;
    }
    var reactHandler = this;
    jquery.ajax({
      // url: `${this.props.siteurl}/_api/web/lists/getbytitle('RRF')/items?$top=${this.props.sliderproperty}&$select=*,Practice/Title,Priority/Title&$expand=Practice,Priority`,
      // url: `${this.props.siteurl}/_api/web/lists/getbytitle('RRF')/items?$top=${this.props.sliderproperty}&$select=*,Practice/Title,Priority/Title&$expand=Practice,Priority&$filter= Created ge datetime'2018-05-24T00:00:00Z'`,
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('RRF')/items?$top=${this.props.sliderproperty}&$select=*,Practice/Title,Priority/Title&$expand=Practice,Priority&$filter=%20Created%20ge%20datetime%27` + start + `%27%20and%20Created%20le%20datetime%27` + end + `%27`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData", resultData);
        reactHandler.setState({
          items: resultData.d.results

        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("error");
      }
    });
    console.log("after apicall this.state.items", this.state.items);
    // set new state.
    this.setState((previousState: IReactSpfxState, props: IRmsPostionsWebpartProps): IReactSpfxState => {
      debugger;
      previousState.monthValue = this.state.monthValue;
      return previousState;
    });
  }
  
}



