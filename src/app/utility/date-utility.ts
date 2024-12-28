import moment from "moment";

export class DateUtility {

  /*static getDate(fecha: string): Date {
    return moment(fecha, 'DD/MM/YYYY').toDate();
  }*/

  static stringToDate(fecha: string, format : string = "DD/MM/YYYY"): Date {
    return moment(fecha, format).toDate();
  }

  /*static formatearFecha(fecha: Date, hora: boolean = false): string {
    if (hora) {
      return moment(fecha).format('DD/MM/YYYY hh:mm:ss');
    }
    return moment(fecha).format('DD/MM/YYYY');
  }*/

  static dateToString(fecha: Date, format : string = "DD/MM/YYYY"): string {
    return moment(fecha).format(format);
  }
}
