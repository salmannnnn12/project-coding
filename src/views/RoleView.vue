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
                    <th class="col-status" style="text-align: center">
                      Status
                    </th>
                    <th class="col-actions" style="text-align: center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody v-if="data.length > 0">
                  <tr v-for="(item, index) in filteredData" :key="item.idRole">
                    <td style="text-align: center">
                      {{ startingNumber + index }}
                    </td>
                    <td>{{ item.roleName }}</td>
                    <td class="status-cell" style="text-align: center">
                      <div v-if="editingStatusId === item.idRole">
                        <select
                          v-model="editingStatus"
                          @change="
                            updateStatus(
                              item.idRole,
                              editingStatus,
                              item.roleName
                            )
                          "
                          class="form-select"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div
                        v-else
                        @click="
                          startEditingStatus(item.idRole, item.roleStatus)
                        "
                        :class="{
                          'status-active': item.roleStatus === 'Active',
                          'status-inactive': item.roleStatus === 'Inactive',
                        }"
                      >
                        {{ item.roleStatus }}
                      </div>
                    </td>

                    <td style="text-align: center">
                      <button
                        class="btn btn-warning btn-sm me-2"
                        @click="editItem(item)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>

                      <button
                        class="btn btn-danger btn-sm me-2"
                        @click="deleteItem(item.idRole)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredData.length === 0 && searchQuery !== ''">
                    <td colspan="4" style="text-align: center">
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
              <label for="roleName" class="form-label">Name</label>
              <input
                type="text"
                v-model="form.roleName"
                class="form-control"
                id="roleName"
                placeholder="Enter Role Name"
                required
              />
            </div>

            <!-- Dropdown for Role Status -->
            <div class="mb-0 dropdown-wrapper">
              <label for="status" class="form-label">Status</label>
              <div class="input-group">
                <select
                  id="roleStatus"
                  v-model="form.roleStatus"
                  class="form-control"
                  style="width: 90%"
                  required
                  @focus="dropdownOpen = true"
                  @blur="dropdownOpen = false"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i
                      :class="
                        dropdownOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'
                      "
                    ></i>
                  </span>
                </div>
              </div>
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
    const title = ref("role");
    const form = ref({
      roleName: "",
      roleStatus: "Active",
    });
    const editingStatusId = ref(null);
    const editingStatus = ref("");
    const statusClass = ref("");
    const token = localStorage.getItem("token");
    const showForm = ref(false);
    const editIndex = ref(null);
    const data = ref([]);
    const limit = 10;
    const searchQuery = ref("");
    const dropdownOpen = ref(false);
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

    const fetchData = async (idSubRole) => {
      try {
        const response = await instance.get("/api/roles", {
          params: {
            limit,
            offset: offset.value,
            idSubRole,
          },
        });

        data.value = response.data.data || [];
        const totalItems = response.data.size || 0;
        totalPages.value = Math.max(1, Math.ceil(totalItems / limit));

        console.log("Total items:", totalItems);
        console.log("Calculated totalPages:", totalPages.value);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    const filteredData = computed(() => {
      const searchTerm = searchQuery.value.toLowerCase();
      return data.value.filter((item) =>
        item.roleName.toLowerCase().includes(searchTerm)
      );
    });

    onMounted(fetchData);

    watch(searchQuery, () => {
      offset.value = 0;
      fetchData();
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
        editIndex.value = item.idRole;
        form.value.roleName = item.roleName;
        form.value.roleStatus = item.roleStatus;
      } else {
        editIndex.value = null;
        form.value.roleName = "";
        form.value.roleStatus = "Active";
      }
      showForm.value = !showForm.value;
    }

    async function save() {
      if (!form.value.roleName || !form.value.roleStatus) {
        alert("Please fill in all fields.");
        return;
      }
      try {
        let response;

        if (editIndex.value !== null) {
          response = await instance.put(`/api/roles/${editIndex.value}`, {
            roleName: form.value.roleName,
            roleStatus: form.value.roleStatus,
          });
          const updatedItemIndex = data.value.findIndex(
            (item) => item.idRole === editIndex.value
          );
          if (updatedItemIndex !== -1) {
            data.value[updatedItemIndex] = response.data.data;
          }

          await Swal.fire({
            title: "Success!",
            text: "Role has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await instance.post("/api/roles", {
            roleName: form.value.roleName,
            roleStatus: form.value.roleStatus,
          });
          data.value.push(response.data.data);

          await Swal.fire({
            title: "Success!",
            text: "Role has been successfully created.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        showForm.value = false;
        fetchData();
      } catch (error) {
        console.error("Error saving role:", error.message);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to save role. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function startEditingStatus(idRole, currentStatus) {
      editingStatusId.value = idRole;
      editingStatus.value = currentStatus;
    }

    async function updateStatus(idRole, newStatus, roleName) {
      try {
        const response = await instance.put(`/api/roles/${idRole}`, {
          roleStatus: newStatus,
          roleName: roleName,
        });

        const updatedItemIndex = data.value.findIndex(
          (item) => item.idRole === idRole
        );
        if (updatedItemIndex !== -1) {
          data.value[updatedItemIndex].roleStatus = newStatus;
        }

        editingStatusId.value = null;

        await Swal.fire({
          title: "Success!",
          text: "Status updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error(
          "Error updating status:",
          error.response ? error.response.data : error.message
        );
        await Swal.fire({
          title: "Failed!",
          text: "Failed to update status. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    async function deleteItem(idRole) {
      try {
        await Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await instance.delete(`/api/roles/${idRole}`);
            data.value = data.value.filter((item) => item.idRole !== idRole);

            await Swal.fire({
              title: "Deleted!",
              text: "Role has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        });
      } catch (error) {
        console.error("Error deleting item:", error.message);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to delete role. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function updateTitle(newTitle) {
      title.value = newTitle;
    }
    function editItem(item) {
      toggleForm(item);
    }

    const startingNumber = computed(() => offset.value + 1);

    return {
      startingNumber,
      editItem,
      title,
      form,
      editingStatusId,
      editingStatus,
      statusClass,
      showForm,
      editIndex,
      data,
      searchQuery,
      limit,
      offset,
      filteredData,
      totalPages,
      currentPage,
      isLastPage,
      toggleForm,
      save,
      startEditingStatus,
      updateStatus,
      deleteItem,
      previousPage,
      nextPage,
      updateTitle,
      goToPage,
      dropdownOpen,
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
.table-container {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0px;
  width: 100%;
  margin: 20px auto;
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
.table td.status-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-active {
  color: white;
  background-color: greenyellow;
  padding: 5px 10px;
  border-radius: 10px;

  width: 100px;
  text-align: center;
}

.status-inactive {
  color: white;
  background-color: rgb(236, 79, 79);
  padding: 5px 10px;
  border-radius: 10px;

  width: 100px;
  text-align: center;
}

.dropdown-wrapper .input-group .form-control {
  border-right: 0;
}

.dropdown-wrapper .input-group .input-group-text {
  background-color: white;
  border-left: 0;
  cursor: pointer;
}

.dropdown-wrapper .input-group .input-group-text i {
  color: #495057;
  transition: transform 0.2s ease;
}

.dropdown-wrapper .input-group .input-group-text i.fa-chevron-up {
  transform: rotate(180deg);
}
.form-select {
  width: 100px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: rgb(233, 223, 223);
  padding: 5px 10px;
  border-radius: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
}
.col-no {
  width: 2%;
  text-align: center;
}

.col-name {
  width: 35%;
}

.col-status {
  width: 25%;
}

.col-actions {
  width: 10%;
}
</style>