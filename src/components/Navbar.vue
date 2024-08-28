<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light pl-3 custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        {{ title }}
      </a>
      <div class="d-flex flex-grow-1 justify-content-end align-items-center">
        <div class="scrollable-navbar-content">
          <span class="navbar-text mx-3 fw-normal">
            <i class="bi bi-person-circle"></i> {{ subRoleName }}
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const title = ref("");
const subRoleName = ref("");
const route = useRoute();
const baseURL =
  "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/";
const storedSubRole = localStorage.getItem("idSubRole");
const idSubRole = storedSubRole ? parseInt(storedSubRole, 10) : null;

const instance = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": true,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

async function fetchSubRole() {
  try {
    const response = await instance.get("/api/subroles");
    const subRoles = response.data.data;
    const foundSubRole = subRoles.find((role) => role.idSubRole === idSubRole);
    if (foundSubRole) {
      subRoleName.value = foundSubRole.subRoleName;
    } else {
      console.warn(`SubRole dengan id ${idSubRole} tidak ditemukan`);
    }
  } catch (error) {
    console.error("Error fetching subroles:", error.message);
  }
}

watch(
  () => route.meta.title,
  (newTitle) => {
    title.value = newTitle;
  },
  { immediate: true }
);

onMounted(() => {
  if (idSubRole) {
    fetchSubRole();
  }
});
</script>
<style scoped>
.custom-navbar {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e2e6ea;
  overflow: hidden;
}

.custom-navbar .container-fluid {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.custom-navbar .navbar-brand {
  font-weight: bold;
  font-size: 1rem;
}

.custom-navbar .scrollable-navbar-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.custom-navbar .navbar-text {
  font-size: 0.875rem;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.custom-navbar .navbar-text i {
  margin-right: 0.5rem;
}

@media (max-width: 992px) {
  .custom-navbar .navbar-brand {
    font-size: 0.875rem;
  }

  .custom-navbar .navbar-text {
    font-size: 0.75rem;
  }
}
</style>
