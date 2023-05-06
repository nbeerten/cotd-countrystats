import { defineConfig, presetUno, presetTypography } from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
export default defineConfig({
    presets: [presetUno(), presetTypography()],
    extractors: [extractorSvelte()],
    shortcuts: {
        'shell-max-w-center': 'max-w-[80rem] mx-auto px-4 md:px-8',
    },
});
