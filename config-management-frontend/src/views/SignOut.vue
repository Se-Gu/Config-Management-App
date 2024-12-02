<template>
  <div>Signing out...</div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const auth = getAuth();

onMounted(() => {
  signOut(auth)
    .then(() => {
      router.replace({ name: "LoginPage" });
    })
    .catch((error) => {
      console.error("Sign out error", error);
    });
});
</script>
