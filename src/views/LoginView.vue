<template>
  <div class="container">
    <div class="left-section pt-15">
      <div class="logo-container">
        <img :src="logoURL1" alt="logo" class="logo-image" />
        <div>
          <h5 class="logo-text">Data Collaction</h5>
          <p class="logo-text">Welcome to the Data Collection Application!</p>
        </div>
      </div>

      <div class="collaction-container">
        <img :src="logoURL2" alt="logo" class="collaction-image" />
      </div>

      <p class="text"></p>
    </div>
    <div class="right-section">
      <h2>Login To Your Account!</h2>
      <p>Fill the information below to get back into your account.</p>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              v-model="password"
            />
            <span class="input-group-text" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>

        <button type="submit" class="btn btn-anchor">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import logoURL1 from "../assets/dataa.png";
import logoURL2 from "../assets/collaction.png";

const showPassword = ref(false);
const username = ref("");
const password = ref("");
const flag = ref(2);

const url = ref("/permission");

const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleSubmit() {
  if (username.value && password.value) {
    try {
      const response = await axios.post(
        "https://a835-2001-448a-3032-fc0-1d8-9851-bad9-8284.ngrok-free.app/auth/token",
        {
          username: username.value,
          password: password.value,
          flag: flag.value,
        }
      );

      console.log("Response data:", response.data);

      const token = response.data.data.token;
      const idSubRole = response.data.data.idSubRole;

      if (token && idSubRole) {
        localStorage.setItem("token", token);
        localStorage.setItem("idSubRole", idSubRole);
        await Swal.fire({
          title: "Success!",
          text: "Login successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        router.push(url.value);
      } else {
        await Swal.fire({
          title: "Failed",
          text: "Login failed: No token or idSubRole received.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred during login. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }
}
</script>

<style scoped>
* {
  font-family: "Roboto", sans-serif;
}
body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  overflow: hidden;
}
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.left-section,
.right-section {
  padding: 30px;
  height: 100%;
  box-sizing: border-box;
}
.left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 55%;
  background: linear-gradient(135deg, #0187ea, #014c84);
  color: white;
  margin: 0;
  padding: 20px;
  flex: 1;
  padding-top: 50px;
}
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 65%;
  background: white;
  margin: 0;
}
.right-section form {
  width: 100%;
}
.right-section form label {
  display: block;
  margin: 10px 0 5px;
}
.right-section form button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #0187ea;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}
.btn-anchor {
  display: inline-block;
  width: 100%;
  max-width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.btn-anchor:hover {
  color: #fff;
  background-color: #0056b3;
  border-color: #0056b3;
}
.logo-container {
  display: flex;
  align-items: center;
  margin: 0;
}

.logo-image {
  width: 70px;
  height: auto;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.5rem;
  margin-left: 40px;
  margin-top: 10px;
}

.text {
  font-size: 1rem;
  color: #fff8f8;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
  margin: 0;
}

.collaction-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.collaction-image {
  width: 70%; /* Adjust size as needed */
  height: auto;
  margin-right: 10px;
  justify-content: center;
}
@media (max-width: 556px) {
  .logo-text {
    font-size: 1rem;
  }
  .welcome-text {
    font-size: 1.25rem;
  }
  .text {
    font-size: 0.875rem;
  }
  .container {
    flex-direction: column;
  }
  .left-section,
  .right-section {
    width: 100%;
    padding: 0;
  }
  .left-section {
    padding: 30px 50px;
    background: linear-gradient(100deg, #014c84, #0187ea);
  }
  .right-section {
    padding: 30px 50px;
    background: white;
  }
  .right-section form {
    width: 100%;
  }
}

@media (min-width: 480px) {
  .logo-text {
    font-size: 1rem;
  }
  .welcome-text {
    font-size: 1.25rem;
  }
  .text {
    font-size: 0.875rem;
  }
  .btn-anchor {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1.25rem;
  }
  .left-section p,
  .right-section p {
    font-size: 0.875rem;
  }
  .btn-anchor {
    font-size: 0.875rem;
    padding: 0.4rem 0.8rem;
  }
  .left-section {
    padding-bottom: 70px;
    padding-inline: 50px;
  }
  .right-section {
    margin-bottom: 50%;
  }
  .text {
    padding: 0;
    margin: 50px 0;
  }
}

@media (max-width: 380px) {
  .logo-text {
    font-size: 1.2rem;
  }
  .welcome-text {
    font-size: 1.25rem;
  }
  .text {
    font-size: 0.875rem;
  }
  .btn-anchor {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
  h1 {
    font-size: 1.25rem;
  }
  h2 {
    font-size: 1rem;
  }
  .left-section p,
  .right-section p {
    font-size: 0.75rem;
  }
  .btn-anchor {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
