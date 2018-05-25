import * as React from 'react';
import styles from './RmsInterviewCalenderWebpart.module.scss';
import { IRmsInterviewCalenderWebpartProps } from './IRmsInterviewCalenderWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';

//Added
import * as jquery from 'jquery';
// import * as pnp from 'sp-pnp-js';
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IReactSpfxState{  
  items:[  
        {  
          "Interviewer":{"Title":""}, 
          "Interview_x0020_Date":"", 
          "Round":{"Title":""},
          "Status":""
        }]  
        ,
    UserData :[
        {
          pictureURL :  string,
          Interviewer: string, 
          Interview_x0020_Date: string,
          Round:  string,
          Status:  string
        }
    ]
}  

export default class RmsInterviewCalenderWebpart extends React.Component<IRmsInterviewCalenderWebpartProps, IReactSpfxState> {
  public constructor(props: IRmsInterviewCalenderWebpartProps, state: IReactSpfxState){  
    super(props); 
    SPComponentLoader.loadCss("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
    this.state = {  
      items: [  
        {  
          "Interviewer":{"Title":""}, 
          "Interview_x0020_Date":"", 
          "Round":{"Title":""},
          "Status":""
        }  
      ]  ,
    UserData :[
        {
          pictureURL :  "",
          Interviewer: "",
          Interview_x0020_Date: "",
          Round:  "",
          Status:  "",
        }
    ]
  };
  }

  componentDidMount() { 
              debugger;
             this.RetrieveSPData();
          } 
  RetrieveSPData(){ 
              var reactHandler = this; 
              var spRequest = new XMLHttpRequest(); 
              spRequest.open('GET', "/sites/rms/_api/web/lists/getbytitle('Interview Details')/items?$select=*,Round/Title,Interviewer/Title&$expand=Round,Interviewer",true); 
           
                 spRequest.setRequestHeader("Accept","application/json");
                                 
              spRequest.onreadystatechange = function(){ 
                   
                  if (spRequest.readyState === 4 && spRequest.status === 200){ 
                      var result = JSON.parse(spRequest.responseText); 
                         
                      reactHandler.setState({ 
                          items: result.value
                      }); 
                        for(var i=0;i<result.value.length;i++){
                          var displayName = result.value[i].Interviewer.Title;
                          var Interview_x0020_Date = result.value[i].Interview_x0020_Date;
                          var Round = result.value[i].Round.Title;
                          var Status = result.value[i].Status;

                          reactHandler.GetUserLoginName(displayName,Interview_x0020_Date,Round,Status);
                       }
                  } 
                  else if (spRequest.readyState === 4 && spRequest.status !== 200){ 
                      console.log('Error Occurred !'); 
                  } 
              }; 
              spRequest.send(); 
              //this.GetUserProperties(); 
          }    

           GetUserLoginName(displayName,Interview_x0020_Date,Round,Status){  
    var reactHandler = this;    
    jquery.ajax({    
        url: `${this.props.siteurl}/_api/Web/SiteUsers?$select=LoginName&$filter=Title eq '`+displayName+`'` , 
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(data) {
          var UserName = data.d.results[0].LoginName;
          var UserId = UserName.split('|')[2];
         //console.log(UserName);
          reactHandler.GetUserPictureUrl(UserId,displayName,Interview_x0020_Date,Round,Status);

        },    
        error : function(data) {
            console.log('Error Occurred !');     
        }    
    });    
          }

          GetUserPictureUrl(UserId,displayName,Interview_x0020_Date,Round,Status){  
    var i = 0;
    var reactHandler = this;    
    jquery.ajax({    
      url: `${this.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='PictureURL')?@v=%27i:0%23.f|membership|`+UserId+`%27` , 
     
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(PicData) {
         //console.log(PicData);
          debugger;

reactHandler.setState(prevState => ({
            UserData : [...prevState.UserData, {  pictureURL : PicData.d.GetUserProfilePropertyFor, Interviewer : displayName, Interview_x0020_Date : Interview_x0020_Date, Round : Round , Status :Status}]
          }))
          
          // console.log(reactHandler.state.UserData);
        },    
        error : function(PicData) {
            console.log('Error Occurred !');     
        }    
    });    
          }

 public GetFormattedDate(date) {
    date = String(date).split('T');
    var newDate = String(date[0]).split('-');
    var year = String(newDate[0]).split('-');
    var month = String(newDate[1]).split('-');
    var days = String(newDate[2]).split('-');
    return [String(days + "-" + month + "-" + year)];
  }


  public render(): React.ReactElement<IRmsInterviewCalenderWebpartProps> {
    var current = this;
     return (  
<div> 
<div className="row">
<div className="col-xs-12 col-sm-offset-3 col-sm-6">
<div className="panel-heading c-list">
                      <span className="title">Interview Calender</span>
          </div>
          </div>
           </div>
        {this.state.UserData.map(function(item,key){  
          if((item.Interviewer) != "" )
          {
            let Date = current.GetFormattedDate(item.Interview_x0020_Date);
 return (

<div className="row">
        <div className="col-xs-12 col-sm-offset-3 col-sm-6">
         <div className="panel panel-default">
                     
                <ul className="list-group" id="contact-list">
                      <li className="list-group-item">
                        <div className="col-xs-12 col-sm-3">
                            <img src={item.pictureURL} alt="" className="img-responsive img-circle" width = "50%" height="50%" />
                        </div>
                        <div className="col-xs-12 col-sm-9">
                            <div className={styles.CellStyle}>{item.Interviewer}</div>  
                             <div className={styles.CellStyle}>{Date} - {item.Round} - {item.Status}</div> 
                        </div>
                        <div className="clearfix"></div>
                    </li>
                    
                </ul>
            </div>
        </div>
	</div> 
                ); 
          }
          
        })} 
</div> 
    );  
  }  
  
} 