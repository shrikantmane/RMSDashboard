import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import * as strings from 'GanttChartWebPartStrings';
import GanttChart from './components/GanttChart';
import { IGanttChartProps } from './components/IGanttChartProps';
import pnp from "sp-pnp-js";
import * as moment from 'moment';
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as jquery from 'jquery';

export interface IGanttChartWebPartProps {
  description: string;
  listTitle: string;
  zoom: string;
}

export default class GanttChartWebPart extends BaseClientSideWebPart<IGanttChartWebPartProps> {

  public onInit(): Promise<void> {
    SPComponentLoader.loadCss('https://ateastavanger.azureedge.net/dhtmlx/codebase/dhtmlxcombo.css');

    // Init the moment JS library locale globally
    const currentLocale = this.context.pageContext.cultureInfo.currentCultureName;
    moment.locale(currentLocale);

    return super.onInit().then(_ => {

      pnp.setup({
        spfxContext: this.context
      });
      
  
    //  console.log("this.context.host - ",this.context.host);

      // pnp.sp.web.lists.filter("BaseTemplate eq 171").select("Title").get().then( lists => {
         pnp.sp.web.lists.select("Title").get().then( lists => {
        // console.dir(lists);
        this._dropdownOptions = lists.map( list => {
          return {
            key: list.Title,
            text: list.Title
          }
        });
      });

      //this.getSPLists();
    });
  }

  
           public  getSPLists(){  
              var reactHandler = this;    
              jquery.ajax({    
                  url: `https://esplrms.sharepoint.com/sites/rms/_api/web/lists?$select=Title`, 
                  type: "GET",    
                  headers:{'Accept': 'application/json; odata=verbose;'},    
                  success: function(data) {

                    // console.log("List Data -", data);

                         this._dropdownOptions = data.map( list => {
                        return {
                          key: list.Title,
                          text: list.Title
                        }
                         })

                    //return data;
                  },    
                  error : function(data) {
                      console.log('Error Occurred !');     
                  }    
              });    
          }

  public render(): void {
    const element: React.ReactElement<IGanttChartProps > = React.createElement(
      GanttChart,
      {
        description: this.properties.description,
        context: this.context,
        zoom: this.properties.zoom,
        listTitle:  this.properties.listTitle,
        siteurl : this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('listTitle', {
                  label: 'List Title',
                  options: this._dropdownOptions
                }),
                PropertyPaneDropdown('zoom', {
                  label: 'Default zoom',
                  options: this._zoomOptions,
                  selectedKey: "Days"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _zoomOptions: IPropertyPaneDropdownOption[] = [
    {
      key: "Hours",
      text: "Hours"
    },
    {
      key: "Days",
      text: "Days"
    },
    {
      key: "Months",
      text: "Months"
    }
  ];
}
