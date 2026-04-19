import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProcessDefinitionVO } from '@/api/types/workflow'
import { listProcessDefinitions } from '@/api/process'

export const useProcessStore = defineStore('process', () => {
    const definitions = ref<ProcessDefinitionVO[]>([])

    async function fetchDefinitions() {
        definitions.value = await listProcessDefinitions()
    }

    return { definitions, fetchDefinitions }
})