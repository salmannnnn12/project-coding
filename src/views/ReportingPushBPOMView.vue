<template>
  <div class="dashboard">
    <Sidebar @updateTitle="updateTitle" />
    <div class="main-content">
      <Navbar :title="title" />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

const title = ref("Reporting Push BPOM");

function updateTitle(newTitle) {
  title.value = newTitle;
}
</script>
<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira Sans", sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.dashboard {
  display: flex;
  height: 100vh;
  flex-direction: row;
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--dark-alt);
  color: white;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.navbar {
  width: 100%;
  padding: 1rem 2rem;
  background: var(--primary);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

main {
  flex: 1;
  padding: 2rem;
  background: var(--light);

  @media (max-width: 1024px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
