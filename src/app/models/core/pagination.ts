export class Pagination {
    /*totalRecords: number;
    totalPages: number;*/

    /*inicio: number;
    limite: number;
    total: number;
    pagina: number;
    datos: any[];
    consulta: any; */

    nTotal: number;
    pageIndex: number;
    pageSize: number;

    constructor() {
        this.nTotal = 0;
        this.pageIndex = -1;
        this.pageSize = -1;
    }
}
