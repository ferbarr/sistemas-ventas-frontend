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
        :items="usuarios"
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
    <!-- MODAL AGREGAR EDITAR-->
    <v-dialog persistent v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Usuario
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
                  label="Nombre"
                  v-model="inputs.nombre"
                ></v-text-field>
              </v-col>
              <v-col class="col-12 col-sm-6 col-md-4">
                <v-select
                  :items="documentos"
                  label="Tipo documento"
                  v-model="inputs.tipo_documento"
                ></v-select> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Número de documento"
                  v-model="inputs.num_documento"
                ></v-text-field> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Dirección"
                  v-model="inputs.direccion"
                ></v-text-field> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Teléfono"
                  type="number"
                  step="any"
                  v-model="inputs.telefono"
                ></v-text-field> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Email"
                  v-model="inputs.email"
                ></v-text-field> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-text-field
                  label="Contraseña"
                  type="password"
                  v-model="inputs.password"
                ></v-text-field> </v-col
              ><v-col class="col-12 col-sm-6 col-md-4">
                <v-select :items="roles" label="Rol" v-model="inputs.rol">
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clear()">cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="guardarUsuario()" v-if="this.btn.agregar"
            >Guardar</v-btn
          >
          <v-btn @click="editarUsuario()" v-if="this.btn.editar">Editar</v-btn>
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
              >¿Deseas desactivar el usuario
              {{ this.estado.nombre }}?</span
            >
            <span v-if="this.estado.estado === 0" class="black--text"
              >¿Deseas activar el usuario {{ this.estado.nombre }}?</span
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
      roles: ["Administrador", "Almacenero", "Vendedor"],
      documentos: ["INE", "Pasaporte"],
      estado: {
        _id: "",
        nombre: "",
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
        foto:null,
        rol: null,
        nombre: null,
        tipo_documento: null,
        num_documento: null,
        direccion: null,
        telefono: null,
        email: null,
        password: null,
      },
      usuarios: [],
      search: "",
      encabezado: [
        { text: "Opciones", value: "accion", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Rol", value: "rol", sortable: false },
        { text: "Tipo documento", value: "tipo_documento", sortable: false },
        { text: "Número documento", value: "num_documento", sortable: false },
        { text: "Teléfono", value: "telefono", sortable: false },
        { text: "Email", value: "email", sortable: true },
        { text: "Estado", value: "estado", sortable: false },
      ],
    };
  },
  methods: {
    clear() {
      this.dialog = false;
      this.inputs = {
        foto:null,
        rol: null,
        nombre: null,
        tipo_documento: null,
        num_documento: null,
        direccion: null,
        telefono: null,
        email: null,
        password: null,
      };
      this._id = "";
      this.btn = {
        agregar: false,
        editar: false,
      };
    },
    async listarUsuario() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get("/usuario/get-all-usuario", header);
        this.usuarios = res.data;
      } catch (e) {
        console.log(e.response);
        localStorage.removeItem('token');
      }
    },
    async guardarUsuario() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.post(
          "usuario/add-usuario",
          this.inputs,
          header
        );
        this.snack = {
          color: "success",
          time: 3500,
          active: true,
          msj: "Usuario guardado",
        };
        this.listarUsuario();
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
        foto:datos.foto,
        rol: datos.rol,
        nombre: datos.nombre,
        tipo_documento: datos.tipo_documento,
        num_documento: datos.num_documento,
        direccion: datos.direccion,
        telefono: datos.telefono,
        email: datos.email,
        password: datos.password,
      };
      this._id = datos._id;
    },
    async editarUsuario() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.put(
          "usuario/update-usuario",
          {
            _id: this._id,
            foto:this.inputs.foto,
            rol: this.inputs.rol,
            nombre: this.inputs.nombre,
            tipo_documento: this.inputs.tipo_documento,
            num_documento: this.inputs.num_documento,
            direccion: this.inputs.direccion,
            telefono: this.inputs.telefono,
            email: this.inputs.email,
            password: this.inputs.password,
          },
          header
        );
        this.snack = {
          color: "success",
          time: 3500,
          active: true,
          msj: "Usuario actualizado",
        };
        this.listarUsuario();
        this.clear();
      } catch (error) {
        console.log(error);
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
        nombre: datos.nombre,
        active: true,
        estado: datos.estado,
      };
    },
    clearEstado() {
      this.estado = {
        _id: "",
        nombre: "",
        active: false,
        estado: null,
      };
    },
    async cambiarEstado() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      if (this.estado.estado === 1) {
        try {
          const res = await this.axios.put("usuario/deactivate-usuario",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 3500,
            active: true,
            msj: "Usuario desactivado",
          };
          this.listarUsuario();
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
            "usuario/activate-usuario",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 3500,
            active: true,
            msj: "Usuario activado",
          };
          this.listarUsuario();
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
    this.listarUsuario();
  },
};
</script>






