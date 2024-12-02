<template>
  <div class="container-fluid">
    <div class="row mb-3 gx-3 fs-4 text-header">
      <div class="col-md-3">Parameter Key</div>
      <div class="col-md-2">Value</div>
      <div class="col-md-3">Description</div>
      <div class="col-md-3 sortable-header" @click="toggleSort">
        Create Date
        <i v-if="sortDirection === 'asc'" class="fas fa-arrow-up-long"></i>
        <i v-else class="fas fa-arrow-down-long"></i>
      </div>
      <div class="col-md-1"></div>
    </div>

    <div
      class="row align-items-center mb-2 gx-3 text-col"
      v-for="(item, index) in sortedParameterArray"
      :key="index"
    >
      <div class="col-md-3" :title="item.parameterKey">
        {{ item.parameterKey }}
      </div>
      <div class="col-md-2 value" :title="String(item.value)">
        {{ item.value }}
      </div>
      <div class="col-md-3 description" :title="item.description">
        {{ item.description }}
      </div>
      <div class="col-md-3" :title="formatDate(item.createdAt)">
        {{ formatDate(item.createdAt) }}
      </div>
      <div class="col-md-1 d-flex justify-content-around">
        <button class="btn edit" @click="openEditModal(item)">Edit</button>
        <button class="btn delete" @click="openDeleteModal(item)">
          Delete
        </button>
      </div>
    </div>

    <div class="row gx-3">
      <div class="col-md-3">
        <input
          type="text"
          class="form-control input-field"
          v-model="newParameterKey"
          placeholder="New Parameter"
        />
      </div>
      <div class="col-md-2">
        <input
          type="text"
          class="form-control input-field"
          v-model="newValue"
          placeholder="Value"
        />
      </div>
      <div class="col-md-6">
        <input
          type="text"
          class="form-control input-field wide"
          v-model="newDescription"
          placeholder="Description"
        />
      </div>
      <div class="col-md-1">
        <button @click="addParameter" class="btn add">ADD</button>
      </div>
    </div>

    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :parameter="selectedParameter || {}"
      :onClose="closeDeleteModal"
    />

    <DesktopEditModal
      v-if="showEditModal"
      :parameter="selectedParameter || {}"
      :onClose="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DeleteConfirmationModal from "../DeleteConfirmationModal.vue";
import DesktopEditModal from "./DesktopEditParameterModal.vue";
import { formatDate, validateData } from "../../utils";
import { Parameter } from "../../types/Parameter";
import { useParameterStore } from "../../stores/parameterStore";
import { addParameterSchema } from "../../validationSchemas";

const parameterStore = useParameterStore();

const sortDirection = ref("asc");
const sortedParameterArray = computed(() => {
  return [...parameterStore.parameters].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection.value === "asc" ? dateA - dateB : dateB - dateA;
  });
});

const toggleSort = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
};

const newParameterKey = ref("");
const newValue = ref("");
const newDescription = ref("");

const addParameter = async () => {
  const formData = {
    key: newParameterKey.value,
    value: newValue.value,
    description: newDescription.value,
  };

  const isValid = await validateData(formData, addParameterSchema);
  if (!isValid) return;

  try {
    await parameterStore.createOrUpdateParameter(newParameterKey.value, {
      parameterKey: newParameterKey.value,
      value: newValue.value,
      description: newDescription.value,
      createdAt: new Date().toISOString(),
    });
    newParameterKey.value = "";
    newValue.value = "";
    newDescription.value = "";
  } catch (error) {
    console.error("Error adding parameter:", error);
  }
};

const showDeleteModal = ref(false);
const selectedParameter = ref<Parameter | null>(null);

const openDeleteModal = (item: Parameter) => {
  selectedParameter.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const showEditModal = ref(false);

const openEditModal = (item: Parameter) => {
  selectedParameter.value = item;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};
</script>

<style scoped>
.text-header {
  color: #778ba3;
}

.text-col {
  color: #d2d2d4;
}

.sortable-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #73869e;
}

.btn {
  height: 38px;
  padding: 0.5rem 1rem;
  margin-right: 10px;
  color: white;
  font-weight: 550;
}

.btn.edit {
  background: linear-gradient(to right, #3164f5, #267cf6);
}

.btn.edit:hover {
  background: linear-gradient(to right, #2f5ed1, #246dd3);
}

.btn.delete {
  background: linear-gradient(to right, #f23d49, #f74c6f);
}

.btn.delete:hover {
  background: linear-gradient(to right, #d73541, #e2455d);
}

.btn.add {
  background: linear-gradient(to right, #01b1e5, #01d8d1);
}

.btn.add:hover {
  background: linear-gradient(to right, #019ac9, #00afa9);
}

.input-field {
  background-color: rgba(34, 40, 49, 0.8);
  border: 1px solid #4a4a6a;
  color: white;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #e14eca;
  box-shadow: 0 0 5px rgba(199, 90, 255, 0.7);
  background-color: rgba(34, 40, 49, 0.8);
  color: white;
}

.input-field::placeholder {
  color: #7f7f7f;
}

.input-field.wide {
  grid-column: span 2;
}

.container-fluid {
  padding-right: 100px;
  padding-left: 70px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.value,
.description {
  overflow: hidden;
}
</style>
