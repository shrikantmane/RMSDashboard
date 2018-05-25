import * as React from 'react';
import styles from './DashboardStats.module.scss';
import { IDashboardStatsProps } from './IDashboardStatsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as Jquery from 'jquery';
import * as bootstrap from "bootstrap";


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
                    <div className="card-header" style={{fontSize: '16px', fontWeight : 'bold'}}>Openings</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>140</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-secondary mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header" style={{fontSize: '16px', fontWeight : 'bold'}}>Interviews</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>500</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-success mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header" style = {{fontSize: '16px', fontWeight : 'bold' }}>Offered</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>270</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="card text-white bg-danger mb-3" style={{maxWidth: '18rem', maxHeight: '9rem'}}>
                    <div className="card-header" style={{fontSize: '16px', fontWeight : 'bold'}}>Declined</div>
                    <div className="card-body">
                      <h5 className="card-title" style = {{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>320</h5>
                    </div>
                  </div>
                </div>
              </div>
        </div>
    );
  }
}
