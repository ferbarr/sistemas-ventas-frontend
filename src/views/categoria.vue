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
        :items="categorias"
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
    <!-- MODAL DATOS-->
    <v-dialog persistent v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Categoría
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
                  label="Categoría"
                  v-model="inputs.nombre"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Descripcion"
                  v-model="inputs.descripcion"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clear()">cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="guardarCategoria()" v-if="this.btn.agregar"
            >Aceptar</v-btn
          >
          <v-btn @click="editarCategoria()" v-if="this.btn.editar"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- MODAL ESTADO -->
    <v-dialog persistent v-model="estado.active" max-width="400px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Categoría
          <v-spacer></v-spacer>
          <v-btn text fab color="black" @click="clearEstado()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container>
            <span v-if="this.estado.estado === 1" class="black--text"
              >¿Deseas desactivar la categoria
              {{ this.estado.categoria }}?</span
            >
            <span v-if="this.estado.estado === 0" class="black--text"
              >¿Deseas activar la categoria {{ this.estado.categoria }}?</span
            >
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clearEstado()">cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="cambiarEstado()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      inputs: {
        nombre: "",
        descripcion: "",
      },
      categorias: [],
      search: "",
      encabezado: [
        { text: "Opciones", value: "accion", sortable: false },
        { text: "Categoria", value: "nombre", sortable: false },
        { text: "Descripcion", value: "descripcion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
    };
  },
  methods: {
    clear() {
      this.dialog = false;
      this.inputs = {
        nombre: "",
        descripcion: "",
      };
      this._id = "";
      this.btn = {
        agregar: false,
        editar: false,
      };
    },
    async listarCategorias() {
      let token={'token':this.$store.state.token}
      let header={headers:token}
      try {
        const res = await this.axios.get("/categoria/get-all-category",header);
        this.categorias = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    datosEdit(datos) {
      this.btn = {
        agregar: false,
        editar: true,
      };
      this.dialog = true;
      this.inputs = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      };
      this._id = datos._id;
    },
    async guardarCategoria() {
      let token={'token':this.$store.state.token}
      let header={headers:token}
      try {
        const res = await this.axios.post(
          "categoria/add-category",
          this.inputs,header
        );
        this.snack = {
          color: "success",
          time: 3500,
          active: true,
          msj: "Categoría guardada",
        };
        this.listarCategorias();
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
    async editarCategoria() {
      let token={'token':this.$store.state.token}
      let header={headers:token}
      try {
        const res = await this.axios.put("categoria/update-category", {
          _id: this._id,
          nombre: this.inputs.nombre,
          descripcion: this.inputs.descripcion,
        },header);
        this.snack = {
          color: "success",
         time: 3500,
          active: true,
          msj: "Categoría actualizada",
        };
        this.listarCategorias();
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
        categoria: datos.nombre,
        active: true,
        estado: datos.estado,
      };
    },
    clearEstado() {
      this.estado = {
        _id: "",
        categoria: "",
        active: false,
        estado: null,
      };
    },
    async cambiarEstado() {
      let token={'token':this.$store.state.token}
      let header={headers:token}
      if (this.estado.estado === 1) {
        try {
          const res = await this.axios.put("categoria/deactivate-category", {
            _id: this.estado._id,
          },header);
          this.snack = {
            color: "success",
            time: 3500,
            active: true,
            msj: "Categoría desactivada",
          };
          this.listarCategorias();
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
          const res = await this.axios.put("categoria/activate-category", {
            _id: this.estado._id,
          },header);
          this.snack = {
            color: "success",
           time: 3500,
            active: true,
            msj: "Categoría activada",
          };
          this.listarCategorias();
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
    this.listarCategorias();
  },
};
</script>
