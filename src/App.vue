<template>
  <v-app>
    <v-app-bar app class="elevation-5 red">
      <v-app-bar-nav-icon
        v-if="logueado"
        @click="draw = !draw"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn v-if="logueado" @click="salir()">Salir</v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="logueado || esAdmin || esVende || esAlmacen"
      app
      v-model="draw"
      temporary
    >
      <v-list>
        <v-list-item class="justify-center">
          <v-avatar size="70">
            <v-img
              src="https://res.cloudinary.com/dafdqsakr/image/upload/v1645590698/mfxw11ddyt0cxjo515y9.jpg"
            ></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-item class="text-center">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Fernando de Jesús
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list rounded v-if="logueado || esAdmin || esVende || esAlmacen">
        <v-list-item-group color="primary">
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-home mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Inicio</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- Opciones -->

      <v-list rounded v-if="esAdmin || esAlmacen">
        <v-list-group color="primary">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="black--text">Almacen</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item to="/categoria">
            <v-list-item-icon>
              <v-icon class="black--text"
                >mdi-clipboard-edit-outline mdi-36px</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Categorias</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/articulos">
            <v-list-item-icon>
              <v-icon class="black--text"
                >mdi-clipboard-edit-outline mdi-36px</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Articulos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- ************************* -->
      <v-list rounded v-if="esAdmin || esAlmacen">
        <v-list-group color="primary">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="black--text">Compras</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item to="/ingresos">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-slope-uphill mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Ingresos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/proveedores">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-truck mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Proveedores</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- ************************* -->
      <v-list rounded v-if="esAdmin || esVende">
        <v-list-group color="primary">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="black--text">Ventas</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item to="/ventas">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-cash-register mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Ventas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/clientes">
            <v-list-item-icon>
              <v-icon class="black--text"
                >mdi-account-group-outline mdi-36px</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Clientes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- ************************* -->
      <v-list rounded v-if="esAdmin">
        <v-list-group color="primary">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="black--text">Accesos</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item to="/usuarios">
            <v-list-item-icon>
              <v-icon class="black--text"
                >mdi-account-circle-outline mdi-36px</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- ************************* -->
      <v-list rounded v-if="esAdmin || esAlmacen || esVende">
        <v-list-group color="primary">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="black--text"
                >Consultas</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item to="/cCompras">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-cart mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Compras</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/cVentas">
            <v-list-item-icon>
              <v-icon class="black--text">mdi-cash-check mdi-36px</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Ventas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- ************************* -->
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      draw: false,
    };
  },
  computed: {
    logueado() {
      return this.$store.state.user;
    },
    esAdmin() {
      return (
        this.$store.state.user && this.$store.state.user.rol === "Administrador"
      );
    },
    esAlmacen() {
      return (
        this.$store.state.user && this.$store.state.user.rol === "Almacenero"
      );
    },
    esVende() {
      return (
        this.$store.state.user && this.$store.state.user.rol === "Vendedor"
      );
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    salir() {
      this.$store.dispatch("salir");
    },
  },
};
</script>
