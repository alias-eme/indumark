import Vue from 'vue'
import App from './App.vue'

import router from './router'


import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
// iconos generales
import { faDoorOpen, faDoorClosed, faBell, faUser, faBuildingCircleCheck, faBuildingCircleExclamation, faQuestion,faCircleQuestion, faUserLock, faLock, faKey, faUserSlash } from '@fortawesome/free-solid-svg-icons'
library.add(faDoorOpen, faDoorClosed, faBell, faUser, faBuildingCircleCheck, faBuildingCircleExclamation, faQuestion,faCircleQuestion, faUserLock, faLock, faKey, faUserSlash)
    // iconos de archivo
import { faImage, faFileExcel, faFileUpload, faDownload, faArchive, faFileArchive, faSave, faCopy, faForward, faBackward } from '@fortawesome/free-solid-svg-icons'
library.add(faImage, faFileExcel, faFileUpload,faDownload, faArchive, faFileArchive, faSave, faCopy, faForward, faBackward)
    //iconos para registros
import { faTrash, faEdit, faPlus,faArrowsTurnToDots } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faEdit, faPlus,faArrowsTurnToDots)
    //iconos especiales
import { faPaw, faTruck, faTruckFast, faListOl, faFileInvoiceDollar, faShoppingCart, faChartLine, faSync, faTasks, faEnvelope, faSearchDollar ,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
library.add(faPaw, faTruck, faTruckFast, faListOl, faFileInvoiceDollar, faShoppingCart, faChartLine, faSync, faTasks, faEnvelope, faSearchDollar,faMagnifyingGlass)

//import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
//library.add(faCircleCheck)

import { faSpinner, faCheck, faCircleCheck, faCheckDouble, faBarcode, faBox, faBoxes, faBoxOpen, faUndo, faPaste, faTimes, faRuler, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
library.add(faSpinner, faCheck, faCircleCheck, faCheckDouble, faBarcode, faBox, faBoxes, faBoxOpen, faUndo, faPaste, faTimes, faRuler, faClipboardCheck)

Vue.component('font-awesome-icon', FontAwesomeIcon)



import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles/spacelab/bootstrap.min.css'
//import './assets/styles/sandstone/bootstrap.min.css'
//import './assets/styles/sketchy/bootstrap.min.css'
import './assets/styles/mainstyle.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

//import cafePdf from 'cafe-pdf'
//Vue.use(cafePdf)

Vue.config.productionTip = false



//mis funciones
import myFilters from './plugins/myFilters.js';

Vue.use(myFilters, {
    /* optional options */
  })



new Vue({
    router,
    render: h => h(App),
}).$mount('#app')