<template>
  {{ dataNum.num.toFixed(0) }}
</template>

<script setup>
import gsap from 'gsap';
import { reactive, watch } from 'vue';

const props = defineProps({
  value: { type: Number, default: 0 }
});

const dataNum = reactive({ num: 0 });

const animateToValue = () => {
  gsap.to(dataNum, {
    duration: 1,
    num: props.value
  });
};

animateToValue();
watch(() => props.value, () => animateToValue());
</script>

<style scoped>
</style>
