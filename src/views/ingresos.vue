<template>
  <v-row class="d-flex justify-center mt-2">
    <v-snackbar
      top
      :color="snack.color"
      :timeout="snack.time"
      v-model="snack.active"
      >{{ snack.msj }}</v-snackbar
    >
    <v-card class="col-11" v-if="!verNuevo">
      <v-card-title>
        <v-btn fab small color="primary" @click="mostrarNuevo()">
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
        :items="ingresos"
        :search="search"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="datos in items" :key="datos._id">
              <td>
                <div>
                  <v-btn small fab text @click="listarDetalles(datos._id)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </div>
              </td>
              <td class="text-center">{{ datos.usuario.nombre }}</td>
              <td class="text-center">{{ datos.persona.nombre }}</td>
              <td class="text-center">{{ datos.tipo_comprobante }}</td>
              <td class="text-center">{{ datos.serie_comprobante }}</td>
              <td class="text-center">{{ datos.num_comprobante }}</td>
              <td class="text-center">{{ datos.createdAt }}</td>
              <td class="text-center">{{ datos.impuesto }}</td>
              <td class="text-center">{{ datos.total }}</td>
              <td class="text-center">
                <div v-if="datos.estado">
                  <v-btn class="success" small @click="editEstado(datos)">Aceptada</v-btn>
                </div>
                <div v-else>
                  <v-btn class="red" small @click="editEstado(datos)">Anulada</v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </template>

        <template slot="no-data">
          <h3>No hay datos</h3>
        </template>
      </v-data-table>
    </v-card>
    <!-- *****DATOS A GUARDAR******* -->

    <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
      <v-row wrap>
        <v-col class="col-12 col-sm-4">
          <v-select
            label="Tipo comprobante"
            :items="comprobantes"
            v-model="inputs.tipo_comprobante"
          ></v-select>
        </v-col>
        <v-col class="col-12 col-sm-4">
          <v-text-field
            label="Serie comprobante"
            v-model="inputs.serie_comprobante"
          ></v-text-field>
        </v-col>
        <v-col class="col-12 col-sm-4">
          <v-text-field
            label="Número comprobante"
            v-model="inputs.num_comprobante"
          ></v-text-field>
        </v-col>
        <v-col class="col-12 col-sm-8">
          <v-autocomplete
            :items="personas"
            label="Proveedor"
            v-model="inputs.persona"
          ></v-autocomplete>
        </v-col>
        <v-col class="col-12 col-sm-4">
          <v-text-field
            label="Impuesto"
            type="number"
            v-model="inputs.impuesto"
          ></v-text-field>
        </v-col>
        <v-col class="col-12 col-sm-8">
          <v-text-field
            label="Código"
            v-model="codigo"
            @keyup.enter="getArticuloCodigo()"
          ></v-text-field>
        </v-col>
        <v-col class="col-12 col-sm-2">
          <v-btn fab small @click="dialog = true">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-col>
        <v-col class="col-12">
          <template>
            <v-data-table
              :headers="cabeceraDetalle"
              :items="inputs.detalles"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="datos in items" :key="datos._id">
                    <td class="text-center">
                      <v-btn
                        fab
                        text
                        small
                        color="red"
                        @click="delDetalle(inputs.detalles, datos)"
                      >
                        <v-icon dark>mdi-trash-can</v-icon>
                      </v-btn>
                    </td>
                    <td class="text-center">{{ datos.articulo }}</td>
                    <td class="text-center">
                      <v-text-field
                        v-model="datos.cantidad"
                        type="number"
                      ></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-text-field
                        v-model="datos.precio"
                        type="number"
                        step="any"
                      ></v-text-field>
                    </td>
                    <td class="text-center">
                      {{ datos.precio * datos.cantidad }}
                    </td>
                  </tr>
                </tbody>
              </template>

              <template v-slot:no-results>
                <h3>No hay artículos agregados</h3>
              </template>
            </v-data-table>

            <v-col class="text-right">
              <strong>Total Neto: </strong>${{
                (this.inputs.total = this.calcularTotal)
              }}
            </v-col>
          </template>
        </v-col>
        <v-col class="col-12 text-right">
          <v-btn class="mr-3" @click="ocultarNuevo()" small>Cancelar</v-btn>
          <v-btn small @click="agregarIngreso()">Guardar</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- MODAL AGREGAR DETALLES-->
    <v-dialog persistent v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title class="headline"
          ><span>Seleccione un articulo</span>
          <v-spacer></v-spacer>
          <v-btn text fab color="black" @click="cerrarModalArticulo()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="col-12">
                <v-text-field
                  label="Buscar articulo"
                  prepend-icon="mdi-magnify"
                  v-model="texto"
                  @keyup="listarArticulos()"
                  class="text-center"
                ></v-text-field>
                <template>
                  <v-data-table
                    :headers="encabezadoArticulo"
                    :items="articulos"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="datos in items" :key="datos._id">
                          <td class="text-center">
                            <v-btn @click="agregarDetalle(datos)" fab text>
                              <v-icon dark>mdi-plus</v-icon>
                            </v-btn>
                          </td>
                          <td class="text-center">{{ datos.codigo }}</td>
                          <td class="text-center">{{ datos.nombre }}</td>
                          <td class="text-center">{{ datos.descripcion }}</td>
                          <td class="text-center">{{ datos.precio_venta }}</td>
                          <td class="text-center">{{ datos.stock }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- MODAL VER DETALLE -->
    <v-dialog persistent v-model="vDetalle" max-width="1000px">
      <v-card>
        <v-card-title class="headline"
          ><span>Detalles de compra</span>
          <v-spacer></v-spacer>
          <v-btn text fab color="black" @click="cerrarModalArticulo()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="col-12">
                <template>
                  <v-data-table
                    :headers="verDetalle"
                    :items="articulos"
                    hide-default-footer
                    class="elevation-1"
                  >
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="datos in items" :key="datos._id">
                          <td class="text-center">{{ datos.articulo }}</td>
                          <td class="text-center">{{ datos.cantidad }}</td>
                          <td class="text-center">{{ datos.precio }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- MODAL ESTADO -->
    <v-dialog persistent v-model="estado.active" max-width="500px">
      <v-card>
        <v-card-title class="red lighten-2"
          >Ingresos
          <v-spacer></v-spacer>
          <v-btn text fab color="black"  @click="clearEstado()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container>
            <span v-if="this.estado.estado === 1" class="black--text"
              >¿Deseas cancelar la compra con serie de comprobante {{ this.estado.serie_comprobante }}?</span
            >
            <span v-if="this.estado.estado === 0" class="black--text"
              >¿Deseas activar la compra con serie de comprobante {{ this.estado.serie_comprobante }}?</span
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
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      vDetalle:false,
      ingresos: [],
      personas: [],
      comprobantes: ["Factura", "Ticket", "Boleta"],
      codigo: null,
      inputs: {
        usuario: "",
        persona: null,
        tipo_comprobante: null,
        serie_comprobante: null,
        num_comprobante: null,
        impuesto: 18,
        total: 0,
        detalles: [],
      },
      search: "",
      estado: {
        _id: "",
        serie_comprobante: "",
        active: false,
        estado: null,
      },
      snack: {
        color: "",
        time: 3500,
        msj: "",
        active: false,
      },
      dialog: false,
      _id: "",
      encabezado: [
        { text: "Opciones", value: "accion", sortable: false },
        { text: "Usuario", value: "usuario.nombre", sortable: true },
        { text: "Proveedor", value: "persona.nombre", sortable: true },
        { text: "Tipo comprobante", value: "tipo_comprobante", sortable: true },
        {
          text: "Serie comprobante",
          value: "serie_comprobante",
          sortable: false,
        },
        {
          text: "Número comprobante",
          value: "num_comprobante",
          sortable: false,
        },
        { text: "Fecha", value: "createdAt", sortable: false },
        { text: "Impuesto", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      cabeceraDetalle: [
        { text: "Borrar", value: "borrar", sortable: false, align: "center" },
        {
          text: "Artículo",
          value: "articulo",
          sortable: false,
          align: "center",
        },
        {
          text: "Cantidad",
          value: "cantidad",
          sortable: false,
          align: "center",
        },
        { text: "Precio", value: "precio", sortable: false, align: "center" },
        {
          text: "Subtotal",
          value: "subtotal",
          sortable: false,
          align: "center",
        },
      ],
      verNuevo: false,
      encabezadoArticulo: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Articulo", value: "nombre", sortable: true },
        { text: "Descripción", value: "descripcion", sortable: true },
        { text: "Precio de venta", value: "precio_venta", sortable: false },
        { text: "Stock", value: "stock", sortable: false },
      ],
      verDetalle: [
        { text: "Articulo", value: "articulo", sortable: false ,align: 'center',class:'red lighten-2'},
        { text: "Cantidad", value: "cantidad", sortable: false,align: 'center',class:'red lighten-2' },
        { text: "Precio", value: "precio", sortable: false,align: 'center',class:'red lighten-2' },
      ],
      articulos: [],
      texto: "",
    };
  },
  methods: {
    async listarProveedor() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      let proveedorArray = [];
      try {
        const res = await this.axios.get("/persona/get-proveedor", header);
        proveedorArray = res.data;
        proveedorArray.map((item) =>
          this.personas.push({ text: item.nombre, value: item._id })
        );
      } catch (error) {
        console.log(error);
      }
    },
    async listarIngresos() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get("/ingreso/get-all-ingreso", header);
        this.ingresos = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    editEstado(datos) {
      this.estado = {
        _id: datos._id,
        serie_comprobante: datos.serie_comprobante,
        active: true,
        estado: datos.estado,
      };
    },
    clearEstado() {
      this.estado = {
        _id: "",
        serie_comprobante: "",
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
            "ingreso/deactivate-ingreso",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 2500,
            active: true,
            msj: "Compra cancelada",
          };
          this.listarIngresos();
          this.clearEstado();
        } catch (error) {
          this.snack = {
            color: "error",
            time: 2500,
            active: true,
            msj: "Ocurrio un error",
          };
          this.clearEstado();
        }
      }else {
        try {
          const res = await this.axios.put(
            "ingreso/activate-ingreso",
            {
              _id: this.estado._id,
            },
            header
          );
          this.snack = {
            color: "success",
            time: 2500,
            active: true,
            msj: "Compra activada",
          };
          this.listarIngresos();
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
    mostrarNuevo() {
      this.verNuevo = true;
    },
    ocultarNuevo() {
      this.verNuevo = false;
      this.inputs = {
        persona: null,
        tipo_comprobante: null,
        serie_comprobante: null,
        num_comprobante: null,
        impuesto: 18,
        total: null,
        detalles: [],
      };
    },
    async getArticuloCodigo() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get(
          `/articulo/get-articulo-codigo?codigo=${this.codigo}`,
          header
        );
        this.agregarDetalle(res.data);
      } catch (e) {
        console.log(e.response);
        this.snack = {
          color: "error",
          time: 2000,
          active: true,
          msj: e.response.data.msj,
        };
      }
    },
    buscar(id) {
      const find = this.inputs.detalles.find((item) => item._id === id);
      if (find) {
        return true;
      } else {
        return false;
      }
    },
    agregarDetalle(data) {
      if (this.buscar(data._id)) {
        this.snack = {
          color: "error",
          time: 2000,
          active: true,
          msj: "El articulo ya fue agregado",
        };
      } else {
        this.inputs.detalles.push({
          _id: data._id,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_venta,
        });
      }
      this.codigo = "";
    },
    delDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    async listarArticulos() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get(
          `/articulo/get-all-articulo?valor=${this.texto}`,
          header
        );
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
    cerrarModalArticulo() {
      this.vDetalle=false;
      this.dialog = false;
      this.articulos = [];
    },
    async agregarIngreso() {
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.post(
          "/ingreso/add-ingreso",
          {
            persona: this.inputs.persona,
            usuario: this.$store.state.user._id,
            tipo_comprobante: this.inputs.tipo_comprobante,
            serie_comprobante: this.inputs.serie_comprobante,
            num_comprobante: this.inputs.num_comprobante,
            impuesto: this.inputs.impuesto,
            total: this.inputs.total,
            detalles: this.inputs.detalles,
          },
          header
        );
        this.ocultarNuevo();
        this.listarIngresos();
        this.snack = {
          color: "success",
          time: 2500,
          active: true,
          msj: "Compra agregada",
        };
      } catch (e) {
        this.snack = {
          color: "error",
          time: 2500,
          active: true,
          msj: "Ocurrio un error",
        };
      }
    },
    async listarDetalles(id) {
      this.vDetalle=true;
      let token = { token: this.$store.state.token };
      let header = { headers: token };
      try {
        const res = await this.axios.get(
          `/ingreso/get-ingreso?_id=${id}`,
          header
        );
        this.articulos = res.data.detalles;
      } catch (error) {
        this.snack = {
          color: "error",
          time: 3500,
          active: true,
          msj: "Ocurrio un error",
        };
      }
    },
  },
  computed: {
    calcularTotal() {
      let resultado = 0.0;
      this.inputs.detalles.map((item) => {
        resultado = resultado + item.cantidad * item.precio;
      });
      return resultado;
    },
  },
  created() {
    this.listarIngresos();
    this.listarProveedor();
  },
};
</script>






