<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-grey-9">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">Estudos e Oracoes</q-toolbar-title>
        <q-btn flat round dense icon="admin_panel_settings" @click="$router.push('/admin')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="page-fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
