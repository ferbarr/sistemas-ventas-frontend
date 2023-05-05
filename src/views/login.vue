<template>
  <div>
    <v-row class="justify-center mt-2">
      <v-col class="col-12 col-md-7">
        <v-card>
          <v-card-text
            class="
            font-weight-black
              text-center
              display-1
              white--text
              text-uppercase
              elevation-8
              rounded
          indigo 
              "
          >
            <span>Ingreso</span>
          </v-card-text>
          
          <v-card-text>
            <v-alert type="error" v-if="error">{{this.error}}</v-alert>
            <v-form ref="validar">
              
              <v-text-field
              
              class="font-weight-black "
              required
              type="text"
              v-model="datos.user"
            
                label="Usuario"
                prepend-icon="mdi-account-circle mdi-36px black--text"
              >
              </v-text-field>

              <v-text-field
              class="font-weight-black"
              required
              :type="type.type"
            
              v-model="datos.pass"
                label="Contraseña"

                prepend-icon="mdi-key mdi-36px black--text"
              >
              </v-text-field>
               <v-btn small text  v-if="type.active" @click="ocultP()"> <v-icon>mdi-eye-off</v-icon> </v-btn>
                    <v-btn small text @click="verP()" v-if="!type.active"> <v-icon>mdi-eye</v-icon> </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="indigo lighten-3" class="white--text font-weight-black" @click="login()" :disabled="validBtn()">Acceder</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      error:null,
       type:{type:'password',active:false},
     datos:{
       user: '',
        pass: ''
     },
    };
  },
  methods:{
    ...mapActions(['guardarUsuario']),
     validBtn() {
      if (
        this.datos.user !== '' &&
        this.datos.pass !== '' &&
        this.$refs.validar.validate() 
      ) {
        return false;
      } else {
        return true;
      }
    },
    
       verP(){
      this.type={
        type:'text',
        active:true
      }
    },
    ocultP(){
      this.type={
        type:'password',
        active:false
      }
  },
  async login(){
      try {
          const res=await this.axios.post('/usuario/login',{email:this.datos.user,password:this.datos.pass});     
          this.$store.dispatch('guardarToken',res.data.tokenReturn);
          this.error=null;
          this.$router.push({name: 'Home'});
      
      } catch (error) {
          this.error=null;
          if(error.response.status===404){
            this.error=error.response.data.msj;
          }else{
            this.error='Ocurrio un error con el servidor'
          }
      }
  }
  }  
}
</script>

