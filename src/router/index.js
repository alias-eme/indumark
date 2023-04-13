import Vue from 'vue'
import VueRouter from 'vue-router'

//específicas del proyecto
import Carpetas from '../views/importaciones/Carpetas.vue'

import Documentos from '../views/importaciones/Documentos.vue'
import FechasDeImportacion from '../views/importaciones/FechasDeImportacion.vue'
import Forwards from '../views/importaciones/Forwards.vue'
import InstrumentosFinancieros from '../views/importaciones/InstrumentosFinancieros.vue'


import Proveedores from '../views/importaciones/Proveedores.vue'
import Productos from '../views/importaciones/Productos.vue'
import ProGrupos from '../views/importaciones/ProGrupos.vue'
import ProSubgrupos from '../views/importaciones/ProSubgrupos.vue'

//menu de vistas públicas
import Inicio from '../views/framework/Inicio.vue'
import RecuperarClave from '../views/framework/RecuperarClave.vue'
import Login from '../views/framework/Login.vue'
// menu de configuracion
import Usuarios from '../views/config/Usuarios.vue'
import Exportar from '../views/config/Exportar.vue'
import Perfiles from '../views/config/Perfiles.vue'
import Params from '../views/config/Params.vue'

// menu de usuario
import MisDatos from '../views/config/MisDatos.vue'
// menu de master
import Companies from '../views/master/Companies.vue'
import Users from '../views/master/Users.vue'
import Menus from '../views/master/Menus.vue'



Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Inicio',
        component: Inicio,
        meta: {
            //requiereLogin: true,
            menu: 'root',
            ispublic: true
        }
    },
    { path: '/carpetas', name: 'Carpetas', component: Carpetas, },
    { path: '/documentos', name: 'Documentos', component: Documentos, },
    { path: '/fechasDeImportacion', name: 'FechasDeImportacion', component: FechasDeImportacion, },
    { path: '/forwards', name: 'Forwards', component: Forwards, },
    { path: '/instrumentosFinancieros', name: 'InstrumentosFinancieros', component: InstrumentosFinancieros, },
    

    
    
    { path: '/proveedores', name: 'Proveedores', component: Proveedores, },
    { path: '/productos', name: 'Productos', component: Productos, },
    { path: '/progrupos', name: 'ProGrupos', component: ProGrupos },

    { path: '/prosubgrupos', name: 'ProSubgrupos', component: ProSubgrupos },



    

    
    {
        path: '/recuperarClave',
        name: 'RecuperarClave',
        component: RecuperarClave,
        meta: { ispublic: true }
    },


    


    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            ispublic: true
        }
    },
    {
        path: '/misDatos',
        name: 'MisDatos',
        component: MisDatos,
        meta: {
            ispublic: true
        }
    },
    {
        path: '/companies',
        name: 'Companies',
        component: Companies,
        meta: {
            ispublic: true
        }
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
            ispublic: true
        }
    },


    //framework
    {
        path: '/usuarios',
        name: 'Usuarios',
        component: Usuarios
    },
    {
        path: '/exportar',
        name: 'Exportar',
        component: Exportar
    },
    {
        path: '/menus',
        name: 'Menus',
        component: Menus
    },
    {
        path: '/perfiles',
        name: 'Perfiles',
        component: Perfiles
    },
    {
        path: '/params',
        name: 'Params',
        component: Params
    },


    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    //base: '/',
    //base: process.env.NODE_ENV === 'production' ? '/indumark' : '/',
    base: process.env.NODE_ENV === 'production' ? '/Secure/Induweb3.0/Secure/Importaciones/' : '/',

    mode: 'history',
    routes
})
router.beforeEach((to, from, next) => {
    //Al redirigir debe evaluar:
    //1. si está logueado
    //2. si puede acceder sin loguearse (definido en meta)
    //3. si la ruta calza con alguna de las definidas de las vistas de perfil
    console.log("-------------------------------");
    console.log("router.beforeEach");
    console.log("ruta: " + to.path);
    //console.log(to);

    let ispublic = (to.meta.ispublic && to.meta.ispublic == true) ? true : false;
    //console.log("ispublic: " + ispublic);
    if (ispublic) {
        next(); //continue
    } else {
        let userstring = sessionStorage.getItem("usuario");
        if (userstring == null) {
            console.log("no hay usuario");
            next('/');
        } else {
            console.log("verificando menu");
            let menustring = sessionStorage.getItem("menu");
            let menu = JSON.parse(menustring);
            //console.log(typeof menu);
            //console.log(menu);
            var ruta = to.path;
            console.log("ruta1 :" + ruta);
            console.log(ruta.lastIndexOf("/"));
            if (ruta.lastIndexOf("/")) {
                ruta = ruta.substr(0, ruta.lastIndexOf("/"));
            }
            console.log("ruta 2 :" + ruta);
            let puede = menu.reduce((out, m) => out == m.href ? true : out, ruta);

            //si hay usuario, evaluar si tiene acceso a la vista:
            //console.log("puede: "+puede);
            if (puede === true) {
                next(); //continue
            } else {
                console.log("hay usuario pero no tiene acceso ");
                next('/');
            }
            //let menu = JSON.parse( sessionStorage.getItem("menu"));
            //console.log(menu);


        }

    }
})
export default router