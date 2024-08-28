<template>
  <div class="dashboard">
    <Sidebar @updateTitle="updateTitle" />
    <div class="main-content">
      <Navbar :title="title" />
      <div class="content-before-form" v-if="!showForm">
        <div class="intro-content">
          <div class="intro-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              style="margin-left: 10px; width: 70px"
              @click="toggleForm(null)"
            >
              + New
            </button>
            <div class="search-container">
              <input
                type="text"
                v-model="searchQuery"
                class="search-input"
                placeholder="Search by Name"
              />
            </div>
          </div>
          <div class="item-list">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th class="col-no" style="text-align: center">No</th>
                    <th class="col-name">Name</th>
                    <th
                      class="col-actions"
                      style="text-align: center; width: 10%"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in filteredData"
                    :key="item.idSubRole"
                  >
                    <td class="col-no" style="text-align: center">
                      {{ startingNumber + index }}
                    </td>
                    <td class="col-name">{{ item.subRoleName }}</td>
                    <td class="col-actions" style="text-align: center">
                      <button
                        class="btn btn-warning btn-sm me-2"
                        @click="editItem(item)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>

                      <button
                        class="btn btn-danger btn-sm me-2"
                        @click="deleteItem(item.idRole, item.idSubRole)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredData.length === 0 && searchQuery !== ''">
                    <td colspan="3" style="text-align: center">
                      No matching records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <div class="d-flex justify-content-center">
              <ul class="pagination">
               
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    aria-label="Previous"
                    @click.prevent="previousPage"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>

                
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">
                    {{ page }}
                  </a>
                </li>

                
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
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>
      <div class="form-wrapper" v-if="showForm">
        <div class="form-container">
          <form class="input" @submit.prevent="save">
            <div class="mb-3">
              <label for="idRole" class="form-label">Id Role</label>
              <select
                v-if="editIndex === null"
                class="form-control form-control-sm small-input"
                id="idRole"
                v-model="form.idRole"
              >
                <option value="" disabled>Select Role</option>
                <option
                  v-for="role in roles"
                  :key="role.idRole"
                  :value="role.idRole"
                  style="text-align: center"
                >
                  {{ role.idRole }}
                </option>
              </select>
              <input
                v-else
                type="text"
                class="form-control form-control-sm small-input"
                id="idRole"
                v-model="form.idRole"
                :disabled="true"
                required
              />
            </div>
            <div class="mb-3">
              <label for="subRoleName" class="form-label">SubRole Name</label>
              <input
                type="text"
                class="form-control"
                id="subRoleName"
                v-model="form.subRoleName"
                placeholder="Enter SubRole Name"
                required
              />
            </div>
            <button type="submit" class="btn btn-anchor">
              {{ editIndex !== null ? "Update" : "Submit" }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="toggleForm(null)"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
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
    const title = ref("SubRole");
    const form = ref({
      idRole: "",
      subRoleName: "",
    });
    const showForm = ref(false);
    const editIndex = ref(null);
    const data = ref([]);
    const allData = ref([]);
    const roles = ref([]);
    const limit = 10;
    const searchQuery = ref("");
    const offset = ref(0);
    const totalPages = ref(1);
    const isLoadingIdRole = ref(false);

    const baseURL =
      "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/";
    const token = localStorage.getItem("token");
    const instance = axios.create({
      baseURL,
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${token}`,
      },
    });

    const filteredData = computed(() => {
      const searchTerm = searchQuery.value.toLowerCase();
      return allData.value
        .filter((item) => item.subRoleName.toLowerCase().includes(searchTerm))

        .slice(offset.value, offset.value + limit);
    });

    async function fetchIdRoles() {
      isLoadingIdRole.value = true;
      try {
        const idRoleResponse = await instance.get("/api/roles/");
        if (idRoleResponse.data && idRoleResponse.data.data.length > 0) {
          const ids = idRoleResponse.data.data.map((role) => role.idRole);
          roles.value = idRoleResponse.data.data;
          const fetchDataPromises = ids.map((id) => fetchData(id));
          await Promise.all(fetchDataPromises);
        } else {
          console.error("No valid idRole found in the response");
        }
      } catch (error) {
        console.error("Error fetching idRole:", error);
      } finally {
        isLoadingIdRole.value = false;
      }
    }

    async function fetchData(idRole) {
      try {
        const response = await instance.get(`/api/roles/${idRole}/subroles`);
        if (!allData.value) {
          allData.value = [];
        }

        console.log("API response:", response.data);
        allData.value = allData.value.concat(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    onMounted(fetchIdRoles);

    watch([limit, searchQuery], () => {
      offset.value = 0;
      data.value = filteredData.value.slice(offset.value, offset.value + limit);
      totalPages.value = Math.ceil(filteredData.value.length / limit);
    });
    function previousPage() {
      offset.value = Math.max(offset.value - limit, 0);
      fetchData();
    }

    function nextPage() {
      offset.value += limit;
      fetchData();
    }
    function goToPage(page) {
      offset.value = (page - 1) * limit;
      fetchData();
    }

    const currentPage = computed(() => {
      return Math.ceil(offset.value / limit) + 1;
    });

    const isLastPage = computed(() => {
      const isLastPageBasedOnCount = currentPage.value >= totalPages.value;
      const isLastPageBasedOnData = data.value.length < limit;
      return isLastPageBasedOnCount || isLastPageBasedOnData;
    });

    function toggleForm(item) {
      if (item) {
        editIndex.value = item.idSubRole;
        form.value.idRole = item.idRole;
        form.value.subRoleName = item.subRoleName;
      } else {
        editIndex.value = null;
        form.value.idRole = "";
        form.value.subRoleName = "";
      }
      showForm.value = !showForm.value;
    }

    async function save() {
      if (!form.value.idRole || !form.value.subRoleName) {
        alert("Please fill in all fields.");
        return;
      }
      try {
        let response;
        if (editIndex.value !== null) {
          response = await instance.put(
            `/api/roles/${form.value.idRole}/subroles/${editIndex.value}`,
            {
              subRoleName: form.value.subRoleName,
            }
          );

          const updatedItemIndex = data.value.findIndex(
            (item) => item.idSubRole === editIndex.value
          );
          if (updatedItemIndex !== -1) {
            data.value[updatedItemIndex] = response.data.data;
            const allDataIndex = allData.value.findIndex(
              (item) => item.idSubRole === editIndex.value
            );
            if (allDataIndex !== -1) {
              allData.value[allDataIndex] = response.data.data;
            }
          }

          await Swal.fire({
            title: "Success!",
            text: "Sub Role has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await instance.post(
            `/api/roles/${form.value.idRole}/subroles`,
            {
              idRole: form.value.idRole,
              subRoleName: form.value.subRoleName,
            }
          );

          data.value.push(response.data.data);
          allData.value.push(response.data.data);
          await Swal.fire({
            title: "Success!",
            text: "Sub Role has been succsessfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        toggleForm(null);
      } catch (error) {
        console.error("Error saving subRole:", error);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to save the Sub Role. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function editItem(item) {
      toggleForm(item);
    }

    async function deleteItem(idRole, idSubRole) {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
        });

        if (result.isConfirmed) {
          const response = await instance.delete(
            `/api/roles/${idRole}/subroles/${idSubRole}`
          );

          if (response.status === 200) {
            data.value = data.value.filter(
              (item) => item.idSubRole !== idSubRole
            );
            allData.value = allData.value.filter(
              (item) => item.idSubRole !== idSubRole
            );

            await Swal.fire({
              title: "Deleted!",
              text: "Sub Role has been successfully deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            console.error(
              `Failed to delete subRole with ID ${idSubRole}. Status: ${response.status}`
            );
            await Swal.fire({
              title: "Failed!",
              text: `Failed to delete Sub Role. Status code: ${response.status}`,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        console.error(`Error deleting subRole ${idSubRole}:`, error);

        await Swal.fire({
          title: "Failed!",
          text: "Failed to delete the Sub Role. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function search() {
      offset.value = 0;
    }
    const startingNumber = computed(() => {
      return (currentPage.value - 1) * limit + 1;
    });

    return {
      startingNumber,
      title,
      form,
      showForm,
      editIndex,
      data,
      allData,
      roles,
      limit,
      offset,
      totalPages,
      searchQuery,
      isLoadingIdRole,
      filteredData,
      currentPage,
      isLastPage,
      toggleForm,
      save,
      editItem,
      deleteItem,
      search,
      previousPage,
      nextPage,
      goToPage,
    };
  },
};
</script>

<style scoped lang="scss">
* {
  font-family: "Roboto", sans-serif;
}
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
.intro-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  margin-left: 10px;
}
.search-container {
  margin-right: 20px;
}
.search-container {
  margin-right: 20px;
  display: flex;
  justify-content: center;
}

.search-input {
  height: 40px;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 14px;
  width: 100%;
  max-width: 400px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input::placeholder {
  color: #6c757d;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}
.item-list {
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  overflow-x: auto;
}

.table-container {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0px;
  width: 100%;
  margin: 20px auto;
  border-radius: 10px;
  overflow-x: auto;
  overflow-y: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.table th,
.table td {
  border: 1px solid #dee2e6;
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

.table th,
.table td {
  padding: 8px;
  text-align: left;
}
.main-content {
  background: #e5e5e5;
}

.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.form-container {
  width: 80%;
  max-width: 500px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mb-3 {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  color: #333;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group-text {
  background: #1565d8;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.25rem 0 0 0.25rem;
  height: 60px;
}

.form-control {
  height: 60px;
  border: 1px solid #ced4da;
  border-radius: 0 0.25rem 0.25rem 0;
  padding-left: 0.5rem;
}

.small-input {
  width: 100px;
  height: 60px;
}

.btn-anchor {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #007bff;
  transition: background-color 0.15s ease-in-out;
}

.btn-anchor:hover {
  background-color: #0056b3;
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
  margin-left: 20px;
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

.col-no {
  width: 2%;
  text-align: center;
}

.col-name {
  width: 60%;
}

.col-actions {
  width: 10%;
}
</style>