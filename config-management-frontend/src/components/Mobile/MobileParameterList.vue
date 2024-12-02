<template>
  <div class="mobile-parameter-list">
    <div
      class="card add-card d-flex align-items-center justify-content-center"
      @click="showAddModal = true"
    >
      <span class="plus-sign">+</span>
    </div>

    <ParameterCard
      v-for="(item, index) in parameters"
      :key="index"
      :item="item"
      :formatDate="formatDate"
      @edit="editItem(index)"
      @delete="deleteItem(index)"
      class="item-card"
    />

    <MobileAddParameterModal v-if="showAddModal" :onClose="closeAddModal" />
  </div>
</template>

<script>
import { ref } from "vue";
import ParameterCard from "./ParameterCard.vue";
import MobileAddParameterModal from "./MobileAddParameterModal.vue";

export default {
  name: "MobileParameterList",
  components: {
    ParameterCard,
    MobileAddParameterModal,
  },
  props: {
    parameters: {
      type: Array,
      required: true,
      default: () => [],
    },
    formatDate: {
      type: Function,
      default: (date) => new Date(date).toLocaleString(),
    },
  },
  setup() {
    const showAddModal = ref(false);

    const closeAddModal = () => {
      showAddModal.value = false;
    };

    return {
      showAddModal,
      closeAddModal,
    };
  },
};
</script>

<style scoped>
.mobile-parameter-list {
  display: grid;
  gap: 15px;
  padding: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 530px) {
  .mobile-parameter-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.item-card {
  width: 100%;
}

.add-card {
  border: 1px dashed white;
  border-radius: 20px;
  padding: 20px;
  background-color: transparent;
  color: white;
  min-height: 120px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.plus-sign {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}
</style>
