<template>
  <q-page padding class="bg-grey-1">
    <div class="max-w-md">
      <div class="row items-center justify-between q-mb-lg">
        <h2 class="text-h4 text-weight-bold text-capitalize" :class="isEstudo ? 'text-primary' : 'text-pink'">
          {{ isEstudo ? 'Meus Estudos' : 'Cartas de Cuidado' }}
        </h2>
        <q-btn round flat icon="arrow_back" color="grey-8" @click="goBack" />
      </div>

      <div class="q-gutter-y-md">
        <div v-if="store.loading" class="row justify-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>

        <q-banner
          v-if="store.usingMock"
          inline-actions
          class="bg-amber-1 text-amber-10 rounded-borders"
        >
          Exibindo dados mock. Configure o Supabase para dados reais.
        </q-banner>

        <q-card v-for="item in filteredItems" :key="item.id" class="my-card shadow-2 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6 text-weight-bold text-grey-9">{{ item.titulo }}</div>
              <div class="text-subtitle2 text-grey-6 q-mt-xs">{{ item.legenda }}</div>
              <div class="text-caption text-grey-5 q-mt-sm text-italic text-uppercase">
                Postado em: {{ item.data }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                outline
                :color="isEstudo ? 'primary' : 'pink'"
                icon="picture_as_pdf"
                label="Ver PDF"
                @click="openPdf(item.url)"
              />
            </div>
          </q-card-section>
        </q-card>

        <div v-if="!store.loading && filteredItems.length === 0" class="text-center q-pa-xl text-grey-5">
          <q-icon name="sentiment_dissatisfied" size="3rem" />
          <div class="text-h6 q-mt-md">Nenhum conteudo postado ainda.</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from 'src/stores/content'

const route = useRoute()
const router = useRouter()
const store = useContentStore()

const type = computed(() => route.params.type)
const isEstudo = computed(() => type.value === 'estudos')
const filteredItems = computed(() => store.itemsByType(type.value))

const goBack = () => {
  router.push('/menu')
}

const openPdf = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  store.loadItems()
})
</script>

<style scoped>
.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}

.my-card {
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.my-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}
</style>
