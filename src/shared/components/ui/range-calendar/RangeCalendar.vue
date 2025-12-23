<script lang="ts" setup>
import { type HTMLAttributes, computed } from "vue";
import {
  RangeCalendarRoot,
  type RangeCalendarRootEmits,
  type RangeCalendarRootProps,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext, // Check if this is the correct name
  RangeCalendarPrev, // Check if this is the correct name
} from "reka-ui";

const props = defineProps<
  RangeCalendarRootProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits<RangeCalendarRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <RangeCalendarRoot
    v-bind="forwarded"
    :class="cn('p-3 relative', props.class)"
    v-slot="{ grid, weekDays }"
  >
    <RangeCalendarHeader>
      <RangeCalendarPrev
        :class="
          cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute top-1/2 -translate-y-1/2 -left-12'
          )
        "
      >
        <ChevronLeft class="h-4 w-4" />
      </RangeCalendarPrev>

      <RangeCalendarHeading
        :class="cn('text-sm font-medium')"
      />

      <RangeCalendarNext
        :class="
          cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute top-1/2 -translate-y-1/2 -right-12'
          )
        "
      >
        <ChevronRight class="h-4 w-4" />
      </RangeCalendarNext>
    </RangeCalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full border-collapse space-y-1"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="flex">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="flex w-full mt-2"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="
                  cn(
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100 items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
                     // styles for range selection
                     '[&[data-outside-view]]:text-muted-foreground [&[data-outside-view]]:opacity-50',
                     '[&[data-selected]]:bg-primary [&[data-selected]]:text-primary-foreground [&[data-selected]]:hover:bg-primary [&[data-selected]]:hover:text-primary-foreground [&[data-selected]]:focus:bg-primary [&[data-selected]]:focus:text-primary-foreground',
                     // Today
                     '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground'
                  )
                "
              >
                {{ weekDate.day }}
              </RangeCalendarCellTrigger>
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
