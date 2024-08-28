<template>
  <aside :class="is_expanded ? 'is-expanded' : ''">
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <h3>List</h3>

    <div class="menu">
      <router-link
        v-for="(menu, index) in filteredMenuItems"
        :key="index"
        class="button"
        v-show="hasViewPermission(menu.id)"
        :to="menu.route"
        active-class="active"
      >
        <span class="material-icons">{{ menu.icon }}</span>
        <span class="text">{{ menu.name }}</span>
      </router-link>
      <div class="d-flex flex-column mt-auto">
        <a class="button" href="#" @click="confirmLogout">
          <span class="material-icons">logout</span>
          <span class="text" v-if="is_expanded">Logout</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import logoURL from "../assets/dataa.png";
import Swal from "sweetalert2";

const router = useRouter();

const token = localStorage.getItem("token");
const baseURL =
  "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/";
const instance = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": true,
    Authorization: `Bearer ${token}`,
  },
});

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const menuPermissions = ref({});
const menuItems = ref([]);

const toggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value.toString());
};

async function fetchMenuData() {
  try {
    const response = await instance.get("/api/menupermissions");
    console.log("API Response:", response.data);

    const menuPermissionsArray = response.data.data || [];
    const permissions = {};
    const menus = [];

    const storedSubRole = localStorage.getItem("idSubRole");
    const idSubRole = storedSubRole ? parseInt(storedSubRole, 10) : null;

    menuPermissionsArray.forEach((permission) => {
      if (permission.idSubRole === idSubRole) {
        if (!permissions[permission.idMenu]) {
          permissions[permission.idMenu] = {
            createPermission: 0,
            updatePermission: 0,
            deletePermission: 0,
            viewPermission: 0,
          };
        }

        if (permission.createPermission === 1)
          permissions[permission.idMenu].createPermission = 1;
        if (permission.updatePermission === 1)
          permissions[permission.idMenu].updatePermission = 1;
        if (permission.deletePermission === 1)
          permissions[permission.idMenu].deletePermission = 1;
        if (permission.viewPermission === 1)
          permissions[permission.idMenu].viewPermission = 1;

        if (
          permission.menuName &&
          !menus.find((menu) => menu.id === permission.idMenu)
        ) {
          menus.push({
            id: permission.idMenu,
            name: permission.menuName,
            route: `/${permission.menuName.toLowerCase().replace(/\s+/g, "-")}`,
            icon: getIconForMenu(permission.menuName),
          });
        }
      }
    });

    menuPermissions.value = permissions;
    menuItems.value = menus;

    console.log("Processed Permissions:", menuPermissions.value);
  } catch (error) {
    console.error("Error fetching user permissions:", error.message);
  }
}

function hasViewPermission(idMenu) {
  const permission = menuPermissions.value[idMenu];
  console.log(`Checking permission for idMenu ${idMenu}:`, permission);
  return permission?.viewPermission === 1;
}

const filteredMenuItems = computed(() => {
  return menuItems.value;
});

function getIconForMenu(menuName) {
  switch (menuName.toLowerCase()) {
    case "menu":
      return "widgets";
    case "role":
      return "admin_panel_settings";
    case "subrole":
      return "admin_panel_settings";
    case "uom":
      return "square_foot";
    case "uom package":
      return "signal_cellular_alt";
    case "product":
      return "local_mall";
    case "permission":
      return "lock";
    default:
      return "star";
  }
}

async function confirmLogout(event) {
  event.preventDefault();
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out and redirected to the login page.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("idSubRole");
    router.push("/");
  }
}
onMounted(() => {
  fetchMenuData();
});
</script>

<style lang="scss" scoped>
:root {
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 3rem;
}
aside {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #014c84, #0187ea);
  color: var(--light);
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  transition: width 0.2s ease-in-out;
  height: 100%;

  .flex {
    flex: 1 1 0%;
  }

  .logo {
    margin-bottom: 1rem;
    img {
      width: 2rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;

    .menu-toggle {
      transition: 0.2s ease-in-out;
      .material-icons {
        font-size: 2rem;
        color: #fff;
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: #686464;
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    font-family: "roboto", sans-serif;
  }

  h3 {
    color: #ffff;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 -1rem;
    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .material-icons {
        font-size: 2rem;
        color: #ffff;
        transition: 0.2s ease-in-out;
      }
      .text {
        color: #ffff;
        transition: 0.2s ease-in-out;
        font-family: "roboto", sans-serif;
      }

      &:hover {
        background-color: #ffff;

        .material-icons,
        .text {
          color: #686464;
        }
      }
    }

    .button.active {
      background-color: #014c84;

      .material-icons,
      .text {
        color: #686464;
      }
    }

    .dropdown-menu {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;

      .dropdown-item {
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: 0.5rem 1rem;
        transition: 0.2s ease-in-out;

        .material-icons {
          font-size: 2rem;
          color: #ffff;
          transition: 0.2s ease-in-out;
        }
        .text {
          color: #ffff;
          transition: 0.2s ease-in-out;
          font-family: "roboto", sans-serif;
        }

        &:hover {
          background-color: #ffff;

          .material-icons,
          .text {
            color: #686464;
          }
        }
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    .footer {
      opacity: 1;
    }
  }
}

.router-link-custom {
  color: inherit; /* Mengatur warna teks agar sesuai dengan warna induk */
  text-decoration: none; /* Menghapus underline */
  display: inline-block; /* Menyusun inline dengan span */
}

.dropdown-arrow {
  margin-right: 1rem;
}

.text {
  transition: color 0.3s ease-in-out;
}
</style>
