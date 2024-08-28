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
                  <tr
                    v-for="(item, index) in filteredData"
                    :key="item.idProduct"
                  >
                    <td style="text-align: center">
                      {{ startingNumber + index }}
                    </td>
                    <td>{{ item.productName }}</td>
                    <td class="status-cell" style="text-align: center">
                      <div v-if="editingStatusId === item.idProduct">
                        <select
                          v-model="editingStatus"
                          @change="
                            updateStatus(
                              item.idProduct,
                              editingStatus,
                              item.productName
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
                        @click="startEditingStatus(item.idProduct, item.status)"
                        :class="{
                          'status-active': item.status === 'Active',
                          'status-inactive': item.status === 'Inactive',
                        }"
                      >
                        {{ item.status }}
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
                        @click="deleteItem(item.idProduct)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>

                      <button
                        class="btn btn-info btn-sm me-2"
                        @click="viewDetails(item)"
                      >
                        <i class="bi bi-eye"></i>
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

            <div
              class="d-flex justify-content-start ml-5"
              v-if="!showDetailsModal"
            >
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
              <label for="productName" class="form-label">Name</label>
              <input
                type="text"
                v-model="form.productName"
                class="form-control"
                id="productName"
                placeholder="Enter Product Name"
                required
              />
            </div>

            <!-- Dropdown for Role Status -->
            <div class="mb-0 dropdown-wrapper">
              <label for="status" class="form-label">Status</label>
              <div class="input-group">
                <select
                  id="status"
                  v-model="form.status"
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
      <div
        v-if="showDetailsModal"
        class="modal-overlay"
        @click="showDetailsModal = false"
      >
        <div class="modal-content" @click.stop>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5>Product Details</h5>
            <button
              class="btn btn-danger"
              @click="
                deleteProductDetails(
                  productDetails.idProduct,
                  productDetails.idProductDetail
                )
              "
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <div class="details-table-container">
            <table class="details-table">
              <tbody>
                <tr>
                  <td colspan="3">
                    <div class="details-columns-container">
                      <!-- Section 1 -->
                      <div class="details-column">
                        <div>
                          <strong>UOM:</strong>
                          <span v-if="!isEditing">
                            {{ productDetails.uomName || "N/A" }}
                          </span>
                          <select
                            v-else
                            v-model="editableProductDetails.idUom"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 w-100 text-center"
                          >
                            <option value="" disabled>Select UOM</option>
                            <option
                              v-for="uom in uoms"
                              :key="uom.idUom"
                              :value="uom.idUom"
                            >
                              {{ uom.uomName }}
                            </option>
                          </select>
                        </div>
                        <div v-if="!productDetails.idProductDetail">
                          <strong>UOM Package:</strong>
                          <span v-if="!isEditing">
                            {{ productDetails.uomPackageName || "N/A" }}
                          </span>
                          <select
                            v-else
                            v-model="editableProductDetails.idUomPackage"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 w-100 text-center"
                          >
                            <option value="" disabled>Select UOM</option>
                            <option
                              v-for="uom in uomPackage"
                              :key="uom.idUomPackage"
                              :value="uom.idUomPackage"
                            >
                              {{ uom.uomPackageName }}
                            </option>
                          </select>
                        </div>

                        <div v-if="productDetails.idProductDetail">
                          <strong>Product Name:</strong>
                          <span v-if="!isEditing">
                            {{ productDetails.productName || "N/A" }}
                          </span>
                          <input
                            v-else
                            v-model="editableProductDetails.productName"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtin || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtin"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN Basket:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtinbasket || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtinbasket"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN Bundling:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtinbundling || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtinbundling"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN Master Box:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtinmasterbox || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtinmasterbox"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN Out Box:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtinoutbox || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtinoutbox"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>GTIN Wrapping:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.gtinwrapping || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.gtinwrapping"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Basket Qty:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.basketQty
                          }}</span>
                          <input
                            v-else
                            type="number"
                            v-model="editableProductDetails.basketQty"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Bundling Qty:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.bundlingQty
                          }}</span>
                          <input
                            v-else
                            type="number"
                            v-model="editableProductDetails.bundlingQty"
                            class="w-100"
                          />
                        </div>
                      </div>

                      <!-- Section 2 -->
                      <div class="details-column">
                        <div v-if="productDetails.idProductDetail">
                          <strong>UOM Package:</strong>
                          <span v-if="!isEditing">
                            {{ productDetails.uomPackageName || "N/A" }}
                          </span>
                          <select
                            v-else
                            v-model="editableProductDetails.idUomPackage"
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 w-100 text-center"
                          >
                            <option value="" disabled>Select UOM</option>
                            <option
                              v-for="uom in uomPackage"
                              :key="uom.idUomPackage"
                              :value="uom.idUomPackage"
                            >
                              {{ uom.uomPackageName }}
                            </option>
                          </select>
                        </div>

                        <div>
                          <strong>Distribution Flow Type:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.distributionFlowType || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="
                              editableProductDetails.distributionFlowType
                            "
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Dosis:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.dosis || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.dosis"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Min Temperature:</strong>
                          <span v-if="!isEditing">
                            {{
                              !isNaN(parseFloat(productDetails.minTemperature))
                                ? parseFloat(
                                    productDetails.minTemperature
                                  ).toFixed(2)
                                : "N/A"
                            }}
                          </span>
                          <input
                            v-else
                            type="number"
                            step="0.01"
                            v-model="editableProductDetails.minTemperature"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Max Temperature:</strong>
                          <span v-if="!isEditing">
                            {{
                              !isNaN(parseFloat(productDetails.maxTemperature))
                                ? parseFloat(
                                    productDetails.maxTemperature
                                  ).toFixed(2)
                                : "N/A"
                            }}
                          </span>
                          <input
                            v-else
                            type="number"
                            step="0.01"
                            v-model="editableProductDetails.maxTemperature"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Outbox Qty:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.outboxQty
                          }}</span>
                          <input
                            v-else
                            type="number"
                            v-model="editableProductDetails.outboxQty"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Wrapping Qty:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.wrappingQty
                          }}</span>
                          <input
                            v-else
                            type="number"
                            v-model="editableProductDetails.wrappingQty"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Is Auto Print:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.isAutoPrint ? "Yes" : "No"
                          }}</span>
                          <input
                            v-else
                            type="checkbox"
                            v-model="editableProductDetails.isAutoPrint"
                          />
                        </div>
                        <div>
                          <strong>Injection Interval:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.jedaPenyuntikan || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.jedaPenyuntikan"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Is SAS:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.isSas ? "Yes" : "No"
                          }}</span>
                          <input
                            v-else
                            type="checkbox"
                            v-model="editableProductDetails.isSas"
                          />
                        </div>
                        <div v-if="!productDetails.idProductDetail">
                          <strong>Is Vial:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.isVial ? "Yes" : "No"
                          }}</span>
                          <input
                            v-else
                            type="checkbox"
                            v-model="editableProductDetails.isVial"
                          />
                        </div>
                      </div>

                      <!-- Section 3 -->
                      <div class="details-column">
                        <div v-if="productDetails.idProductDetail">
                          <strong>Is Vial:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.isVial ? "Yes" : "No"
                          }}</span>
                          <input
                            v-else
                            type="checkbox"
                            v-model="editableProductDetails.isVial"
                          />
                        </div>
                        <div>
                          <strong>Lot Number:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.lotno || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.lotno"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Manufacture Country:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.manufacturcountry || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.manufacturcountry"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Product Type:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.productType || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.productType"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Product Flag:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.productflag || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.productflag"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Weight Product:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.weigthProduct || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.weigthProduct"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Kode SAS:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.kodesas || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.kodesas"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Label SAS:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.lblsas || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.lblsas"
                            class="w-100"
                          />
                        </div>
                        <div>
                          <strong>Penyuntikan:</strong>
                          <span v-if="!isEditing">{{
                            productDetails.penyuntikan || "N/A"
                          }}</span>
                          <input
                            v-else
                            v-model="editableProductDetails.penyuntikan"
                            class="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            v-if="isEditing"
            class="btn btn-warning btn-update"
            @click="saveProductDetails"
          >
            {{ productDetails.idProductDetail ? "Update" : "Save" }}
          </button>
          <button class="btn btn-secondary" @click="showDetailsModal = false">
            Close
          </button>
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
    const title = ref("Product");
    const form = ref({
      productName: "",
      status: "Active",
    });
    const editingStatusId = ref(null);
    const editingStatus = ref("");
    const showForm = ref(false);
    const editIndex = ref(null);
    const data = ref([]);
    const limit = 10;
    const searchQuery = ref("");
    const dropdownOpen = ref(false);
    const offset = ref(0);
    const totalPages = ref(1);
    const productDetails = ref(null);
    const showDetailsModal = ref(false);
    const isEditing = ref(false);
    const uomPackage = ref([]);
    const uoms = ref([]);
    const baseURL =
      "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/";
    const instance = axios.create({
      baseURL,
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const fetchData = async () => {
      try {
        const response = await instance.get("/api/products", {
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
    };

    async function fetchProductDetails(idProduct) {
      await fetchUoms();
      await fetchUomPackage();
      try {
        const response = await instance.get(
          `/api/products/${idProduct}/productdetails`
        );
        const productDetailsData = response.data.data;

        // Update nama UOM dan UOM Package
        const selectedUom = uoms.value.find(
          (uom) => uom.idUom === productDetailsData.idUom
        );
        if (selectedUom) {
          productDetailsData.uomName = selectedUom.uomName;
        }

        const selectedUomPackage = uomPackage.value.find(
          (uomPackage) =>
            uomPackage.idUomPackage === productDetailsData.idUomPackage
        );
        if (selectedUomPackage) {
          productDetailsData.uomPackageName = selectedUomPackage.uomPackageName;
        }

        return productDetailsData;
      } catch (error) {
        console.error("Error fetching product details:", error.message);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to fetch product details. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return null;
      }
    }

    const filteredData = computed(() => {
      const searchTerm = searchQuery.value.toLowerCase();
      return data.value.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm)
      );
    });
    async function fetchUoms() {
      try {
        const response = await instance.get("/api/uoms");
        uoms.value = response.data.data;
      } catch (error) {
        console.error("Error fetching UOMs:", error.message);
      }
    }
    async function fetchUomPackage() {
      try {
        const response = await instance.get("/api/uompackages");
        uomPackage.value = response.data.data;
      } catch (error) {
        console.error("Error fetching UOMs:", error.message);
      }
    }
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
        editIndex.value = item.idProduct;
        form.value.productName = item.productName;
        form.value.status = item.status;
      } else {
        editIndex.value = null;
        form.value.productName = "";
        form.value.status = "Active";
      }
      showForm.value = !showForm.value;
    }

    async function save() {
      if (!form.value.productName || !form.value.status) {
        alert("Please fill in all fields.");
        return;
      }
      try {
        let response;

        if (editIndex.value !== null) {
          response = await instance.put(`/api/products/${editIndex.value}`, {
            productName: form.value.productName,
            status: form.value.status,
          });
          const updatedItemIndex = data.value.findIndex(
            (item) => item.idProduct === editIndex.value
          );
          if (updatedItemIndex !== -1) {
            data.value[updatedItemIndex] = response.data.data;
          }

          await Swal.fire({
            title: "Success!",
            text: "Product has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          response = await instance.post("/api/products", {
            productName: form.value.productName,
            status: form.value.status,
          });
          data.value.push(response.data.data);

          await Swal.fire({
            title: "Success!",
            text: "Product has been successfully created.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        showForm.value = false;
        fetchData();
      } catch (error) {
        console.error("Error saving Product:", error.message);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to save Product. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    function startEditingStatus(idProduct, currentStatus) {
      editingStatusId.value = idProduct;
      editingStatus.value = currentStatus;
    }

    async function updateStatus(idProduct, newStatus, productName) {
      try {
        const response = await instance.put(`/api/products/${idProduct}`, {
          status: newStatus,
          productName: productName,
        });

        const updatedItemIndex = data.value.findIndex(
          (item) => item.idProduct === idProduct
        );
        if (updatedItemIndex !== -1) {
          data.value[updatedItemIndex].status = newStatus;
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

    async function deleteItem(idProduct) {
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
            await instance.delete(`/api/products/${idProduct}`);
            data.value = data.value.filter(
              (item) => item.idProduct !== idProduct
            );

            await Swal.fire({
              title: "Deleted!",
              text: "Product has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        });
      } catch (error) {
        console.error("Error deleting item:", error.message);
        await Swal.fire({
          title: "Failed!",
          text: "Failed to delete Product. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    const startingNumber = computed(() => offset.value + 1);

    async function viewDetails(item) {
      try {
        const response = await fetchProductDetails(item.idProduct);
        if (response) {
          productDetails.value = response;
          editableProductDetails.value = { ...productDetails.value };
          showDetailsModal.value = true;
          isEditing.value = true;
        } else {
          console.warn("No details found for product ID:", item.idProduct);
          productDetails.value = {
            idProduct: item.idProduct,
            productName: "",
            productDescription: "",
          };
          editableProductDetails.value = { ...productDetails.value };
          showDetailsModal.value = true;
          isEditing.value = true; // Set to true to enable editing mode directly
          await saveProductDetails(true);
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    }

    async function saveProductDetails() {
      try {
        console.log("Starting saveProductDetails function");

        const { maxTemperature, minTemperature } = editableProductDetails.value;
        if (
          (maxTemperature !== null && maxTemperature > 999) ||
          (minTemperature !== null && minTemperature > 999)
        ) {
          await Swal.fire({
            title: "Error",
            text: "A field with precision 5, scale 2 must round to an absolute value less than 10^3.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        const idProductDetail = editableProductDetails.value.idProductDetail;
        const idProduct = editableProductDetails.value.idProduct;

        if (!idProduct) {
          throw new Error("Product ID is missing.");
        }

        console.log(
          `Sending request to: /api/products/${idProduct}/productdetails/${
            idProductDetail || ""
          }`
        );
        console.log("Editable Product Details:", editableProductDetails.value);

        let response;
        if (idProductDetail) {
          response = await instance.patch(
            `/api/products/${idProduct}/productdetails`,
            editableProductDetails.value
          );
        } else {
          response = await instance.post(
            `/api/products/${idProduct}/productdetails`,
            editableProductDetails.value
          );
        }

        await Swal.fire({
          title: "Success!",
          text: idProductDetail
            ? "Product details updated successfully."
            : "Product details created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Update productDetails with response data
        productDetails.value = response.data.data;

        // Find the selected UOM name based on idUom
        const selectedUom = uoms.value.find(
          (uom) => uom.idUom === productDetails.value.idUom
        );
        if (selectedUom) {
          productDetails.value.uomName = selectedUom.uomName;
        }

        // Find the selected UOM package name based on idUomPackage
        const selectedUomPackage = uomPackage.value.find(
          (uom) => uom.idUomPackage === productDetails.value.idUomPackage
        );
        if (selectedUomPackage) {
          productDetails.value.uomPackageName =
            selectedUomPackage.uomPackageName;
        }

        isEditing.value = false;
        showForm.value = false; // Close form after saving
      } catch (error) {
        console.error("Error saving product details:", error.message);
        await Swal.fire({
          title: "Error",
          text: "Failed to save product details. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    const editableProductDetails = ref({});

    async function deleteProductDetails(idProduct, idProductDetail) {
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
          await instance.delete(`/api/products/${idProduct}/productdetails`);

          const index = data.value.findIndex(
            (item) => item.idProductDetail === idProductDetail
          );
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
        showDetailsModal.value = false;
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
    function startEditing() {
      isEditing.value = true;
      editableProductDetails.value = { ...productDetails.value };
    }

    function updateTitle(newTitle) {
      title.value = newTitle;
    }

    function editItem(item) {
      toggleForm(item);
    }

    return {
      startingNumber,
      editItem,
      title,
      form,
      editingStatusId,
      editingStatus,
      showForm,
      editIndex,
      data,
      searchQuery,
      limit,
      offset,
      filteredData,
      totalPages,
      currentPage,

      toggleForm,
      save,
      startEditingStatus,
      updateStatus,
      deleteItem,
      previousPage,
      nextPage,
      updateTitle,
      viewDetails,
      productDetails,
      showDetailsModal,
      isEditing,
      editableProductDetails,
      startEditing,
      saveProductDetails,
      uoms,
      uomPackage,
      deleteProductDetails,
      goToPage,
      totalPages,
      visiblePages,
      dropdownOpen,
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
.col-no {
  width: 4%;
  text-align: center;
}

.col-name {
  width: 35%;
}

.col-status {
  width: 20%;
}

.col-actions {
  width: 15%;
}
.details-table-container {
  overflow-x: auto;
  max-width: 100%;
  padding: 10px;
  height: 540px;
  position: relative;
}

.details-table {
  min-width: 500px;
  border-collapse: collapse;
  width: 80%;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.details-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.details-table strong {
  display: block;
  font-weight: 600;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 800px;
  margin: 50px auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.details-columns-container {
  display: flex;
  justify-content: space-between;
}

.details-column {
  width: 30%;
  display: flex;
  flex-direction: column;
}

.details-column div {
  border: 1px solid #ddd;
  padding: 1px;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  font-size: 9pt;
}

.btn-update {
  margin-bottom: 10px;
}

.details-column div:last-child {
  margin-bottom: 0;
}
.btn-edit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.custom-select:focus {
  outline: none;
}
</style>