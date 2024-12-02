<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
#app {
  font-family: "Poppins", sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
