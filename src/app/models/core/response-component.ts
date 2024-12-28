/*
* 1: OK
* 2: Cancel
* data: any
*/
export interface ResponseComponent<T> {
  status: number;
  data: T;
}
