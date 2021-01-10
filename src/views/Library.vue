<template>
  <div class="hello">
    <!--
    <div class="grid">

    </div>
    -->
    <b-carousel
      style="{

      }"
      v-bind:interval="paused ? 0 : 3500"
      controls
      indicators
      id="carousel"
      no-hover-pause
      v-model="carouselIndex"
      ref="carousel"
    >
      <b-carousel-slide
        class="crisp"
        img-height="auto"
        img-width="10px"
        v-for="entry in Object.values(infoData)"
        v-bind:key="entry.name"
        background="black"
        v-bind:caption="entry.title"
        v-bind:text="entry.ckey"
        v-bind:id="entry.name"
      >
        <template v-slot:img>
          <img
            v-bind:src="`https://cdn.yogstation.net/paintings/${entry.md5}.png`"
            v-bind:alt="entry.name"
          />
        </template>

        <router-link v-slot="{ href }" v-bind:to="`/${entry.md5}.png`">
          <b-link class="mx-2" v-on:click="alert(href)" v-bind:href="href"
            >Permalink</b-link
          >
        </router-link>

        <b-link
          class="mx-2"
          v-on:click="
            download(
              `https://cdn.yogstation.net/paintings/${entry.md5}.png`,
              entry.name
            )
          "
          >Download</b-link
        >
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { download } from "@/download";
import { BCarousel } from "bootstrap-vue";

@Component
export default class Library extends Vue {
  //Data
  // noinspection JSMismatchedCollectionQueryUpdate
  private infoData: Record<string, Info> = {};
  private carouselIndex = 0;
  private initialCarouselIndex = 0;
  private paused = false;

  mounted() {
    this.refresh();
  }

  async refresh() {
    const info = await fetch("https://cdn.yogstation.net/paintings/.info.json");
    const infoData = (await info.json()).public as Info[];

    const obj = this.infoData;
    infoData.forEach(val => {
      Vue.set(obj, val.md5 + ".png", val);
    });

    this.$nextTick(() => {
      const found = infoData.findIndex(val => {
        return val.md5 + ".png" === this.$route.params.id;
      });
      if (found > 0) {
        this.carouselIndex = found;
        this.initialCarouselIndex = found;
        this.paused = true;
        this.$watch("carouselIndex", (newVal: number) => {
          if (newVal != this.initialCarouselIndex && this.paused) {
            this.paused = false;
          }
        });
      } else {
        this.carouselIndex = Math.floor(Math.random() * infoData.length);
      }
    });
  }

  download(url: string, filename: string) {
    download(url, filename);
  }

  alert(href: string) {
    const u = new URL(href, document.location.toString()).href;
    alert(u);
  }
}
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
img {
  height: 80vmin;
  width: auto;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.4);
  font-weight: bold;
}
@media (max-width: 500px) {
  .carousel-caption,
  .carousel-indicators {
    display: none;
  }
}
.carousel-caption > h3 {
  font-weight: bolder;
}
.carousel-caption > a {
  color: white;
  text-decoration: underline;
}
</style>
