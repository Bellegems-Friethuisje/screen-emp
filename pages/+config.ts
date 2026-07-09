import type { Config } from "vike/types";
import vikeVue from "vike-vue/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "Takeaway Status",
  description: "Live status board for takeaway orders",

  extends: [vikeVue],

  prerender: true,
};

export default config;
