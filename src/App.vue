<script setup>
import {computed, ref, watch} from "vue";
import Check from "./components/icons/Check.vue";
import Copy from "./components/icons/Copy.vue";

const message = ref("")

const addEmoji = ref(false)
const selectedPrefix = ref(0)
const currentPattern = ref([])

const wellActuallyVariants = [
  {value: '', label: 'None'},
  {value: 'Well actually, ', label: 'Well actually'},
  {value: 'Um actually, ', label: 'Um actually'},
  {value: 'Ackchyually, ', label: 'Ackchyually'},
  {value: 'To be fair, ', label: 'To be fair'},
  {value: 'Technically speaking, ', label: 'Technically speaking'},
  {value: 'If we\'re being precise, ', label: 'If we\'re being precise'},
  {value: 'According to my calculations, ', label: 'According to my calculations'},
  {value: 'Fun fact: ', label: 'Fun fact'},
  {value: 'As a matter of fact, ', label: 'As a matter of fact'},
]

const getRandomPattern = (length) => {
  const pattern = []
  for (let i = 0; i < length; i++) {
    pattern.push(Math.random() > 0.5)
  }
  return pattern
}

const randomizePrefixClick = () => {
  selectedPrefix.value = Math.floor(Math.random() * wellActuallyVariants.length)
}

const nerdifiedMessage = computed(() => {
  let result = '';

  const prefix = wellActuallyVariants[selectedPrefix.value].value
  const fullText = prefix + message.value

  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i];
    const hasCase = char.toUpperCase() !== char.toLowerCase();

    if (hasCase && currentPattern.value[i]) {
      result += char.toUpperCase();
    } else if (hasCase) {
      result += char.toLowerCase();
    } else {
      result += char;
    }
  }

  if (addEmoji.value) {
    result += ' 🤓'
  }

  return result;
})

watch([message, selectedPrefix], () => {
  const prefix = wellActuallyVariants[selectedPrefix.value].value
  const fullLength = prefix.length + message.value.length
  currentPattern.value = getRandomPattern(fullLength)
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

    <form class="bg-neutral-900 text-neutral-100 shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 max-w-2xl w-full">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-amber-500">🤓 Nerdify 🤓</h1>

      <div class="mb-5 sm:mb-6">
        <label for="message-input" class="block text-xs sm:text-sm font-medium mb-2 text-neutral-300">
          Your Message
        </label>
        <textarea
            v-model="message"
            id="message-input"
            placeholder="Type your message here..."
            rows="4"
            aria-label="Message to nerdify"
            class="bg-neutral-800 border-2 border-neutral-700 hover:border-amber-500 focus:border-amber-500 resize-none w-full text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 min-h-[100px] sm:min-h-[120px]"/>
      </div>

      <div class="mb-5 sm:mb-6 p-3 sm:p-4 bg-neutral-800 rounded-xl">
        <h2 class="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-amber-500 uppercase tracking-wide">Options</h2>

        <div class="flex flex-col gap-4 sm:gap-5">
          <div class="flex items-center gap-2 sm:gap-3">
            <label class="flex items-center cursor-pointer relative" for="emoji-checkbox">
              <input
                  v-model="addEmoji"
                  type="checkbox"
                  checked
                  aria-label="Add nerd emoji"
                  class="peer h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-neutral-600 checked:bg-amber-500 checked:border-amber-600"
                  id="emoji-checkbox"/>
              <span
                  class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Check/>
              </span>
            </label>
            <label class="cursor-pointer text-sm sm:text-base font-medium select-none" for="emoji-checkbox">
              Add 🤓 emoji at the end
            </label>
          </div>

          <div>
            <label for="prefix-select" class="block text-xs sm:text-sm font-medium mb-2 text-neutral-300">
              Prefix Style
            </label>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                  v-model.number="selectedPrefix"
                  id="prefix-select"
                  aria-label="Select prefix style"
                  class="w-full bg-neutral-700 border-2 border-neutral-600 hover:border-amber-500 focus:border-amber-500 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 text-sm sm:text-base">
                <option v-for="(variant, index) in wellActuallyVariants" :key="index" :value="index">
                  {{ variant.label }}
                </option>
              </select>
              <button
                  @click="randomizePrefixClick"
                  type="button"
                  aria-label="Randomize prefix"
                  class="w-full sm:w-auto text-2xl sm:text-3xl hover:scale-105 sm:hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer bg-neutral-700 hover:bg-neutral-600 px-3 sm:px-4 py-2 rounded-lg border-2 border-neutral-600 hover:border-amber-500 flex items-center justify-center gap-2"
                  title="Random prefix">
                <span>🎲</span>
                <span class="text-sm sm:hidden font-medium">Random</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-neutral-800 rounded-xl p-3 sm:p-4 border-2 border-amber-500">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 class="text-xs sm:text-sm font-semibold text-amber-500 uppercase tracking-wide">Result</h2>
          <button
              @click="copyToClipboard"
              :disabled="message.length === 0"
              type="button"
              aria-label="Copy to clipboard"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 text-neutral-900 disabled:text-neutral-500 font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm sm:text-base">
            <Copy class="w-4 h-4 sm:w-5 sm:h-5"/>
            <span>Copy</span>
          </button>
        </div>
        <p class="text-base sm:text-lg leading-relaxed min-h-[60px] flex items-center break-words" :class="message.length === 0 ? 'text-neutral-500 italic' : 'text-neutral-100'">
          {{ message.length > 0 ? nerdifiedMessage : 'Your nerdified message will appear here...' }}
        </p>
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