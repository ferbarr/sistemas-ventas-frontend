import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home', 
    component: () => import( '../views/Home.vue'),
    meta:{
      administrador:true,
      almacenero:true,
      vendedor:true
      
    }
  },
  {
    path: '/articulos',
    name: 'articulos', 
    component: () => import( '../views/articulos.vue'),
    meta:{
      administrador:true,
      almacenero:true,      
    }
  },
  {
    path: '/categoria',
    name: 'categoria', 
    component: () => import( '../views/categoria.vue'),
    meta:{
      administrador:true,
      almacenero:true      
    }
  },
  {
    path: '/cCompras',
    name: 'cCompras',
    component: () => import( '../views/cCompras.vue'),
    meta:{
      administrador:true,
      almacenero:true,
      vendedor:true
      
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import( '../views/clientes.vue'),
    meta:{
      administrador:true,
      vendedor:true      
    }
  
  },
  {
    path: '/cVentas',
    name: 'cVentas',
    component: () => import( '../views/cVentas.vue'),
    meta:{
      administrador:true,
      almacenero:true,
      vendedor:true
      
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/login.vue'),
    meta:{
      libre:true
    }
  },
  {
    path: '/ingresos',
    name: 'ingresos',
    component: () => import( '../views/ingresos.vue'),
    meta:{
      administrador:true,
      almacenero:true,    
    }
  },
  {
    path: '/proveedores',
    name: 'proveedores',
    component: () => import( '../views/proveedores.vue'),
    meta:{
      administrador:true,
      almacenero:true,
      vendedor:true
      
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import( '../views/usuarios.vue'),
    meta:{
      administrador:true,    
    }

  },
  {
    path: '/ventas',
    name: 'ventas',
    component: () => import( '../views/ventas.vue'),
    meta:{
      administrador:true,
      vendedor:true      
    }
  
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.user && store.state.user.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.user && store.state.user.rol == 'Vendedor'){
    if (to.matched.some(record => record.meta.vendedor)){
      next();
    }
  } else if ( store.state.user && store.state.user.rol == 'Almacenero'){
    if (to.matched.some(record => record.meta.almacenero)){
      next();
    }
  } else{
    next({name: 'login'});
  }
})
export default router
