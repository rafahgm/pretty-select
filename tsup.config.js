import { defineConfig } from "tsup";

export default defineConfig({
    entry: ['src/index.ts'],
    format: ["esm", "cjs", "iife"],
    target: "es2015",
    name: "Select",
    dts: true,
    sourcemap: true,
    esbuildOptions(options) {
        options.banner = {
            js: '"use client"',
        }
    }
});