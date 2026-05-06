<template>
  <q-page class="flex flex-center bg-gradient text-white window-height">
    <div class="text-center column items-center">
      <h1 class="text-h2 text-weight-bold q-mb-md text-shadow">Estudos e Orações</h1>
      <p class="text-h6 text-weight-light q-mb-xl text-opacity">Um espaço sagrado para sua jornada.</p>

      <q-btn
        v-ripple
        round
        color="white"
        text-color="primary"
        size="xl"
        icon="play_arrow"
        class="play-btn pulse-btn shadow-10"
        @click="goToMenu"
      />
      <div class="q-mt-md text-subtitle2 text-weight-bold text-uppercase letter-space">
        APERTAR PLAY
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToMenu = () => {
  router.push('/menu')
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.text-opacity {
  opacity: 0.9;
}

.play-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.play-btn:hover {
  transform: scale(1.08);
}

.letter-space {
  letter-spacing: 0.12em;
}

.pulse-btn {
  animation: pulse-soft 2.1s infinite;
}

@keyframes pulse-soft {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.45);
  }
  70% {
    transform: scale(1.04);
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
