import * as React from 'react';
import styles from './RmsPostionsWebpart.module.scss';
import { IRmsPostionsWebpartProps } from './IRmsPostionsWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import ReactProgressMeter from 'react-progress-meter';
import 'bootstrap/dist/css/bootstrap.min.css';
import Progress from 'react-progressbar';

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
    }]
}

export default class RmsPostionsWebpart extends React.Component<IRmsPostionsWebpartProps, IReactSpfxState> {

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
          "Positions_x0020_Closed": ""
        }
      ]
    };
    this.getBorderColor = this.getBorderColor.bind(this);
    this.getpriorityColor = this.getpriorityColor.bind(this);
    this.DifferenceInDays = this.DifferenceInDays.bind(this);
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

  getpriorityColor(Priority) {
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

  getdayscolor(status) {
    let dayColor = '#ffffff';
    if (status.includes("past")) {
      dayColor = '#0A7522';
    }
    else {
      dayColor = '#E62919';
    }
    return dayColor;
  }

  DifferenceInDays(firstDate, secondDate) {
    return Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  }

  days(noofdays) {
    if (noofdays > 0) {
      var left = Math.abs(noofdays) + ' ' + 'left';
      return left;
    }
    else {
      var past = Math.abs(noofdays) + ' ' + 'past';
      return past;
    }
  }

  public componentDidMount() {
    var reactHandler = this;
    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('RRF')/items?$select=*,Practice/Title,Priority/Title&$expand=Practice,Priority`,
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
    return (
      <table className="table " >
        <th className={styles.header} >Title
            </th>
        <th className={styles.header}  >Department
            </th>
        <th className={styles.header} >Openings
            </th>
        <th className={styles.header} >Due date
            </th>
        <th className={styles.header} >Priority
            </th>
        <th className={styles.header} > Closed
            </th>
        <th className={styles.header} ></th>
        <th className={styles.header} >Status
            </th>
        {this.state.items.map(function (item, key) {
          let displayColor, disColor, dayColor;
          let noofdays: Number;
          displayColor = compRef.getBorderColor(item.Feedback_x0020_Status);
          disColor = compRef.getpriorityColor(item.Priority.Title);
          let today;
          let date: any;
          today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var start = new Date(date);
          var end = new Date(item.Exp_x0020_Date_x0020_of_x0020_Jo);
          noofdays = compRef.DifferenceInDays(start, end);
          var status = compRef.days(noofdays);
          dayColor = compRef.getdayscolor(status);
          const boldText = {
            background: displayColor as 'displayColor',
            color: 'white' as 'white',
          }

          const italicText = {
            color: disColor as 'disColor',
            background: 'rgba(0,0,0,.075)' as 'grey'
          }
          const undertext = {
            color: dayColor as 'dayColor',
            background: 'rgba(0,0,0,.075)' as 'grey'
          }
          return (<tr className={styles.rowStyle} key={key}>
            <td className="table-active">{item.Position_x0020_Title}</td>
            <td className="table-active" >{item.Practice.Title}</td>
            <td className="table-active" >{item.No_x0020_of_x0020_Openings}</td>
            <td style={undertext} >{status}</td>
            <td style={italicText}  >{item.Priority.Title}</td>
            <td className="table-active">
              <Progress completed={item.Positions_x0020_Closed}
              />
            </td>
            <td className="table-active"  >{item.Positions_x0020_Closed.split('.')[0]}%</td>
            <td style={boldText} >{item.Feedback_x0020_Status}</td>
          </tr>);
        })}
      </table>
    );
  }
}



