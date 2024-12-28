import { Pagination } from './pagination';

/*
* success: 1:OK / 2:Cancel
* messageType: 1:Success / 2:Error / 3:Warning
* message: string
* data: any
* pagination: Pagination
*/
export interface ResponseServer<T> {
  success: number;
  messageType: number;
  message: string;
  data: T;
  pagination: Pagination;
}
