import * as React from 'react';
import styles from './RmsProductivityWebpart.module.scss';
import { IRmsProductivityWebpartProps } from './IRmsProductivityWebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';



//Added
import * as jquery from 'jquery';
import * as bootstrap from "bootstrap";
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IReactSpfxState{  
  items:[  
        {  
          "Current_x0020_Owner":{"Title":""}, 
          "Productivity":""
        }]
        ,
    UserData :[
        {
          pictureURL :  string,
          Current_x0020_Owner:string, 
          Productivity:string
        }
    ]    
}  

export default class RmsProductivityWebpart extends React.Component<IRmsProductivityWebpartProps, IReactSpfxState> {
  public constructor(props: IRmsProductivityWebpartProps, state: IReactSpfxState){  
    super(props); 
    SPComponentLoader.loadCss("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
    this.state = {  
     items:[  
        {  
          "Current_x0020_Owner":{"Title":""}, 
          "Productivity":""
        }]  
   ,
    UserData :[
       {
          pictureURL :  null,
          Current_x0020_Owner:null,
          Productivity:null
        }
    ] 
    };  
  }

  componentDidMount() { 
             this.RetrieveSPData();
            console.log("test");
          } 
          
  RetrieveSPData(){ 
              var reactHandler = this; 
              var spRequest = new XMLHttpRequest(); 
              spRequest.open('GET', "/sites/rms/_api/web/lists/getbytitle('Owner Master')/items?$select=*,Current_x0020_Owner/Title&$expand=Current_x0020_Owner",true); 
              spRequest.setRequestHeader("Accept","application/json");
              spRequest.onreadystatechange = function(){ 
                  if (spRequest.readyState === 4 && spRequest.status === 200){ 
                      var result = JSON.parse(spRequest.responseText); 
                      reactHandler.setState({ 
                          items: result.value
                      }); 
                      for(var i=0;i<result.value.length;i++){
                          var displayName = result.value[i].Current_x0020_Owner.Title;
                          var productivity = result.value[i].Productivity;

                          reactHandler.GetUserLoginName(displayName,productivity);
                       }
                  } 
                  else if (spRequest.readyState === 4 && spRequest.status !== 200){ 
                      console.log('Error Occurred !'); 
                  } 
              }; 
              spRequest.send(); 
          }    

  GetUserLoginName(displayName,productivity){  
    var reactHandler = this;    
    jquery.ajax({    
        url: `${this.props.siteurl}/_api/Web/SiteUsers?$select=LoginName&$filter=Title eq '`+displayName+`'` , 
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(data) {
          var UserName = data.d.results[0].LoginName;
          var UserId = UserName.split('|')[2];
         //console.log(UserName);
          reactHandler.GetUserPictureUrl(UserId,displayName,productivity);

        },    
        error : function(data) {
            console.log('Error Occurred !');     
        }    
    });    
          }

  GetUserPictureUrl(UserId,displayName,productivity){  
    var i = 0;
    var reactHandler = this;    
    jquery.ajax({    
      url: `${this.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='PictureURL')?@v=%27i:0%23.f|membership|`+UserId+`%27` , 
     
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(PicData) {
             debugger;
          var img;
          if(PicData.d.GetUserProfilePropertyFor != "" )
         {     img = PicData.d.GetUserProfilePropertyFor;
    console.log("iff");    
    }
          else
              img = "https://esplrms.sharepoint.com/sites/rms/SiteAssets/default.jpg";

        console.log(img);
        console.log(PicData);
        
reactHandler.setState(prevState => ({
            UserData : [...prevState.UserData, {  pictureURL : img , Current_x0020_Owner : displayName, Productivity : productivity }]
          }))
          
        },    
        error : function(PicData) {
            console.log('Error Occurred !');     
        }    
    });    
          }

public render(): React.ReactElement<IRmsProductivityWebpartProps> {
     return (  
        <div>
            <div className="container">
                <div className="row">
                    <div className="panel panel-default user_panel">
                        <div className="panel-heading">
                            <b><h3 className="panel-title">Productivity Leaderboard</h3></b>
                        </div>

                        {this.state.UserData.map(function(item,key){  
                            if((item.Current_x0020_Owner && item.Productivity ) != null )
                            {
                                return (
                                <div className="panel-body">
                                    <div className="table-container">
                                        <table className="table-users table" style={{ Border : "0"}} >
                                            <tbody>

                                                <tr>
                                                    <td style = {{width: '10'}}>
                                                        <img className="pull-left img-circle nav-user-photo" style = {{width: '50', borderRadius : '50px'}}  src={item.pictureURL} />  
                                                    </td>
                                                    <td>
                                                      <b>  {item.Current_x0020_Owner}</b> <i className="fa fa-envelope"></i><br />
                                                        {item.Productivity}
                                                    </td>
                                                    
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                );
                            }
                        })}


                    </div>
                </div>
            </div>
        </div>
    );  
  }  
}



////////////

// public render(): React.ReactElement<IRmsProductivityWebpartProps> {
//      return (  
//         <div>
//             <div className="container">
//                 <div className="row">
//                     <div className="panel panel-default user_panel">
//                         <div className="panel-heading">
//                             <h3 className="panel-title">User List</h3>
//                         </div>

//                         <div className="panel-body">
//                             <div className="table-container">
//                                 <table className="table-users table" style={{ Border : "0"}} >
//                                     <tbody>

//                                         <tr>
//                                             <td style = {{width: '10'}}>
//                                                 <img className="pull-left img-circle nav-user-photo" style = {{width: '50', borderRadius : '50px'}}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxhcCYW4QDWMOjOuUTxOd50KcJvK-rop9qE9zRltSbVS_bO-cfWA" />  
//                                             </td>
//                                             <td>
//                                                 Herbert Hoover<i className="fa fa-envelope"></i><br />
//                                                 50%
//                                             </td>
                                            
//                                         </tr>
                                        
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

                        
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );  
//   }  