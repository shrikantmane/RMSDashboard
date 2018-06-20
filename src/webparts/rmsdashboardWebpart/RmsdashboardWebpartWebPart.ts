import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'RmsdashboardWebpartWebPartStrings';
import RmsdashboardWebpart from './components/RmsdashboardWebpart';
import { IRmsdashboardWebpartProps } from './components/IRmsdashboardWebpartProps';
import { IRmsdashboardWebpartWebPartProps } from './IRmsdashboardWebpartWebPartProps';

export default class SenderWpWebPart extends BaseClientSideWebPart<IRmsdashboardWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRmsdashboardWebpartProps > = React.createElement(
      RmsdashboardWebpart,{
       
      }
    );

    ReactDom.render(element, this.domElement);
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
