<script lang="ts" setup>
import { useConnectivityStatus } from "@/composables/ui/useConnectivityStatus/useConnectivityStatus";

const { visibleStatus } = useConnectivityStatus();
const { t } = useI18n();

const statusLabel = computed<string>(() => t(visibleStatus.value === "offline" ? "common.connectivity.offline" : "common.connectivity.online"));
const statusIcon = computed<string>(() => (visibleStatus.value === "offline" ? "i-lucide-wifi-off" : "i-lucide-wifi"));
const statusIconColorClass = computed<string>(() => (visibleStatus.value === "offline" ? "text-error" : "text-success"));
</script>

<template>
  <Transition
    enter-active-class="duration-200 ease-out motion-reduce:transition-none transition"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="duration-200 ease-in motion-reduce:transition-none transition"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="-translate-y-1 opacity-0"
  >
    <div
      v-if="visibleStatus"
      aria-live="polite"
      class="fixed flex inset-x-0 justify-center pointer-events-none pt-[calc(env(safe-area-inset-top)+0.5rem)] top-4 z-50"
      data-testid="connectivity-status"
      role="status"
    >
      <div class="bg-card flex gap-1.5 items-center px-3 py-1 ring-1 ring-stroke-subtle rounded-full shadow-lg text-fg-primary text-sm">
        <UIcon
          aria-hidden="true"
          class="duration-200 motion-reduce:transition-none transition-colors"
          :class="statusIconColorClass"
          :data-icon-name="statusIcon"
          data-testid="connectivity-status-icon"
          :name="statusIcon"
          size="16"
        />

        <span>{{ statusLabel }}</span>
      </div>
    </div>
  </Transition>
</template>