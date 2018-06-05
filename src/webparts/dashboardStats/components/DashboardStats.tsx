import * as React from 'react';
import styles from './DashboardStats.module.scss';
import { IDashboardStatsProps } from './IDashboardStatsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as Jquery from 'jquery';
import * as bootstrap from "bootstrap";
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';


export default class DashboardStats extends React.Component<IDashboardStatsProps, {}> {
  public constructor() {
    super();
    SPComponentLoader.loadCss("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
  }

  public render(): React.ReactElement<IDashboardStatsProps> {
    return (
      <div className="container">
          <div className="row">
                <div className="col-sm-3">
                  <div className="card text-white bg-primary mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}} >
                    <div className="card-header text-center" style={{fontSize: '16px', fontWeight : 'bold'}}>Openings</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>150</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-secondary mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header text-center" style={{fontSize: '16px', fontWeight : 'bold'}}>Interviews</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>40</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-success mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header text-center" style = {{fontSize: '16px', fontWeight : 'bold' }}>Offered</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>100</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-danger mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header text-center" style={{fontSize: '16px', fontWeight : 'bold'}}>Declined</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>50</h5>
                    </div>
                  </div>
                </div>
              </div>
        </div>
    );
  }

  public getCount(type: string){
    var countValue: any;
    switch (type) {
      case 'Openings':
        countValue = 0;
        return countValue;
      case 'Interviews':
        countValue = 0;
        return countValue;
      case 'Offered':
        countValue = this._getListItemCount(this.props.siteContext.pageContext.web.absoluteUrl,'Candidate Master','Candidate_x0020_Status/Status','lookup','Offered');
        return countValue;
      case 'Declined':
        countValue = 0;
        return countValue;
      default:
        countValue = 0;
        return countValue;
    }
  }

  private _getListItemCount(listsite: string,listName: string,fieldName : string,fieldType:string, fieldValue :string): Promise<any> {
    if(fieldType == 'lookup')
    {
      if(fieldName.indexOf('/') > -1)
      {
        var listField = fieldName.toString().split('/')[0];
        //var lookupField = fieldName.toString().split('/')[1];
      }
      console.log('context from ts: ' + this.props.siteContext);
      console.log('listsite URL is :' + listsite);
      return this.props.siteContext.spHttpClient.get(listsite + `/_api/web/lists/GetByTitle('${listName}')/Items?$filter=${fieldName}%20eq%20%27${fieldValue}%27&$select=${fieldName}&$expand=${listField}`, SPHttpClient.configurations.v1)
      .then((response: Array<any>) => {
        return response.length;
      });

      //return 111;
    }

    //uncomment this if need to take count for Openings and Interviews
    /*
    return this.context.spHttpClient.get(listsite + `/_api/web/lists/GetByTitle('${listName}')/Items?$filter=Candidate_x0020_Status/Status%20eq%20%27Offered%27&$select=Candidate_x0020_Status/Status&$expand=Candidate_x0020_Status`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
   */

  }


}
