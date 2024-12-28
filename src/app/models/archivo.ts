import { Constante } from "../utility/constante";

export class Archivo {
    idArchivo: number;
    name: string;
    format: string;
    size: number;
    file: File;
    sizeDesc: string;
    //actionFile: string;

    constructor() {
        this.idArchivo = 0;
        this.name = "";
        this.format = "";
        this.size = 0;
        this.file = new File([], "");
        this.sizeDesc = "";
        //this.actionFile = Constante.ACCION_FORM_NEW;
    }
}
