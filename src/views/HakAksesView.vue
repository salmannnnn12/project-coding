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

const title = ref("Access Right");

function updateTitle(newTitle) {
  title.value = newTitle;
}
</script>


