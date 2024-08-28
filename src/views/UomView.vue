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
                    <th class="col-action" style="text-align: center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredData" :key="item.idMenu">
                    <td class="text-center">
                      {{ startingNumber + index }}
                    </td>
                    <td>{{ item.uomName }}</td>
                    <td class="text-center">
                      <button
                        class="btn btn-warning btn-sm me-2"
                        @click="editItem(item)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>

                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteItem(item.idUom)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredData.length === 0 && searchQuery !== ''">
                    <td colspan="4" class="text-center">
                      No matching records found
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
      <div class="form-wrapper" v-if="showForm">
        <div class="form-container">
          <form class="input" @submit.prevent="save">
            <div class="mb-3">
              <label for="menuName" class="form-label">Name</label>
              <input
                type="text"
                v-model="form.uomName"
                class="form-control"
                placeholder="Enter Menu Name"
                id="menuName"
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
    const title = ref("Menu");
    const form = ref({
      uomName: "",
    });

    const token = localStorage.getItem("token");
    const showForm = ref(false);
    const editIndex = ref(null);
    const searchQuery = ref("");
    const data = ref([]);
    const limit = 5;
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
    async function fetchData() {
      try {
        const response = await instance.get("/api/uoms", {
          params: {
            limit,
            offset: offset.value,
          },
        });

        console.log("API response:", response.data);

        data.value = response.data.data || [];

        const totalItems = response.data.size || 0;

        totalPages.value = Math.max(1, Math.ceil(totalItems / limit));

        console.log("Total items:", totalItems);
        console.log("Calculated totalPages:", totalPages.value);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    onMounted(() => {
      fetchData();
    });

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
    function goToFirstPage() {
      goToPage(1);
    }

    function goToLastPage() {
      goToPage(totalPages.value);
    }

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
    function toggleForm(item) {
      if (item) {
        editIndex.value = item.idUom;
        form.value.uomName = item.uomName;
      } else {
        editIndex.value = null;
        form.value.uomName = "";
      }
      showForm.value = !showForm.value;
    }

    async function save() {
      try {
        let response;
        if (editIndex.value !== null) {
          response = await instance.put(`/api/uoms/${editIndex.value}`, {
            uomName: form.value.uomName,
          });
          const updatedItemIndex = data.value.findIndex(
            (item) => item.idUom === editIndex.value
          );
          if (updatedItemIndex !== -1) {
            data.value[updatedItemIndex] = response.data.data;
          }

          await Swal.fire({
            title: "Updated!",
            text: "Menu has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await instance.post("/api/uoms", {
            uomName: form.value.uomName,
          });
          data.value.push(response.data.data);

          await Swal.fire({
            title: "Success!",
            text: "Menu has been successfully created.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        toggleForm(null);
        fetchData();
      } catch (error) {
        console.error("Error saving menu:", error.message);
        await Swal.fire({
          title: "Failed",
          text: "Failed to save the menu. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    function editItem(item) {
      toggleForm(item);
    }
    async function deleteItem(idUom) {
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
          await instance.delete(`/api/uoms/${idUom}`);

          const index = data.value.findIndex((item) => item.idUom === idUom);
          if (index !== -1) {
            data.value.splice(index, 1);
          }

          await Swal.fire({
            title: "Deleted!",
            text: "Menu has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error deleting menu:", error.message);

        await Swal.fire({
          title: "Failed",
          text: "Failed to delete the menu. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    const filteredData = computed(() => {
      return data.value.filter((item) => {
        return item.uomName
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
      });
    });

    const startingNumber = computed(() => offset.value + 1);

    return {
      title,
      form,
      showForm,
      editIndex,
      searchQuery,
      data,
      limit,
      offset,
      totalPages,
      fetchData,
      toggleForm,
      save,
      deleteItem,
      previousPage,
      nextPage,
      currentPage,
      filteredData,
      startingNumber,
      editItem,
      goToPage,
      visiblePages,
      goToFirstPage,
      goToLastPage,
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
.col-no {
  width: 2%;
}

.col-name {
  width: 35%;
}

.col-label {
  width: 25%;
}

.col-action {
  width: 10%;
}
</style>