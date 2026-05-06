<template>
  <q-page padding class="bg-grey-1">
    <div class="max-w-md">
      <div class="row items-center justify-between q-mb-lg">
        <h2 class="text-h4 text-weight-bold text-grey-9">Admin / Upload</h2>
        <q-btn round flat icon="arrow_back" color="grey-8" @click="goBack" />
      </div>

      <q-card class="shadow-2 q-pa-md rounded-borders">
        <q-form class="q-gutter-md" @submit.prevent="submitForm">
          <q-input v-model="form.titulo" label="Titulo" outlined dense :rules="[requiredRule]" />
          <q-input v-model="form.legenda" label="Legenda" type="textarea" autogrow outlined dense />
          <q-input v-model="form.data" label="Data" outlined dense mask="##/##/####" :rules="[requiredRule]" />

          <q-select
            v-model="form.tipo"
            label="Tipo de conteudo"
            outlined
            dense
            emit-value
            map-options
            :options="tipoOptions"
          />

          <q-file
            v-model="form.arquivo"
            label="Arquivo PDF"
            outlined
            dense
            accept=".pdf,application/pdf"
            :rules="[requiredRule]"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-btn class="full-width" label="Salvar" type="submit" color="primary" unelevated />
            </div>
            <div class="col">
              <q-btn class="full-width" label="Limpar" flat color="grey-7" @click="resetForm" />
            </div>
          </div>
        </q-form>
      </q-card>

      <div class="q-mt-xl">
        <div class="text-subtitle1 text-weight-medium text-grey-8 q-mb-sm">Ultimos uploads (mock)</div>
        <q-list bordered separator class="bg-white rounded-borders">
          <q-item v-for="item in newestUploads" :key="item.id">
            <q-item-section>
              <q-item-label>{{ item.titulo }}</q-item-label>
              <q-item-label caption>{{ item.legenda }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="item.tipo === 'estudos' ? 'primary' : 'pink'">
                {{ item.tipo }}
              </q-badge>
            </q-item-section>
          </q-item>
          <q-item v-if="newestUploads.length === 0">
            <q-item-section>Nenhum upload feito ainda.</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { mockFormDefaults, mockItems } from 'src/data/mockContent'

const $q = useQuasar()
const router = useRouter()
const uploads = ref([...mockItems])

const form = reactive({
  ...mockFormDefaults,
})

const tipoOptions = [
  { label: 'Estudo', value: 'estudos' },
  { label: 'Carta', value: 'cartas' },
]

const requiredRule = (val) => !!val || 'Campo obrigatorio'

const newestUploads = computed(() => [...uploads.value].reverse().slice(0, 5))

const resetForm = () => {
  form.titulo = ''
  form.legenda = ''
  form.data = ''
  form.tipo = 'estudos'
  form.arquivo = null
}

const submitForm = () => {
  const fakeUrl = form.arquivo ? URL.createObjectURL(form.arquivo) : ''

  uploads.value.push({
    id: Date.now(),
    titulo: form.titulo,
    legenda: form.legenda,
    data: form.data,
    tipo: form.tipo,
    url: fakeUrl,
  })

  $q.notify({
    type: 'positive',
    message: 'Conteudo salvo no mock local com sucesso.',
    timeout: 1800,
  })

  resetForm()
}

const goBack = () => {
  router.push('/menu')
}
</script>

<style scoped>
.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}
</style>
