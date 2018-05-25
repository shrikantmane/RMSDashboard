import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DashboardStatsWebPartStrings';
import DashboardStats from './components/DashboardStats';
import { IDashboardStatsProps } from './components/IDashboardStatsProps';

export interface IDashboardStatsWebPartProps {
  description: string;
}

export default class DashboardStatsWebPart extends BaseClientSideWebPart<IDashboardStatsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDashboardStatsProps > = React.createElement(
      DashboardStats,
      {
        description: this.properties.description
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
