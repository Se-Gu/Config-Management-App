<template>
  <div class="theme-modal overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Are you sure?</h5>
          <button type="button" class="btn-close" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete
          <strong>{{ parameter?.parameterKey }}</strong
          >? This action cannot be undone.
        </div>
        <div class="modal-footer d-flex">
          <button type="button" class="btn cancel-btn" @click="close">
            Cancel
          </button>
          <button type="button" class="btn delete-btn" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useParameterStore } from "../stores/parameterStore";

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

const parameterStore = useParameterStore();

const close = () => {
  props.onClose();
};

const confirmDelete = async () => {
  if (props.parameter?.parameterKey) {
    await parameterStore.deleteParameter(props.parameter.parameterKey);
    close();
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

.theme-modal .modal-content {
  background-color: #252a41;
  color: #d1d5db;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #3a3f5b;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  overflow-y: auto;
  max-height: 90vh;
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
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.modal-body {
  font-size: 1rem;
  line-height: 1.5;
}

.modal-footer {
  margin-top: 15px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  background-color: transparent;
  color: #9ca3af;
  border: 1px solid #9ca3af;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #9ca3af;
  color: #252a41;
}

.delete-btn {
  background: linear-gradient(to right, #f23d49, #f74c6f);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: linear-gradient(to right, #d73541, #e2455d);
}
</style>
