<template>
  <div class="d-flex justify-center mt-2">
    <v-snackbar
      top
      :color="snack.color"
      :timeout="snack.time"
      v-model="snack.active"
      >{{ snack.msj }}</v-snackbar
    >
    <v-card class="col-11">
      <v-card-title>
        <v-btn class="mr-1" @click="crearPDF()"><v-icon>mdi-printer</v-icon></v-btn>
        <v-btn
          fab
          small
          color="primary"
          @click="(dialog = true), (btn.agregar = true)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        locale="es-MX"
        :headers="encabezado"
        :items="articulos"
        :search="search"
      >
        <template v-slot:[`item.accion`]="{ item }">
          <v-btn
            class="mr-2"
            fab
            text
            small
            color="green"
            @click="datosEdit(item)"
          >
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <div v-if="item.estado === 1">
            <v-btn small class="green" @click="editEstado(item)">Activo</v-btn>
          </div>
          <div v-if="item.estado === 0">
            <v-btn small class="red" @click="editEstado(item)">Inactivo</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <!-- MODAL GUARDAR/ACTUALIZAR-->
    <v-dialog persistent v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Articulo
          <v-spacer></v-spacer>
          <v-btn text fab color="black" @click="clear()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Código"
                  v-model="inputs.codigo"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Articulo"
                  v-model="inputs.nombre"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-select
                  :items="categorias"
                  label="Categoría"
                  v-model="inputs.categoria"
                ></v-select>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Descripción"
                  v-model="inputs.descripcion"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Precio de venta"
                  type="number"
                  step="any"
                  v-model="inputs.precio_venta"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Stock"
                  type="number"
                  step="any"
                  v-model="inputs.stock"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clear()">cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="guardarArticulo()" v-if="this.btn.agregar"
            >Aceptar</v-btn
          >
          <v-btn @click="editarArticulo()" v-if="this.btn.editar"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- MODAL ESTADO -->
    <v-dialog persistent v-model="estado.active" max-width="400px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Articulo
          <v-spacer></v-spacer>
          <v-btn text fab color="black" @click="clearEstado()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container>
            <span v-if="this.estado.estado === 1" class="black--text"
              >¿Deseas desactivar el articulo {{ this.estado.articulo }}?</span
            >
            <span v-if="this.estado.estado === 0" class="black--text"
              >¿Deseas activar el articulo {{ this.estado.articulo }}?</span
            >
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clearEstado()">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="cambiarEstado()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
export default {
  data() {
    return {
      articulos: [],
      inputs: {
        categoria: null,
        codigo: null,
        nombre: null,
        descripcion: null,
        precio_venta: null,
        stock: null,
      },
      categorias: [],
      estado: {
        _id: "",
        categoria: "",
        active: false,
        estado: null,
      },
      btn: {
        agregar: false,
        editar: false,
      },
      snack: {
        color: "",
        time: 2000,
        msj: "",
        active: false,
      },
      dialog: false,
      _id: "",

      search: "",
      encabezado: [
        { text: "Opciones", value: "accion", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Articulo", value: "nombre", sortable: true },
        { text: "Categoría", value: "categoria.nombre", sortable: true },
        { text: "Descripción", value: "descripcion", sortable: true },
        { text: "Precio de venta", value: "precio_venta", sortable: false },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
    };
  },
  methods: {
    crearPDF() {
      const encabezado=[
        {title:'Articulo',dataKey:'articulo'},
        {title:'Código',dataKey:'codigo'},
        {title:'Categoria',dataKey:'categoria'},
        {title:'Stock',dataKey:'stock'},
        {title:'Precio de Venta',dataKey:'precio_venta'},
        ];
      const body=[];
      this.articulos.map(item=>{
        body.push({
          articulo:item.nombre,
          codigo:item.codigo,
          categoria:item.categoria.nombre,
          stock:item.stock,
          precio_venta:`$${item.precio_venta}`
        });
      })
      const doc = new jsPDF('p','pt');
      doc.autoTable(encabezado,body,{
        margin:{top:60},
        didDrawPage:(data)=>{
          doc.text('Lista de articulos',40,30);
        }
      });
      doc.save("articulos.pdf");
    },
    clear() {
      this.dialog = false;
      this.inputs = {
        categoria: null,
        codigo: null,
        nombre: null,
        descripcion: null,
        precio_venta: null,
        stock: null,
      };
      this._id = "";
      this.btn = {
        agregar: false,
        editar: false,
      };
    },
    async listarArticulos() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get("/articulo/get-all-articulo", header);
        this.articulos = res.data;
      } catch (error) {
        this.snack = {
          color: "error",
          time: 3500,
          active: true,
          msj: "Ocurrio un error",
        };
      }
    },
    async listarCategorias() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      let categoriaArray = [];
      try {
        const res = await this.axios.get("/categoria/get-all-category", header);
        categoriaArray = res.data;
        categoriaArray.map((item) =>
          this.categorias.push({ text: item.nombre, value: item._id })
        );
      } catch (error) {
        console.log(error);
      }
    },
    async guardarArticulo() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.post(
          "articulo/add-articulo",
          this.inputs,
          header
        );
        this.snack = {
          color: "success",
          time: 3500,
          active: true,
          msj: "Articulo guardado",
        };
        this.listarArticulos();
        this.clear();
      } catch (e) {
        this.snack = {
          color: "error",
          time: 3500,
          active: true,
          msj: e.response.data.msj,
        };
        this.clear();
      }
    },
    datosEdit(datos) {
      this.btn = {
        agregar: false,
        editar: true,
      };
      this.dialog = true;
      this.inputs = {
        categoria: datos.categoria._id,
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio_venta: datos.precio_venta,
        stock: datos.stock,
      };
      this._id = datos._id;
    },
    async editarArticulo() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.put(
          "articulo/update-articulo",
          {
            _id: this._id,
            categoria: this.inputs.categoria,
            codigo: this.inputs.codigo,
            nombre: this.inputs.nombre,
            descripcion: this.inputs.descripcion,
            precio_venta: this.inputs.precio_venta,
            stock: this.inputs.stock,
          },
          header
        );
        this.snack = {
          color: "success",
          time: 3500,
          active: true,
          msj: "Articulo actualizado",
        };
        this.listarArticulos();
        this.clear();
      } catch (error) {
        this.snack = {
          color: "error",
          time: 3500,
          active: true,
          msj: "Ocurrio un error",
        };
        this.clear();
      }
    },
    editEstado(datos) {
      this.estado = {
        _id: datos._id,
        articulo: datos.nombre,
        active: true,
        estado: datos.estado,
      };
    },
    clearEstado() {
      this.estado = {
        _id: null,
        articulo: null,
        active: false,
        estado: null,
      };
    },
    async cambiarEstado() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      if (this.estado.estado === 1) {
        try {
          const res = await this.axios.put(
            "articulo/deactivate-articulo",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 3500,
            active: true,
            msj: "Articulo desactivado",
          };
          this.listarArticulos();
          this.clearEstado();
        } catch (error) {
          this.snack = {
            color: "error",
            time: 3500,
            active: true,
            msj: "Ocurrio un error",
          };
          this.clearEstado();
        }
      }
      if (this.estado.estado === 0) {
        try {
          const res = await this.axios.put(
            "articulo/activate-articulo",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 3500,
            active: true,
            msj: "Articulo activado",
          };
          this.listarArticulos();
          this.clearEstado();
        } catch (error) {
          this.snack = {
            color: "error",
            time: 3500,
            active: true,
            msj: "Ocurrio un error",
          };
          this.clearEstado();
        }
      }
    },
  },
  created() {
    this.listarArticulos();
    this.listarCategorias();
  },
};
</script>
