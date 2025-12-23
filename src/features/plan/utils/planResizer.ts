import type { DailyPlanRequestDto } from '@/features/plan/types/plan'
import type { DailyPlan, TravelPlan } from '@/features/plan/types/plan'

// Helper to create an empty daily plan DTO
export const createEmptyDailyPlan = (dateStr: string, dayResult: number): DailyPlanRequestDto => ({
    title: `${dayResult}일차`,
    description: '',
    date: dateStr,
    placePlanRequestDtoList: []
})

// Helper to map existing DailyPlan to Request DTO
export const mapDailyPlanToDto = (dailyPlan: DailyPlan): DailyPlanRequestDto => ({
    title: `Day ${dailyPlan.dayNumber}`,
    description: '', // Domain model lacks description?
    date: dailyPlan.date,
    placePlanRequestDtoList: dailyPlan.placeDetails.map(p => ({
        placeId: p.placeDetailId,
        startTime: (p.startTime || '10:00').substring(0, 5),
        endTime: (p.endTime || '12:00').substring(0, 5),
        budget: p.budget || 0
    }))
})


export function resizeDailyPlans(
    currentPlan: TravelPlan,
    newStartDate: string,
    newEndDate: string
): DailyPlanRequestDto[] {
    if (!currentPlan.startDate) return [] // Should not happen for edit

    const oldStart = new Date(currentPlan.startDate)
    // const oldEnd = new Date(currentPlan.endDate!) // Not strictly needed if we trust dailyPlans length

    const newStart = new Date(newStartDate)
    const newEnd = new Date(newEndDate)

    // Calculate Diff in Days
    const ONE_DAY = 1000 * 60 * 60 * 24
    const diffStartDays = Math.round((newStart.getTime() - oldStart.getTime()) / ONE_DAY)

    const newDurationDays = Math.ceil(Math.abs(newEnd.getTime() - newStart.getTime()) / ONE_DAY) + 1

    // Existing Daily Plans (Sorted by dayNumber)
    // Assuming currentPlan.dailyPlans is sorted or we trust index
    const existingDailyPlans = currentPlan.dailyPlans || []

    const result: DailyPlanRequestDto[] = []

    for (let i = 0; i < newDurationDays; i++) {
        const currentDate = new Date(newStart)
        currentDate.setDate(currentDate.getDate() + i)
        const currentDateStr = currentDate.toISOString().split('T')[0]

        // Calculate the index in the OLD array that corresponds to this new day
        // newIndex i
        // oldIndex = i + diffStartDays
        // Wait. 
        // If New Start is BEFORE Old Start (diffStartDays < 0):
        // i=0 (New Day 1) matches Old Index (0 + -diff) NO.

        // Relationship:
        // New Date = Old Date + diffStartDays (X)
        // New Date = New Start + i
        // Old Date = Old Start + oldIndex

        // We want to find if (New Start + i) matches an (Old Start + oldIndex)
        // New Start + i = Old Start + oldIndex
        // oldIndex = (New Start - Old Start) + i
        // oldIndex = diffStartDays (days) + i  <-- This logic is tricky with date subtraction

        // Let's use date comparison directly vs logic
        // But logic is cleaner:
        // offset = (NewStart - OldStart) in days.
        // If NewStart is Jan 1, OldStart is Jan 3. offset = -2.
        // i=0 (Jan 1). matches oldIndex = -2 + 0 = -2. Out of bounds. -> Empty Day.
        // i=2 (Jan 3). matches oldIndex = -2 + 2 = 0. Matches Old[0]. -> Keep Old[0].

        // If NewStart is Jan 3, OldStart is Jan 1. offset = +2.
        // i=0 (Jan 3). matches oldIndex = 2 + 0 = 2. Matches Old[2]. -> Keep Old[2].

        const oldIndex = i + diffStartDays

        if (oldIndex >= 0 && oldIndex < existingDailyPlans.length) {
            // Match found!
            const matchedDay = existingDailyPlans[oldIndex]

            // We must update the DATE of this matched day to the new date
            const dto = mapDailyPlanToDto(matchedDay)
            dto.date = currentDateStr
            // Update title to reflect new day number? User probably wants to keep "Day 3" text from old?
            // "title" in DTO is display title. 
            // If we shift, "1일차" content moving to "3일차" date.
            // Should valid title receive update? 
            // Usually we regenerate default titles e.g. "N일차" but keep custom descriptions.
            // For now, let's keep it simple: mapped DTO.
            result.push(dto)
        } else {
            // No match (Prepended or Appended or Gap?)
            // Creating empty day
            result.push(createEmptyDailyPlan(currentDateStr, i + 1))
        }
    }

    return result
}
