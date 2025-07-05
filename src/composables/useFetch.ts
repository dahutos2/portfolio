import { ref } from 'vue'
import { fetchData } from '../utils/fetchData'

export function useFetch<T>(file: string) {
  const data = ref<T | null>(null)
  const loading = ref(true)

  async function load() {
    loading.value = true
    data.value = await fetchData<T>(file)
    loading.value = false
  }
  load()

  return { data, loading }
}
