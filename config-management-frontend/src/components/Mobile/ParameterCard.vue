<template>
  <div class="card parameter-card">
    <div class="content">
      <div class="row mb-2">
        <div class="col-12">
          <p><strong>Parameter Key:</strong> {{ item.parameterKey }}</p>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-12">
          <p><strong>Value:</strong> {{ item.value }}</p>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-12">
          <p><strong>Description:</strong> {{ item.description }}</p>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-12">
          <p><strong>Created At:</strong> {{ formattedDate }}</p>
        </div>
      </div>
    </div>
    <div class="row mt-3 button-container">
      <div class="col-12 d-flex justify-content-center">
        <button class="btn edit" @click="openEditModal">Edit</button>
        <button class="btn delete" @click="openDeleteModal">Del</button>
      </div>
    </div>

    <MobileEditParameterModal
      v-if="showEditModal"
      :item="item"
      :onClose="closeEditModal"
    />

    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :parameter="item"
      :onClose="closeDeleteModal"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import DeleteConfirmationModal from "../DeleteConfirmationModal.vue";
import MobileEditParameterModal from "./MobileEditParameterModal.vue";

export default defineComponent({
  name: "ParameterCard",
  components: { DeleteConfirmationModal, MobileEditParameterModal },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        parameterKey: "",
        value: "",
        description: "",
        createdAt: "",
      }),
    },
    formatDate: {
      type: Function,
      default: (date) => new Date(date).toLocaleString(),
    },
  },
  setup(props) {
    const showDeleteModal = ref(false);
    const showEditModal = ref(false);

    const formattedDate = computed(() =>
      props.formatDate(props.item.createdAt)
    );

    const openDeleteModal = () => {
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
    };

    const openEditModal = () => {
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
    };

    return {
      showDeleteModal,
      showEditModal,
      formattedDate,
      openDeleteModal,
      closeDeleteModal,
      openEditModal,
      closeEditModal,
    };
  },
});
</script>

<style scoped>
.parameter-card {
  border: 1px solid white;
  border-radius: 20px;
  padding: 20px;
  background-color: transparent;
  color: #bebec1;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

p {
  margin: 0.5px 0;
}

.button-container {
  margin-top: auto;
}

.edit,
.delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.9rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
  margin: 0 10px;
}

.edit {
  background: linear-gradient(to right, #3164f5, #267cf6);
}

.edit:hover {
  background: linear-gradient(to right, #2f5ed1, #246dd3);
}

.delete {
  background: linear-gradient(to right, #f23d49, #f74c6f);
}

.delete:hover {
  background: linear-gradient(to right, #d73541, #e2455d);
}
</style>
