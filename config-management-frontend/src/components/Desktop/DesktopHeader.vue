<template>
  <header class="app-header">
    <a href="/dashboard">
      <img src="../../assets/icon.png" alt="Logo" class="logo" />
    </a>
    <div class="icons" ref="dropdownRef" @click.stop="toggleDropdown">
      <i class="fas fa-user"></i>
      <i class="fas fa-caret-down"></i>
      <div v-if="dropdownOpen" class="dropdown">
        <a href="/sign-out">Sign Out</a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false;
});

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  padding: 10px 20px;
  width: 100%;
  margin-top: 10px;
}

.logo {
  width: 50px;
  height: auto;
  margin-left: 50px;
}

.icons {
  color: white;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.icons > i {
  margin-left: 10px;
}

.icons > .fa-caret-down {
  font-size: 0.5em;
  margin-left: 10px;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  min-width: 90px;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  font-size: medium;
  display: block;
}

.dropdown a {
  color: #333;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown:hover {
  background-color: #f5f5f5;
}
</style>
