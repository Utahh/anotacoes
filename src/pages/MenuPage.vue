<template>
  <q-page padding class="flex flex-center bg-grey-1">
    <div class="full-width max-w-md">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4 text-weight-bold text-grey-9">O que vamos explorar hoje?</h2>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card
            class="cursor-pointer hover-card shadow-3 rounded-borders text-center q-pa-lg"
            @click="goToList('estudos')"
          >
            <q-icon name="menu_book" color="primary" size="4rem" class="q-mb-md" />
            <div class="text-h6 text-weight-medium text-grey-8">Estudo Bíblico</div>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card
            class="cursor-pointer hover-card shadow-3 rounded-borders text-center q-pa-lg"
            @click="goToList('cartas')"
          >
            <q-icon name="favorite" color="pink" size="4rem" class="q-mb-md" />
            <div class="text-h6 text-weight-medium text-grey-8">Cartas de Cuidado</div>
          </q-card>
        </div>
      </div>

      <div class="text-center q-mt-xl">
        <q-btn flat color="grey-6" icon="arrow_back" label="Voltar" @click="goBack" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToList = (type) => {
  router.push(`/lista/${type}`)
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}

.hover-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  border-radius: 20px;
}

.hover-card:hover {
  transform: translateY(-5px);
  border-color: var(--q-primary);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>
