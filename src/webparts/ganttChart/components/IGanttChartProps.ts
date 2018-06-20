import { IWebPartContext } from "@microsoft/sp-webpart-base";

export interface IGanttChartProps {
  description: string;
  listTitle: string;
  context: IWebPartContext;
  zoom: string;
  siteurl: string;
}

export interface IGanttChartState {
  loading?: boolean;
  error?: string;
  results?: any;
  showError?: boolean;
  currentZoom?: any;
  height?: number;
  zoom: string;
  //GanttRes:Array<any>
}

export interface IGanttChartItemProp {
  Title?: string;
  Body?: string;
  StartDate?: string;
  DueDate?: string;
  // PercentComplete?: number;
  PercentComplete?: string;
  //  PredecessorsId?: IPredecessors;
  PredecessorsId?: string;
  AssignedToId?: users;
  //Added
  duration?: string;
  parent?:string;
}

export interface users {
  results: number[];
}

export interface IPredecessors {
  results: number[];
}

export interface IGanttDataObject {
  data: IGanttData[];
  links?: IGanttLink[];
}

export interface IGanttData {
  id: number;
  text?: string;
  Body?: string;
  start_date: string;
 // s_date: Date;
  end_date?: string;
  duration?: number;
  order?: number;
  progress?: number;
  parent?: number;
  open?: boolean;
  users?: string;
  sendmail?: boolean;
}

export interface IGanttLink {
  id: number;
  source: number;
  target: number;
  type: string;
}
