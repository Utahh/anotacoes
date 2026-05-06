<template>
  <q-page padding class="bg-grey-1">
    <div class="max-w-md">
      <div class="row items-center justify-between q-mb-lg">
        <h2 class="text-h4 text-weight-bold text-grey-9">Admin / Upload</h2>
        <q-btn round flat icon="arrow_back" color="grey-8" @click="goBack" />
      </div>

      <q-card v-if="!isAuthenticated" class="shadow-2 q-pa-md rounded-borders q-mb-lg">
        <div class="text-subtitle1 text-weight-medium q-mb-md">Acesso administrativo</div>
        <q-form class="q-gutter-md" @submit.prevent="login">
          <q-input v-model="credentials.usuario" label="Usuario" outlined dense :rules="[requiredRule]" />
          <q-input
            v-model="credentials.senha"
            label="Senha"
            type="password"
            outlined
            dense
            :rules="[requiredRule]"
          />
          <q-btn class="full-width" color="primary" unelevated type="submit" label="Entrar" />
        </q-form>
        <div class="text-caption text-grey-6 q-mt-sm">Credenciais atuais: usuario `adm` e senha `admin`.</div>
      </q-card>

      <q-card v-else class="shadow-2 q-pa-md rounded-borders">
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
              <q-btn
                class="full-width"
                label="Salvar"
                type="submit"
                color="primary"
                unelevated
                :loading="store.loading"
              />
            </div>
            <div class="col">
              <q-btn class="full-width" label="Limpar" flat color="grey-7" @click="resetForm" />
            </div>
          </div>
        </q-form>
      </q-card>

      <div v-if="isAuthenticated" class="q-mt-xl">
        <q-banner
          v-if="store.usingMock"
          class="bg-amber-1 text-amber-10 rounded-borders q-mb-md"
        >
          Sem credenciais Supabase: uploads salvos apenas em memoria local.
        </q-banner>

        <div class="text-subtitle1 text-weight-medium text-grey-8 q-mb-sm">Ultimos uploads</div>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { mockFormDefaults } from 'src/data/mockContent'
import { useContentStore } from 'src/stores/content'

const $q = useQuasar()
const router = useRouter()
const store = useContentStore()
const isAuthenticated = ref(false)

const form = reactive({
  ...mockFormDefaults,
})
const credentials = reactive({
  usuario: '',
  senha: '',
})

const tipoOptions = [
  { label: 'Estudo', value: 'estudos' },
  { label: 'Carta', value: 'cartas' },
]

const requiredRule = (val) => !!val || 'Campo obrigatorio'

const newestUploads = computed(() => store.sortedItems.slice(0, 5))

const resetForm = () => {
  form.titulo = ''
  form.legenda = ''
  form.data = ''
  form.tipo = 'estudos'
  form.arquivo = null
}

const login = () => {
  const isValid = credentials.usuario === 'adm' && credentials.senha === 'admin'
  if (!isValid) {
    $q.notify({
      type: 'negative',
      message: 'Usuario ou senha invalidos.',
    })
    return
  }

  sessionStorage.setItem('admin-auth', 'ok')
  isAuthenticated.value = true
  credentials.usuario = ''
  credentials.senha = ''
  $q.notify({
    type: 'positive',
    message: 'Acesso administrativo liberado.',
  })
}

const submitForm = async () => {
  try {
    const { fromMock } = await store.addItem({
      titulo: form.titulo,
      legenda: form.legenda,
      data: form.data,
      tipo: form.tipo,
      arquivo: form.arquivo,
    })

    $q.notify({
      type: 'positive',
      message: fromMock
        ? 'Conteudo salvo no mock local com sucesso.'
        : 'Conteudo salvo no Supabase com sucesso.',
      timeout: 1800,
    })

    resetForm()
  } catch {
    $q.notify({
      type: 'negative',
      message: store.lastError || 'Erro ao salvar conteudo.',
    })
  }
}

const goBack = () => {
  router.push('/menu')
}

onMounted(() => {
  isAuthenticated.value = sessionStorage.getItem('admin-auth') === 'ok'
  store.loadItems()
})
</script>

<style scoped>
.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}
</style>
