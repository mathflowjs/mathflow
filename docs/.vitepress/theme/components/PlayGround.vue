<script setup>
import { ref, onMounted } from 'vue';
import { evaluate } from '../../../../dist/index.mjs';

const input = ref('');
const code = ref('');
const output = ref('');
const link = ref('');
const copied = ref(false);

function runScript() {
    try {
        output.value = JSON.stringify(evaluate(code.value), null, 2);
    } catch (error) {
        output.value = '' + error;
    }
}

function generateURL() {
    link.value =
        window.location.origin +
        window.location.pathname +
        '?s=' +
        encodeURIComponent(code.value);
}

function reset() {
    link.value = '';
    output.value = '';
}

function copyURL() {
    try {
        navigator.clipboard.writeText(link.value);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 100);
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('s')) {
        code.value = decodeURIComponent(params.get('s'));
    }
});
</script>

<template>
    <div class="box">
        <div>
            <label for="code">Code</label>
            <br />
            <textarea ref="input" v-model.trim="code" @input="reset" name="code" id="code" spellcheck="false"
                autocomplete="off"></textarea>
        </div>
        <div>
            <button @click="runScript">Run</button>
            <button @click="generateURL" :disabled="!code">Share</button>
        </div>
        <div v-show="code.length && link.length">
            <div class="copy">
                <span>Link</span>
                <span v-text="link"></span>
                <span @click="copyURL">{{ copied ? 'Copied' : 'Copy' }}</span>
            </div>
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

.copy {
    display: flex;
    border: 1px solid var(--vp-input-border-color);
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.25ms;
}

.copy>span {
    display: inline-block;
    padding: 5px 15px;
    max-height: 50px;
}

.copy>span:nth-child(2) {
    flex-grow: 1;
    border-width: 0 1px 0 1px;
    border-style: solid;
    border-color: var(--vp-input-border-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.copy>span:last-child {
    background-color: var(--vp-input-switch-bg-color);
    cursor: pointer;
}

.copy>span:last-child:hover {
    background-color: var(--vp-bg-brand);
    color: var(--vp-c-brand-1);
}
</style>
