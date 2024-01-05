<script setup>
import { ref, onMounted } from 'vue';
import { evaluate } from '../../../../dist/index.mjs';

const code = ref('');
const output = ref('');
const link = ref('');

function runScript() {
    try {
        output.value = JSON.stringify(evaluate(code.value));
    } catch (error) {
        output.value = '' + error;
    }
}

function generateURL() {
    link.value =
        window.location.origin +
        window.location.pathname +
        '?s=' +
        encodeURI(code.value);
}

function reset() {
    link.value = '';
    output.value = '';
}

onMounted(() => {
    const search = window.location.search;
    const raw = search.substring(search.lastIndexOf('=') + 1);
    const script = decodeURI(raw);
    console.log(script);
    if (script.length) {
        code.value = script;
    }
});
</script>

<template>
    <div class="box">
        <div>
            <label for="code">Code</label>
            <br />
            <textarea v-model.trim="code" @input="reset" name="code" id="code" spellcheck="false"
                autocomplete="off"></textarea>
        </div>
        <div>
            <button @click="runScript">Run</button>
            <button @click="generateURL" :disabled="!code">Share</button>
        </div>
        <div v-show="code.length && link.length">
            <b>Link:</b> {{ link }}
        </div>
        <div v-show="output.length">
            <b>Output:</b>
            <p>{{ output }}</p>
        </div>
    </div>
</template>

<style scoped>
.box {
    max-width: 720px;
    margin: 3rem auto;
    display: flex;
    flex-direction: column;
}

.box>div {
    margin-bottom: 1rem;
}

button {
    border: 1px solid;
    border-color: var(--vp-button-alt-border);
    color: var(--vp-button-alt-text);
    background-color: var(--vp-button-alt-bg);
    margin-right: 1rem;
    border-radius: 10px;
    padding: 0 20px;
    line-height: 38px;
    font-size: 14px;
}

textarea:focus,
button:focus,
button:hover {
    background-color: var(--vp-button-alt-hover-bg);
}

button:focus {
    border-color: var(--vp-button-brand-bg);
}

textarea {
    width: 100%;
    padding: 0.75rem;
    overflow-wrap: break-word;
    border-radius: 8px;
    min-height: 250px;
}
</style>
