<script setup lang="ts">
import { ref } from 'vue'
const name = ref(''); const mail = ref(''); const msg = ref('')
function submit() {
    fetch('https://formspree.io/f/<id>', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: mail.value, message: msg.value })
    }).then(() => alert('Thank you!'))
}
</script>

<template>
    <SectionContainer id="contact">
        <h2 class="text-2xl font-bold mb-6">Contact</h2>
        <form class="grid gap-4 max-w-lg" @submit.prevent="submit">
            <input v-model="name" placeholder="Your name" class="border p-2 rounded" required>
            <input v-model="mail" placeholder="Email" type="email" class="border p-2 rounded" required>
            <textarea v-model="msg" placeholder="Message" rows="5" class="border p-2 rounded" required />
            <button type="submit" class="bg-primary-500 text-white py-2 rounded">Send</button>
        </form>
    </SectionContainer>
</template>
