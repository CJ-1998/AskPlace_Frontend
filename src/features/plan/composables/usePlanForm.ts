import { ref, computed } from 'vue'
import {
    getLocalTimeZone,
    today,
    parseDate,
    type DateValue
} from '@internationalized/date'

export interface PlanFormData {
    title: string
    description: string
    startDate: string
    endDate: string
}

export interface UsePlanFormProps {
    initialData?: Partial<PlanFormData>
}

export function usePlanForm(props: UsePlanFormProps = {}) {
    const title = ref(props.initialData?.title || '')
    const description = ref(props.initialData?.description || '')

    const now = today(getLocalTimeZone())

    // DateRange state compatible with RangeCalendar
    // We explicitly type it to avoid linter issues with 'undefined' vs 'DateValue'
    const dateRange = ref<{
        start: DateValue | undefined
        end: DateValue | undefined
    }>({
        start: props.initialData?.startDate
            ? parseDate(props.initialData.startDate)
            : now,
        end: props.initialData?.endDate
            ? parseDate(props.initialData.endDate)
            : now.add({ days: 1 })
    })

    // Computed validity
    const isValid = computed(() => {
        return (
            title.value.trim().length > 0 &&
            !!dateRange.value.start &&
            !!dateRange.value.end
        )
    })

    const getSubmitPayload = (): PlanFormData => {
        if (!isValid.value || !dateRange.value.start || !dateRange.value.end) {
            throw new Error('Form is invalid')
        }

        // Format dates to YYYY-MM-DD
        const startStr = dateRange.value.start.toString()
        const endStr = dateRange.value.end.toString()

        return {
            title: title.value,
            description: description.value,
            startDate: startStr,
            endDate: endStr
        }
    }

    return {
        title,
        description,
        dateRange,
        isValid,
        getSubmitPayload
    }
}
