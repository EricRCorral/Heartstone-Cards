export class CartaModel {
    id: string;
    nombre: string;
    descripcion: string;
    conjunto: boolean;
    emailEditores: any[] = [];

    constructor() {
        this.conjunto = true;
    }
}

