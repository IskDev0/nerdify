<script setup>
import {computed, ref, watch} from "vue";
import Check from "./components/icons/Check.vue";
import Copy from "./components/icons/Copy.vue";

const message = ref("")

const addEmoji = ref(false)

const nerdifiedMessage = computed(() => {
  let result = '';
  let upperStreak = 0;

  for (let i = 0; i < message.value.length; i++) {
    const char = message.value[i];
    const hasCase = char.toUpperCase() !== char.toLowerCase();
    const isUpper = hasCase && char === char.toUpperCase();

    if ((i % 3 === 1 || i % 3 === 2) && hasCase) {
      if (upperStreak >= 2) {
        result += char.toLowerCase();
        upperStreak = 0;
      } else {
        result += char.toUpperCase();
        upperStreak++;
      }
    } else {
      result += char;
      upperStreak = isUpper ? upperStreak + 1 : 0;
    }
  }

  if (addEmoji.value) {
    result += ' 🤓'
  }

  return result;
})

watch(message, () => {
  if (message.value.length === 0) {
    addEmoji.value = false
  }
})

const isCopied = ref(false)

async function copyToClipboard() {
  if (message.value.length > 0) {
    try {
      isCopied.value = true
      await navigator.clipboard.writeText(nerdifiedMessage.value)
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <main
      class="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-[#f4f4f5] px-4">
    <Transition name="slide">
      <div v-if="isCopied" class="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
        <p>Text copied</p>
      </div>
    </Transition>

    <form class="bg-neutral-900 text-neutral-100 shadow-2xl rounded-2xl p-8 mx-8 max-w-3xl w-full">
      <h1 class="text-2xl font-bold text-center mb-8">🤓 Nerdify 🤓</h1>

      <textarea
          v-model="message"
          placeholder="Type your message..."
          class="bg-neutral-800 border-none resize-none w-full text-lg py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"/>

      <div class="inline-flex items-center my-4">
        <label class="flex items-center cursor-pointer relative" for="check-2">
          <input type="checkbox"
                 checked
                 class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-amber-500 checked:border-slate-800"
                 id="check-2"/>
          <span
              class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
     <Check/>
    </span>
        </label>
        <label class="cursor-pointer ml-2" for="check-2">
          Add 🤓
        </label>
      </div>

      <div class="flex items-center justify-between gap-2 border-2 border-amber-500 py-2 px-4 rounded-md">
        <p>{{ nerdifiedMessage ? nerdifiedMessage : 'Nerdify your message' }}</p>
        <button @click="copyToClipboard" type="button" class="w-6 h-6 cursor-pointer">
          <Copy/>
        </button>
      </div>
    </form>
  </main>
</template>

<style>
.slide-enter-active {
  transition: all 0.3s ease-in-out;
}

.slide-leave-active {
  transition: all 0.3s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>