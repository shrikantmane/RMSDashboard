import * as React from 'react';
//require("./components/custom.css");
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneButton
} from '@microsoft/sp-webpart-base';
import * as strings from 'RmsApplicationSourcesChartWebPartStrings';
import RmsApplicationSourcesChart from './components/RmsApplicationSourcesChart';
import { IRmsApplicationSourcesChartProps } from './IRmsApplicationSourcesChartWebPartProps';
import { MChart } from './IRmsApplicationSourcesChartWebPartProps';
import { IRmsApplicationSourcesChartWebPartProps } from './IRmsApplicationSourcesChartWebPartProps';
import { ChartConfiguration } from './IRmsApplicationSourcesChartWebPartProps';
import ChartOptions from './ChartOptions';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class RmsApplicationSourcesChartWebPart extends BaseClientSideWebPart<IRmsApplicationSourcesChartWebPartProps> {

  private reactCharts: React.ReactElement<IRmsApplicationSourcesChartProps>;

  // Columns Enable / Disable
  private colsDisabled: boolean = true;
  private listDisabled: boolean = true;
  private urlTextDisabled: boolean = true;

  //Property Dropdown Options
  private _chartThemeOptions: IPropertyPaneDropdownOption[] = [];
  private _siteOptions: IPropertyPaneDropdownOption[] = [];
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _columnOptions: IPropertyPaneDropdownOption[] = [];
  private _ListColumnOptions: Array<IPropertyPaneDropdownOption> = [];
  private _chartSizeOptions: IPropertyPaneDropdownOption[] = [
    {key: 3, text:'Small'},
    {key: 6, text:'Medium'},
    {key: 9, text: 'Medium-Large'},
    {key: 12, text: 'Large'}
  ];
  private _chartTypeOptions: IPropertyPaneDropdownOption[] = [
    {key: 'bar', text:'Bar'},
    {key: 'horizontalbar', text:'Horizontal Bar'},
    {key: 'doughnut', text: 'Doughnut'},
    {key: 'line', text: 'Line'},
    {key: 'pie', text: 'Pie'},
    {key: 'polar', text:'Polar'},
    {key: 'radar', text:'Radar'}
  ];
  private _chartColActions: IPropertyPaneDropdownOption[] = [
    {key: 'average', text: 'Average'},
    {key: 'count', text: 'Count'},
    {key: 'sum', text: 'Sum'}
  ];

  public constructor(context: IWebPartContext) {
    super();
  }
  private ChartThemes: ChartOptions;

  private defaultOptions: Object = {
      legend: {
          display: false,
          layout: {
              padding: 10
          },
          position: 'bottom',
          labels: {
              fontColor: 'rgba(100, 100, 100, 1.0)'
          }
      }
  };

  public defaultChartConfig(chartDesc: string): ChartConfiguration {
    var defConfig = {
      title: 'Chart Title',
      description: chartDesc,
      type: 'doughnut',
      list: null,
      dataurl: this.context.pageContext.web.absoluteUrl,
      url: this.context.pageContext.web.absoluteUrl,
      other: true,
      dataUrlDisabled: true,
      colsDisabled: true,
      listsDisabled: false,
      col1: '',
      col2: '',
      act: '',
      unique: '',
      size: 12,
      options: ChartOptions.Options(),
      columns: [],
      lists: this.properties.listOptions,
      theme: "Random",
      bgColors: ChartOptions.RandomColors()['bgColors'],
      hoverColors: ChartOptions.RandomColors()['bgColors']
    };

    return defConfig;
  }

  public render(): void {
    //Initialize first demo chart
    if (!this.properties.state){
        this.properties.state = true;
        this.properties.firstLoad = true;
        this.properties.numCharts = 1;
        this.properties.chartConfig = [];
        const firstChartConfig = this.defaultChartConfig;
        this.properties.chartConfig.push(this.defaultChartConfig('Demo Chart, Edit Web Part to Customize'));
    }
    this.getChartData();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private getChartData(): void{
    const _chartData: Array<MChart> = [];
    var _count = 0;
    this.properties.chartConfig.forEach((cfg,i) => {
      if (cfg.list != null){
      this.getData(cfg).then((response) => {
        const chart = this.calculateData(response.value, cfg);
        const _chart: MChart = {data:chart['data'],labels:chart['labels'],config:cfg,key: i};
        _chartData[i] = _chart;
        if (++_count == this.properties.chartConfig.length){ this.getCharts(_chartData); }
      });
    } else {
        const _chart: MChart = {data:ChartOptions._sampleData,labels:ChartOptions._sampleCols,config:cfg,key: i};
        _chartData[i] = _chart;
        if (++_count == this.properties.chartConfig.length){ this.getCharts(_chartData); }
      }
    });
  }

  private getCharts(charts: Array<MChart>): void{
    const chartArea: React.ReactElement<IRmsApplicationSourcesChartProps> = React.createElement(RmsApplicationSourcesChart,{
        description: this.properties.description,
        title: this.properties.description,
        state: this.properties.state,
        config: {},
        context: this.context,
        data: {},
        charts: charts
    });
    ReactDom.render(chartArea,this.domElement);
  }

  private calculateData(data: Array<Object>,config:ChartConfiguration): Object {
    var values: Array<number> = [];
    var labels: Object = this.getUnique(data, config);
    var dataVal: Array<Array<any>> = this.getValues(data,labels['unique'],config);

    switch(config.act) {
      case 'sum':
        dataVal.forEach((vals,i) => {
          values[i] = 0;
          vals.forEach((val) => {
            values[i]+=parseFloat(val);
          });
        });
        break;
      case 'average':
      /*dataVal.forEach((vals,i) => {
        values[i] = 0;
        vals.forEach((val) => {
          values[i]+=parseFloat(val);
        });
        if (values[i] != 0) {
          values[i] = values[i] / vals.length;
        }
      });*/
      let dataLength = data.length;
      dataVal.forEach((vals,i) => {
        values[i] = 0;
        vals.forEach((val) => {
          values[i]+=parseFloat(val);
        });
        if (values[i] != 0) {
          values[i] = (vals.length / dataLength) * 100;
        }
      });

        break;
      case 'count':
        dataVal.forEach((vals) => {
          values.push(vals.length);
        });
        break;
      default:
        values = [100,250,90,300];
        break;
    }
    return { data:values, labels:labels['labels'] };
  }

  private getUnique(data: Array<Object>,config:ChartConfiguration): Object {
    const chLabels: Object = { unique:[], labels:[] };
      data.forEach((item) => {
        //bharati
        if(config.unique.indexOf('/') == -1 && config.col1.indexOf('/') == -1){         
          if (chLabels['unique'].indexOf(item[config.unique]) == -1 && item[config.unique] != null && item[config.unique] != ""){
            chLabels['unique'].push(item[config.unique]);
            chLabels['labels'].push(item[config.col1]);
          }
        }
        else if(config.unique.indexOf('/') > -1 && config.col1.indexOf('/') > -1){
          let uniqueLabel = config.unique.toString().split('/')[0];
          let uniqueLabelLookupField = config.unique.toString().split('/')[1];
          let col1Label = config.col1.toString().split('/')[0];
          let col1LabelLookupField = config.col1.toString().split('/')[1];
          //if (chLabels['unique'].indexOf(item[uniqueLabel]) == -1 && item[uniqueLabel] != null && item[uniqueLabel] != ""){
          if (chLabels['unique'].indexOf(item[uniqueLabel][uniqueLabelLookupField]) == -1 && item[uniqueLabel][uniqueLabelLookupField] != null && item[uniqueLabel][uniqueLabelLookupField] != ""){
            chLabels['unique'].push(item[uniqueLabel][uniqueLabelLookupField]);
            chLabels['labels'].push(item[col1Label][col1LabelLookupField]);
          }
        }
        //next conditions
        else if(config.unique.indexOf('/') > -1 && config.col1.indexOf('/') == -1){
          let uniqueLabel = config.unique.toString().split('/')[0];
          let uniqueLabelLookupField = config.unique.toString().split('/')[1];
          if (chLabels['unique'].indexOf(item[uniqueLabel][uniqueLabelLookupField]) == -1 && item[uniqueLabel][uniqueLabelLookupField] != null && item[uniqueLabel][uniqueLabelLookupField] != ""){
            chLabels['unique'].push(item[uniqueLabel][uniqueLabelLookupField]);
            chLabels['labels'].push(item[config.col1]);
          }
        }
        else if(config.unique.indexOf('/') == -1 && config.col1.indexOf('/') > -1){
          let col1Label = config.col1.toString().split('/')[0];
          let col1LabelLookupField = config.col1.toString().split('/')[1];
          if (chLabels['unique'].indexOf(item[config.unique]) == -1 && item[config.unique] != null && item[config.unique] != ""){
            chLabels['unique'].push(item[config.unique]);
            chLabels['labels'].push(item[col1Label][col1LabelLookupField]);
          }
        }

        
      });
    return chLabels;
  }

  private getValues(data: Array<Object>,unique: Array<string>, config: ChartConfiguration): Array<Array<any>>{

    const values: Object = {};
    const vals: Array<Array<any>> = [[]];
    unique.forEach((col,i) => {
      values[col] = [];
      vals[i] = [];
      data.forEach((item, _i) => {
        //bharati
        if(config['col2'].indexOf('/') > -1 &&  config.unique.indexOf('/') > -1){
          var uniqueField = config.unique.toString().split('/')[0];
          var uniqueFieldLookup = config.unique.toString().split('/')[1];
          if (item[uniqueField][uniqueFieldLookup] == col){
            var dataField = config['col2'].toString().split('/')[0];
            var dataFieldLookup = config['col2'].toString().split('/')[1];
            vals[i].push(item[dataField][dataFieldLookup]);
          }
        }
        else if(config['col2'].indexOf('/') == -1 &&  config.unique.indexOf('/') == -1){
          if (item[config.unique] == col)
            vals[i].push(item[config.col2]);
        }
        //next conditions
        else if(config['col2'].indexOf('/') > -1 &&  config.unique.indexOf('/') == -1){
          if (item[config.unique] == col)
            {
              var dataField = config['col2'].toString().split('/')[0];
              var dataFieldLookup = config['col2'].toString().split('/')[1];
              vals[i].push(item[dataField][dataFieldLookup]);
            }
        }
        else if(config['col2'].indexOf('/') == -1 &&  config.unique.indexOf('/') > -1){
          var uniqueField = config.unique.toString().split('/')[0];
          var uniqueFieldLookup = config.unique.toString().split('/')[1];
          if (item[uniqueField][uniqueFieldLookup] == col) {
            vals[i].push(item[config.col2]);
          }
            
        }


        /*if (item[config.unique] == col){
          //vals[i].push(item[config.col2]);
          //bharati
          if(config['col2'].indexOf('/') > -1 ){
            var lookupField = config['col2'].toString().split('/')[1];
            vals[i].push(item[lookupField]);
            console.log('lookup field value :' + vals[i].push(item[lookupField]));
          }
          else{
            vals[i].push(item[config.col2]);
            console.log('normal field value :' + vals[i].push(item[lookupField]));
          }
        }*/

      });
    });
    return vals;
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    var pPath = propertyPath;
    var pPathInd = propertyPath[12];

    if (pPath === 'numCharts' && oldValue != newValue) {
      if (this.properties.chartConfig.length < newValue){
        while (this.properties.chartConfig.length < newValue) {
          this.properties.chartConfig.push(this.defaultChartConfig('Chart Description'));
        }
      } else if (this.properties.chartConfig.length > newValue) {
          while (newValue < this.properties.chartConfig.length) {
            this.properties.chartConfig.pop();
          }
        }
    }

    if (propertyPath.indexOf('[') != -1) {
      pPath = propertyPath.substring(16).replace('\"]','');
    }
    if (pPath === 'url' && newValue == 'other' && (oldValue != newValue)){
      this.urlTextDisabled = false;
      this.properties.chartConfig[pPathInd].dataUrlDisabled = false;
      this.properties.chartConfig[pPathInd].dataurl = oldValue;
    }
    if (pPath === 'url' && newValue != 'other' && (oldValue != newValue)){
      this.properties.chartConfig[pPathInd].dataurl = newValue;
      this.properties.chartConfig[pPathInd].dataUrlDisabled = true;
    }
    if ( (pPath === 'url' && (newValue != oldValue)) || (pPath === 'dataurl' && (newValue != oldValue)) ){
      this._updateListTitles(newValue,this.properties.chartConfig[pPathInd]);
      this.properties.chartConfig[pPathInd]['other'] = true;
      this.properties.state = true;
    }
    if (pPath === 'list' && (newValue != oldValue)){
      var siteUrl = this.properties.chartConfig[pPathInd]['dataurl'];
      this._updateListColumns(siteUrl,newValue,this.properties.chartConfig[pPathInd]);
      this.properties.chartConfig[pPathInd].colsDisabled = false;
    }
    if (pPath === 'theme' && (newValue != oldValue)){
      const newTheme = ChartOptions.RandomColors();
      this.properties.chartConfig[pPathInd].bgColors = newTheme['bgColors'];
      this.properties.chartConfig[pPathInd].hoverColors = newTheme['hoverColors'];
    }
    this.context.propertyPane.refresh();
    this.render();
  }

  protected onPropertyPaneConfigurationStart(): void {

      if (this.properties.firstLoad || this.properties.chartConfig[0].columns.length <= 0 || this.properties.chartConfig[0].list.length <= 0){
        this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'First Time Configuration');

        this.properties.firstLoad = false;
        this._getSiteRootWeb()
          .then((response0) => {
          this._getSites(response0['Url'])
            .then((response) => {
              var sites: IPropertyPaneDropdownOption[] = [];
              sites.push({key:this.context.pageContext.web.absoluteUrl, text:'This Site'});
              sites.push({key:'other', text:'Other Site (Specify Url)'});
              for (var _key in response.value) {
                  if (this.context.pageContext.web.absoluteUrl != response.value[_key]['Url']){
                    sites.push({key: response.value[_key]['Url'], text: response.value[_key]['Title']});
                  }
            }
            this._siteOptions = sites;
            this.properties.siteOptions = sites;

          this._getListTitles(this.properties.chartConfig[0].dataurl)
            .then((response2) => {
              this.properties.listOptions = response2.value.map((list: ISPList) => {
                return {
                  key: list.Title,
                  text: list.Title
                };
              });
              this.properties.chartConfig[0].lists = this.properties.listOptions;
              this._getListColumns(this.properties.chartConfig[0].list,this.properties.chartConfig[0].url)
              .then((response3) => {
                var col: IPropertyPaneDropdownOption[] = [];
                for (var __key in response3.value) {
                    //col.push({key: response3.value[__key]['InternalName'], text: response3.value[__key]['Title']});
                    //bharati
                    if(response.value[_key]['TypeDisplayName'] as string == "Lookup"){
                      //debugger;
                      var lookupWishShowField = response.value[_key]['InternalName'] +'/' + response.value[_key]['LookupField'];
                      col.push({key: lookupWishShowField , text: lookupWishShowField});
                    }
                    else
                      col.push({key: response.value[_key]['InternalName'], text: response.value[_key]['Title']});
                  }
                this._columnOptions = col;
                this.colsDisabled = false;
                this.listDisabled = false;
                this.context.propertyPane.refresh();
                this.context.statusRenderer.clearLoadingIndicator(this.domElement);
                this.render();
              });
            });
          });
        });
      }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let columnPropertyOptions: any;

      columnPropertyOptions = [
        {
        groupName: 'General Options',
        groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Web Part Title'
                }),
                PropertyPaneSlider('numCharts', {
                  label: 'Number of Charts',
                  min: 1,
                  max: 10
                }),
                PropertyPaneSlider('maxResults', {
                  label: 'Max # of list items',
                  min: 1,
                  max: 1000
                })
          ]
        }
      ];

      for (var _i = 0; _i < this.properties.numCharts; _i++) {
        columnPropertyOptions.push(
          {
            groupName: "Chart " + (_i + 1) + " Configuration",
            groupFields:[
                PropertyPaneTextField('chartConfig[' + _i + ']["title"]', {
                  label: "Chart Title"
                }),
                PropertyPaneTextField('chartConfig[' + _i + ']["description"]', {
                  label: "Description "
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["type"]', {
                  label: 'Chart Type',
                  options: this._chartTypeOptions
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["size"]', {
                  label: 'Chart Size',
                  options: this._chartSizeOptions,
                }),
                PropertyPaneButton('chartConfig[' + _i + ']["theme"]', {
                  buttonType: 0,
                  text: 'Generate Theme',
                  icon: 'Color',
                  onClick: ((val) => {
                    return new Date().valueOf();
                    })
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["url"]', {
                  label: 'Chart Data Source',
                  options: this.properties.siteOptions
                }),
                PropertyPaneTextField('chartConfig[' + _i + ']["dataurl"]', {
                  label: 'Chart Site Url (i.e. https://contoso.sharepoint.com/path)',
                  disabled: this.properties.chartConfig[_i].dataUrlDisabled
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["list"]', {
                  label: 'List Data Source',
                  options: this.properties.chartConfig[_i].lists,
                  disabled: this.properties.chartConfig[_i].listsDisabled
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["col1"]', {
                  label: 'Label Column',
                  options: this.properties.chartConfig[_i].columns,
                  disabled: this.properties.chartConfig[_i].colsDisabled
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["col2"]', {
                  label: 'Data Column',
                  options: this.properties.chartConfig[_i].columns,
                  disabled: this.properties.chartConfig[_i].colsDisabled
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["unique"]', {
                  label: 'Unique Identifier',
                  options: this.properties.chartConfig[_i].columns,
                  disabled: this.properties.chartConfig[_i].colsDisabled
                }),
                PropertyPaneDropdown('chartConfig[' + _i + ']["act"]', {
                  label: 'Operation',
                  options: this._chartColActions,
                  disabled: this.properties.chartConfig[_i].colsDisabled
                })
            ]
          });
      }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: columnPropertyOptions
        }
      ]
    };
  }

  protected onPropertyPaneConfigurationComplete(){
    this.render();
  }

  private _getSiteRootWeb(): Promise<string[]> {

    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/Site/RootWeb?$select=Title,Url`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _getSites(rootWebUrl: string): Promise<ISPLists> {
    return this.context.spHttpClient.get(rootWebUrl + `/_api/web/webs?$select=Title,Url`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _getListTitles(site: string): Promise<ISPLists> {
    return this.context.spHttpClient.get(site + `/_api/web/lists?$filter=Hidden eq false and BaseType eq 0`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _getListColumns(listName: string,listsite: string): Promise<any> {
    return this.context.spHttpClient.get(listsite + `/_api/web/lists/GetByTitle('${listName}')/Fields?$filter=Hidden eq false and ReadOnlyField eq false and TypeAsString ne 'User'`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  public getData(chartConfig: Object){
    //bharati
    if(chartConfig['col2'].indexOf('/') > -1 ){
      var selectString = chartConfig['col2'] as string;
      var expandString = chartConfig['col2'].toString().split('/')[0] ;
      console.log('REST API formed :' + chartConfig['dataurl'] + `/_api/web/lists/GetByTitle(\'${chartConfig['list']}\')/items?$orderby=Id desc&$limit=10&$top=${this.properties.maxResults}&$select=${chartConfig['col2']}&$expand=${chartConfig['col2'].toString().split('/')[0]}`);

      return this.context.spHttpClient.get(chartConfig['dataurl'] + `/_api/web/lists/GetByTitle(\'${chartConfig['list']}\')/items?$orderby=Id desc&$limit=10&$top=${this.properties.maxResults}&$select=${chartConfig['col2']}&$expand=${chartConfig['col2'].toString().split('/')[0]}`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
    }

    return this.context.spHttpClient.get(chartConfig['dataurl'] + `/_api/web/lists/GetByTitle(\'${chartConfig['list']}\')/items?$orderby=Id desc&$limit=10&$top=${this.properties.maxResults}`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _updateListTitles(siteUrl: string,_chartConfig: ChartConfiguration): void {
      this._getListTitles(siteUrl).then((response) => {
              var respLists: IPropertyPaneDropdownOption[] = [];
              for (var _key in response.value) {
                    respLists.push({key: response.value[_key]['Title'], text: response.value[_key]['Title']});
            }
            this._dropdownOptions = respLists;
            _chartConfig.lists = respLists;
            this.context.propertyPane.refresh();
      }).catch((err) => {
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.context.statusRenderer.renderError(this.domElement,"There was an error loading your list, please verify the selected list has Calendar Events or choose a new list.");
      });
  }

  private _updateListColumns(siteUrl: string, listName: string, _chartConfig: ChartConfiguration): void {
      this._getListColumns(listName,siteUrl).then((response) => {
              var respLists: IPropertyPaneDropdownOption[] = [];
              console.log(response.value);
              for (var _key in response.value) {
                //Bharati
                if(response.value[_key]['TypeAsString'] as string == "Lookup"){
                  //debugger;
                  var lookupWishShowField = response.value[_key]['InternalName'] +'/' + response.value[_key]['LookupField'];
                  respLists.push({key: lookupWishShowField , text: lookupWishShowField});
                }
                else
                    respLists.push({key: response.value[_key]['InternalName'], text: response.value[_key]['Title']});
            }
            this._columnOptions = respLists;
            _chartConfig.columns = respLists;
            this.context.propertyPane.refresh();
      }).catch((err) => {
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.context.statusRenderer.renderError(this.domElement,"There was an error loading your list, please verify the selected list has Calendar Events or choose a new list.");
      });
  }

}
