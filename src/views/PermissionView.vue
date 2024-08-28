<template>
  <div class="dashboard">
    <Sidebar @updateTitle="updateTitle" />
    <div class="main-content">
      <Navbar :title="title" />
      <div class="content-before-form">
        <div class="intro-content">
          <div class="mb-3">
            <div class="d-inline-block ms-3 mt-3" style="width: 200px">
              <select
                id="subroleMenu"
                class="form-select form-select-sm"
                v-model="selectedSubroleMenu"
                @change="handleSubroleChange"
              >
                <option value="" disabled>Select a SubRole</option>
                <option value="all">All SubRoles</option>
                <option
                  v-for="subrole in subRole"
                  :key="subrole.idSubRole"
                  :value="subrole.idSubRole"
                >
                  {{ subrole.subRoleName }}
                </option>
              </select>
            </div>
          </div>
          <div class="item-list">
            <div class="table-container" v-if="paginatedData.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th class="col-no" style="text-align: center">No</th>
                    <th class="col-menu">Name Menu</th>
                    <th class="col-subrole">Label Menu</th>
                    <th class="col-permission" style="text-align: center">
                      Create
                    </th>
                    <th class="col-permission" style="text-align: center">
                      Update
                    </th>
                    <th class="col-permission" style="text-align: center">
                      Delete
                    </th>
                    <th class="col-permission" style="text-align: center">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in paginatedData" :key="item.idMenu">
                    <td class="col-no" style="text-align: center">
                      {{ startingNumber + index }}
                    </td>
                    <td class="col-menu">{{ item.menuName }}</td>
                    <td class="col-subrole">{{ item.labelMenu }}</td>
                    <td class="col-permission" style="text-align: center">
                      <input
                        type="checkbox"
                        :checked="item.createPermission"
                        @change="
                          updatePermission(item, 'createPermission', $event)
                        "
                      />
                    </td>
                    <td class="col-permission" style="text-align: center">
                      <input
                        type="checkbox"
                        :checked="item.updatePermission"
                        @change="
                          updatePermission(item, 'updatePermission', $event)
                        "
                      />
                    </td>
                    <td class="col-permission" style="text-align: center">
                      <input
                        type="checkbox"
                        :checked="item.deletePermission"
                        @change="
                          updatePermission(item, 'deletePermission', $event)
                        "
                      />
                    </td>
                    <td class="col-permission" style="text-align: center">
                      <input
                        type="checkbox"
                        :checked="item.viewPermission"
                        @change="
                          updatePermission(item, 'viewPermission', $event)
                        "
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-start ml-5">
              <ul class="pagination">
                <!-- Tombol First Page -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    aria-label="First"
                    @click.prevent="goToFirstPage"
                  >
                    <span aria-hidden="true">«</span>
                  </a>
                </li>

                <!-- Tombol Previous -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    aria-label="Previous"
                    @click.prevent="previousPage"
                  >
                    <span aria-hidden="true">‹</span>
                  </a>
                </li>

                <!-- Nomor Halaman -->
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">
                    {{ page }}
                  </a>
                </li>

                <!-- Tombol Next (single line) -->
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    aria-label="Next"
                    @click.prevent="nextPage"
                  >
                    <span aria-hidden="true">›</span>
                  </a>
                </li>

                <!-- Tombol Last Page -->
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    aria-label="Last"
                    @click.prevent="goToLastPage"
                  >
                    <span aria-hidden="true">»</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import Swal from "sweetalert2";

