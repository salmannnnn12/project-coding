import { createRouter, createWebHistory } from 'vue-router';


import Login from '@/views/LoginView.vue';
import DataProduk from '@/views/DataProdukView.vue';
import ReportingStock from '@/views/ReportingStockView.vue';
import ReportingPushBPOM from '@/views/ReportingPushBPOMView.vue';
import Menu from '@/views/MenuView.vue';
import Role from '@/views/RoleView.vue';
import SubRole from '@/views/SubRoleView.vue';
import Permission from '@/views/PermissionView.vue';
import Uom from '@/views/UomView.vue';
import UomPackage from '@/views/UomPackageView.vue';
import Product from '@/views/ProductView.vue';

function isAuthenticated() {
  return !!localStorage.getItem('token'); 
}

const routes = [
  { path: '/', component: Login },
  { 
    path: '/data-produk', 
    component: DataProduk, 
    meta: { title: 'Data Produk' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/reporting-stock', 
    component: ReportingStock, 
    meta: { title: 'Reporting Stok' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/reporting-push-BPOM', 
    component: ReportingPushBPOM, 
    meta: { title: 'Reporting Push BPOM' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/menu', 
    component: Menu, 
    meta: { title: 'Menu' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/role', 
    component: Role, 
    meta: { title: 'Role' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/subrole', 
    component: SubRole, 
    meta: { title: 'Sub Role' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/permission', 
    component: Permission, 
    meta: { title: 'Menu Permission' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/uom', 
    component: Uom, 
    meta: { title: 'Unit Of Measure' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/uom-Package', 
    component: UomPackage, 
    meta: { title: 'Unit Of Measure Package' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
  { 
    path: '/product', 
    component: Product, 
    meta: { title: 'Product' },
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/'); // Arahkan ke login jika tidak autentikasi
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
