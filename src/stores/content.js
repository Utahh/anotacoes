import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { mockItems } from 'src/data/mockContent'
import { hasSupabaseConfig, supabase } from 'src/lib/supabase'

const TABLE_NAME = 'conteudos'
const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET || 'pdfs'

export const useContentStore = defineStore('content', () => {
  const items = ref([])
  const loading = ref(false)
  const usingMock = ref(!hasSupabaseConfig)
  const lastError = ref('')

  const sortedItems = computed(() =>
    [...items.value].sort((a, b) => new Date(b.createdAt || b.data) - new Date(a.createdAt || a.data)),
  )

  const itemsByType = (type) => sortedItems.value.filter((item) => item.tipo === type)

  const loadFromMock = () => {
    usingMock.value = true
    items.value = [...mockItems]
  }

  const mapRow = (row) => ({
    id: row.id,
    titulo: row.titulo,
    legenda: row.legenda,
    data: row.data,
    tipo: row.tipo,
    url: row.url,
    createdAt: row.created_at,
  })

  const loadItems = async () => {
    loading.value = true
    lastError.value = ''
    try {
      if (!hasSupabaseConfig) {
        loadFromMock()
        return
      }

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      usingMock.value = false
      items.value = data.map(mapRow)
    } catch (error) {
      lastError.value = error.message || 'Falha ao buscar dados'
      loadFromMock()
    } finally {
      loading.value = false
    }
  }

  const addItem = async ({ titulo, legenda, data, tipo, arquivo }) => {
    lastError.value = ''
    loading.value = true

    try {
      if (!hasSupabaseConfig || !supabase) {
        const fakeUrl = arquivo ? URL.createObjectURL(arquivo) : ''
        const item = {
          id: Date.now(),
          titulo,
          legenda,
          data,
          tipo,
          url: fakeUrl,
          createdAt: new Date().toISOString(),
        }
        items.value = [item, ...items.value]
        return { item, fromMock: true }
      }

      const fileName = `${Date.now()}-${arquivo.name}`
      const filePath = `${tipo}/${fileName}`

      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, arquivo, {
        upsert: true,
        contentType: 'application/pdf',
      })
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

      const payload = {
        titulo,
        legenda,
        data,
        tipo,
        url: publicData.publicUrl,
      }

      const { data: inserted, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select('*')
        .single()

      if (insertError) throw insertError

      const mapped = mapRow(inserted)
      items.value = [mapped, ...items.value]
      usingMock.value = false
      return { item: mapped, fromMock: false }
    } catch (error) {
      lastError.value = error.message || 'Falha ao salvar conteudo'
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, { titulo, legenda, data, tipo, arquivo }) => {
    lastError.value = ''
    loading.value = true

    try {
      if (!hasSupabaseConfig || !supabase) {
        const nextUrl = arquivo ? URL.createObjectURL(arquivo) : undefined
        items.value = items.value.map((item) =>
          item.id === id
            ? {
                ...item,
                titulo,
                legenda,
                data,
                tipo,
                url: nextUrl || item.url,
              }
            : item,
        )
        return { fromMock: true }
      }

      let nextUrl
      if (arquivo) {
        const fileName = `${Date.now()}-${arquivo.name}`
        const filePath = `${tipo}/${fileName}`
        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, arquivo, {
          upsert: true,
          contentType: 'application/pdf',
        })
        if (uploadError) throw uploadError
        const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
        nextUrl = publicData.publicUrl
      }

      const payload = {
        titulo,
        legenda,
        data,
        tipo,
      }
      if (nextUrl) payload.url = nextUrl

      const { data: updated, error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      const mapped = mapRow(updated)
      items.value = items.value.map((item) => (item.id === id ? mapped : item))
      usingMock.value = false
      return { fromMock: false }
    } catch (error) {
      lastError.value = error.message || 'Falha ao atualizar conteudo'
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id) => {
    lastError.value = ''
    loading.value = true

    try {
      if (!hasSupabaseConfig || !supabase) {
        items.value = items.value.filter((item) => item.id !== id)
        return { fromMock: true }
      }

      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
      if (error) throw error
      items.value = items.value.filter((item) => item.id !== id)
      usingMock.value = false
      return { fromMock: false }
    } catch (error) {
      lastError.value = error.message || 'Falha ao excluir conteudo'
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    sortedItems,
    loading,
    usingMock,
    lastError,
    itemsByType,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
  }
})
