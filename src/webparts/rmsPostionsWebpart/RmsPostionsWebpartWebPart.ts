import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'RmsPostionsWebpartWebPartStrings';
import RmsPostionsWebpart from './components/RmsPostionsWebpart';
import { IRmsPostionsWebpartProps } from './components/IRmsPostionsWebpartProps';

export interface IRmsPostionsWebpartWebPartProps {
  description: string;
}

export default class RmsPostionsWebpartWebPart extends BaseClientSideWebPart<IRmsPostionsWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRmsPostionsWebpartProps> = React.createElement(
      RmsPostionsWebpart,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl
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
