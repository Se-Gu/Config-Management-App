<template>
  <div
    class="dashboard-page d-flex flex-column align-items-center justify-content-start min-vh-100"
    style="background: linear-gradient(to bottom, #1e1e2e 0%, #1e1e26 100%)"
  >
    <DesktopHeader class="desktop-header" />
    <MobileHeader class="mobile-header" />

    <LoadingSpinner :visible="isLoading" />
    <div class="dashboard-page-content w-100" v-if="!isLoading">
      <DesktopParameterList :parameters="parameters" class="desktop-list" />
      <MobileParameterList :parameters="parameters" class="mobile-list" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DesktopHeader from "../components/Desktop/DesktopHeader.vue";
import MobileHeader from "../components/Mobile/MobileHeader.vue";
import DesktopParameterList from "../components/Desktop/DesktopParameterList.vue";
import MobileParameterList from "../components/Mobile/MobileParameterList.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useParameterStore } from "../stores/parameterStore";
import { computed, onMounted } from "vue";

const parameterStore = useParameterStore();

const isLoading = computed(() => parameterStore.isLoading);
const parameters = computed(() => parameterStore.parameters);

onMounted(() => {
  parameterStore.fetchParameters();
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  color: white;
}

.dashboard-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
  width: 100%;
}

.desktop-header {
  display: flex;
}

.desktop-list {
  display: grid;
}

.mobile-header,
.mobile-list {
  display: none;
}

@media (max-width: 950px) {
  .desktop-header,
  .desktop-list {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  .mobile-list {
    display: grid;
  }
}
</style>
