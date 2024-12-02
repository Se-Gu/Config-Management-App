<template>
  <div
    class="login-page d-flex flex-column align-items-center justify-content-start min-vh-100"
    style="
      background: linear-gradient(to bottom, #1e1e2e 0%, #1e1e26 100%);
      padding-top: 3rem;
    "
  >
    <LoadingSpinner :visible="isLoading" />
    <div
      class="login-card bg-transparent text-center p-4 w-100"
      style="max-width: 450px"
    >
      <img
        src="../assets/icon.png"
        alt="Logo"
        class="logo mb-4"
        style="height: 175px"
      />
      <h1
        class="subtitle mb-3"
        style="color: #32325c; font-size: 1.7rem; font-weight: normal"
      >
        Please sign in
      </h1>
      <form @submit.prevent="handleLogin" class="d-flex flex-column">
        <input
          v-model="email"
          type="email"
          placeholder="E-mail address"
          required
          class="input-field"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="input-field"
        />
        <button type="submit" class="login-btn mt-3" :disabled="isLoading">
          Sign in
        </button>
      </form>
      <p v-if="error" class="error mt-3">{{ error }}</p>
    </div>
    <footer class="login-footer mt-3">Codeway © 2024</footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login } from "../services/authService";
import { useRouter } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    await login(email.value, password.value);
    router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.message === "Firebase: Error (auth/invalid-credential).") {
      error.value =
        "Invalid credentials provided. Please check your email and password.";
      password.value = "";
    } else {
      error.value = err.message || "Failed to login. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  color: white;
}

.login-card {
  background: transparent;
  padding: 2.5rem;
  text-align: center;
  width: 100%;
  max-width: 450px;
  margin-top: 4rem;
}

.logo {
  height: 175px;
  margin-bottom: 4rem;
}

.subtitle {
  font-size: 1.7rem;
  margin-bottom: 1rem;
  color: #32325c;
  font-family: "Poppins", sans-serif;
  font-weight: normal;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #4a4a6a;
  background-color: rgba(34, 40, 49, 0.8);
  color: #eaeaea;
  font-size: 1rem;
  height: 3.5rem;
}

.input-field:first-of-type {
  border-radius: 8px 8px 0 0;
}

.input-field:last-of-type {
  border-radius: 0 0 8px 8px;
}

.input-field + .input-field {
  margin-top: 0;
}

.input-field::placeholder {
  color: #7f7f7f;
}

.input-field:focus {
  border-color: #e14eca;
  outline: none;
  box-shadow: 0 0 5px rgba(199, 90, 255, 0.7);
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #477dff, #665dff);
  color: white;
  font-size: 1.1rem;
  border-radius: 10px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  height: 3.5rem;
}

.login-btn:hover {
  background: linear-gradient(to right, #3b6fdd, #5a51dd);
}

.error {
  margin-top: 1rem;
  color: #ff5c5c;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
}

.login-footer {
  margin-top: 2rem;
  font-size: 1rem;
  color: #7f7f7f;
  font-family: "Poppins", sans-serif;
}
</style>
