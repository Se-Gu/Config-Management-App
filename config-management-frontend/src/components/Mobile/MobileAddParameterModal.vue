<template>
  <div class="theme-modal overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New Parameter</h5>
          <button type="button" class="btn-close" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3">
            <label for="parameterKey" class="form-label">Parameter Key</label>
            <input
              id="parameterKey"
              type="text"
              class="form-control input-field"
              v-model="parameterKey"
              placeholder="Enter parameter key"
            />
          </div>
          <div class="form-group mb-3">
            <label for="value" class="form-label">Value</label>
            <input
              id="value"
              type="text"
              class="form-control input-field"
              v-model="value"
              placeholder="Enter value"
            />
          </div>
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              class="form-control input-field"
              v-model="description"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer d-flex">
          <button type="button" class="btn cancel-btn" @click="close">
            Cancel
          </button>
          <button type="button" class="btn save-btn" @click="handleCreate">
            Add Parameter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useParameterStore } from "../../stores/parameterStore";

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
});

const parameterStore = useParameterStore();

const parameterKey = ref("");
const value = ref("");
const description = ref("");

const close = () => {
  props.onClose();
};

const handleCreate = async () => {
  if (
    !parameterKey.value.trim() ||
    !value.value.trim() ||
    !description.value.trim()
  ) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await parameterStore.createOrUpdateParameter(parameterKey.value, {
      parameterKey: parameterKey.value,
      value: value.value,
      description: description.value,
      createdAt: new Date().toISOString(),
    });
    close();
  } catch (error) {
    console.error("Failed to create parameter:", error);
  }
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});
onBeforeUnmount(() => {
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.theme-modal .modal-dialog {
  width: 90%;
  max-width: 500px;
  background-color: #252a41;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  max-height: 90vh;
}

.theme-modal .modal-content {
  background-color: #252a41;
  color: #d1d5db;
  border-radius: 20px;
  padding: 25px;
  border: 1px solid #3a3f5b;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-header .btn-close {
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.modal-body {
  font-size: 1.2rem;
  line-height: 1.6;
}

.modal-footer {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background-color: transparent;
  color: #9ca3af;
  border: 1px solid #9ca3af;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #9ca3af;
  color: #252a41;
}

.save-btn {
  background: linear-gradient(to right, #01b1e5, #01d8d1);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(to right, #019ac9, #00afa9);
}

.input-field {
  background-color: rgba(34, 40, 49, 0.9);
  border: 1px solid #4a4a6a;
  color: white;
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #e14eca;
  box-shadow: 0 0 5px rgba(199, 90, 255, 0.7);
  background-color: rgba(34, 40, 49, 0.9);
  color: white;
}

.input-field::placeholder {
  color: #7f7f7f;
}

textarea.input-field {
  min-height: 100px;
  resize: vertical;
}

@media (max-width: 768px) {
  .theme-modal .modal-dialog {
    width: 95%;
    max-width: 400px;
  }

  .modal-body {
    font-size: 1.1rem;
  }

  .input-field {
    padding: 10px 12px;
  }
}
</style>