export default {
  components: {
    Sidebar,
    Navbar,
  },
  setup() {
    const selectedSubroleMenu = ref("all");

    const token = localStorage.getItem("token");
    const title = ref("Menu");

    const subRole = ref([]);
    const menu = ref([]);
    const data = ref([]);
    const limit = 10;
    const offset = ref(0);
    const totalPages = ref(1);
    const baseURL =
      "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/";
    const instance = axios.create({
      baseURL,
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${token}`,
      },
    });

    async function fetchSubRole() {
      try {
        const response = await instance.get("/api/subroles");
        subRole.value = response.data.data;
      } catch (error) {
        console.error("Error fetching subroles:", error.message);
      }
    }

    async function fetchMenu() {
      try {
        const response = await instance.get("/api/menus", {
          params: {
            limit,
            offset: offset.value,
          },
        });

        menu.value = response.data.data || [];
        const totalItems = response.data.size || 0;
        totalPages.value = Math.max(1, Math.ceil(totalItems / limit));
        console.log("Total pages calculated:", totalPages.value);
        console.log("Total pages :", totalItems);
      } catch (error) {
        console.error("Error fetching menu:", error.message);
      }
    }

    async function fetchData() {
      try {
        const params = {
          limit,
          offset: offset.value,
          subrole:
            selectedSubroleMenu.value === "all"
              ? undefined
              : selectedSubroleMenu.value,
        };

        console.log("Request params:", params);

        const response = await instance.get("/api/menupermissions", { params });
        console.log("API Response:", response.data);

        const fetchedData = response.data.data.map((item) => ({
          ...item,
          createPermission: item.createPermission === 1,
          updatePermission: item.updatePermission === 1,
          deletePermission: item.deletePermission === 1,
          viewPermission: item.viewPermission === 1,
        }));

        const menuResponse = await instance.get("/api/menus");
        const allMenus = menuResponse.data.data || [];

        if (fetchedData.length === 0 && selectedSubroleMenu.value !== "all") {
          data.value = allMenus.map((menu) => ({
            ...menu,
            createPermission: 0,
            updatePermission: 0,
            deletePermission: 0,
            viewPermission: 0,
          }));
        } else {
          const dataMap = new Map();

          allMenus.forEach((menu) => {
            dataMap.set(menu.idMenu, {
              ...menu,
              createPermission: 0,
              updatePermission: 0,
              deletePermission: 0,
              viewPermission: 0,
            });
          });

          fetchedData.forEach((item) => {
            dataMap.set(item.idMenu, {
              ...dataMap.get(item.idMenu),
              ...item,
            });
          });

          data.value = Array.from(dataMap.values());
        }

        console.log("Data set to data.value:", data.value);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    function handleSubroleChange() {
      if (selectedSubroleMenu.value === "all") {
        offset.value = 0;
      }
      fetchData();
    }
    watch(totalPages, (newTotalPages) => {
      if (currentPage.value > newTotalPages) {
        goToPage(newTotalPages);
      }
    });

    onMounted(() => {
      fetchSubRole();
      fetchMenu();
      fetchData();
    });

    function previousPage() {
      if (currentPage.value > 1) {
        offset.value = Math.max(offset.value - limit, 0);
        fetchData();
      }
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        offset.value += limit;
        fetchData();
      }
    }

    function goToPage(pageNumber) {
      offset.value = (pageNumber - 1) * limit;
      fetchData();
    }

    function goToFirstPage() {
      goToPage(1);
    }

    function goToLastPage() {
      goToPage(totalPages.value);
    }

    const startingNumber = computed(() => offset.value + 1);

    const currentPage = computed(() => Math.ceil(offset.value / limit) + 1);

    const visiblePages = computed(() => {
      const pages = [];
      const startPage = Math.floor((currentPage.value - 1) / 5) * 5 + 1;
      const endPage = Math.min(startPage + 4, totalPages.value);

      for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
      }
      return pages;
    });

    async function updatePermission(item, permissionType, event) {
      const updatedValue = event.target.checked ? 1 : 0;
      const idSubrole = selectedSubroleMenu.value || 0;

      try {
        const result = await Swal.fire({
          title: "Confirm",
          text: "Do you want to update the data?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
        });

        if (!result.isConfirmed) {
          event.target.checked = !event.target.checked;
          return;
        }

        await instance.put(
          `/api/menus/${item.idMenu}/subroles/${idSubrole}/menupermission`,
          {
            [permissionType]: updatedValue,
          }
        );
        item[permissionType] = updatedValue === 1;
        Swal.fire("Updated!", "Data successfully updated.", "success");
      } catch (error) {
        console.error("Error updating permission:", error.message);
        event.target.checked = !event.target.checked;
        Swal.fire("Failed!", "Failed to update data.", "error");
      }
    }

    function updateTitle(newTitle) {
      title.value = newTitle;
    }

    const filteredData = computed(() => {
      let filtered = [...data.value];

      if (selectedSubroleMenu.value !== "all") {
        filtered = filtered.map((item) => {
          if (item.idSubRole === Number(selectedSubroleMenu.value)) {
            return item;
          } else {
            return {
              ...item,
              createPermission: 0,
              updatePermission: 0,
              deletePermission: 0,
              viewPermission: 0,
            };
          }
        });
      } else {
        filtered = filtered.map((item) => ({
          ...item,
          createPermission: 0,
          updatePermission: 0,
          deletePermission: 0,
          viewPermission: 0,
        }));
      }

      console.log("Filtered Data:", filtered);

      return filtered;
    });

    const paginatedData = computed(() => {
      const dataToPaginate = filteredData.value;
      if (!dataToPaginate || dataToPaginate.length === 0) {
        return [];
      }
      const start = offset.value;
      const end = offset.value + limit;
      return dataToPaginate.slice(start, end);
    });

    function handlePageChange(newPage) {
      offset.value = (newPage - 1) * limit;
      fetchData();
    }

    return {
      handlePageChange,
      startingNumber,
      title,
      data,
      currentPage,
      fetchData,
      previousPage,
      nextPage,
      updatePermission,
      updateTitle,
      selectedSubroleMenu,
      subRole,
      paginatedData,
      handleSubroleChange,
      goToPage,
      totalPages,
      visiblePages,
      fetchMenu,
      goToFirstPage,
      goToLastPage,
    };
  },
};
</script>
 

<style scoped lang="scss">
.dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  position: fixed;
  height: 100%;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.main-content {
  flex-grow: 1;
  overflow-x: auto;
  overflow-y: auto;
  background: #e5e5e5;
  transition: margin-left 0.3s ease;
}

.table-container {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0px;
  width: 100%;
  margin: 20px auto;
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: hidden;
}

.table {
  width: 100%;
  border-collapse: separate;
  min-width: 800px;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #0187ea;
  color: #e5e5e5;
  font-weight: bold;
  font-size: 16px;
}

.table td {
  font-size: 14px;
}

* {
  font-family: "Roboto", sans-serif;
}

.pagination-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-left: 10px;
}

.pagination-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
  margin-left: 10px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

.pagination-btn:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #333;
  margin: 0 10px;
}
</style>
