<template>
  <div class="hello">
    <!--
    <div class="grid">

    </div>
    -->
    <b-carousel
      style="{

      }"
      :interval="4000"
      controls
      indicators
      id="carousel"
      no-hover-pause
      v-model="carouselIndex"
    >
      <b-carousel-slide
        class="crisp"
        img-height="auto"
        img-width="10px"
        v-for="entry in paintings"
        v-bind:key="entry.name"
        background="black"
        v-bind:caption="infoData[entry.name].title"
        v-bind:text="infoData[entry.name].ckey"
        v-bind:id="entry.name"
      >
        <template v-slot:img>
          <img
            v-bind:src="`https://cdn.yogstation.net/paintings/${entry.name}`"
            v-bind:alt="entry.name"
          />
        </template>

        <router-link v-slot="{ href }" v-bind:to="`/${entry.name}`">
          <b-button variant="link" v-on:click="alert(href)" v-bind:href="href">
            Permalink
          </b-button>
        </router-link>
        <b-button
          variant="link"
          v-on:click="
            download(
              `https://cdn.yogstation.net/paintings/${entry.name}`,
              entry.name
            )
          "
          >Download</b-button
        >
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { download } from "@/download";

@Component
export default class Library extends Vue {
  //Data
  // noinspection JSMismatchedCollectionQueryUpdate
  private paintings: IndexEntry[] = [];
  private infoData: Record<string, Info> = {};
  private carouselIndex = 0;

  mounted() {
    this.refresh();
  }

  async refresh() {
    const index = await fetch("https://cdn.yogstation.net/paintings/json/");

    const info = await fetch("https://cdn.yogstation.net/paintings/.info.json");
    const infoData = (await info.json()).public as Info[];

    const obj = this.infoData;
    infoData.forEach(val => {
      Vue.set(obj, val.md5 + ".png", val);
    });
    this.paintings = (await index.json()) as IndexEntry[];

    this.$nextTick(() => {
      const found = this.paintings.findIndex(val => {
        return val.name === this.$route.params.id;
      });
      if (found > 0) {
        this.carouselIndex = found;
      } else {
        this.carouselIndex = Math.floor(Math.random() * this.paintings.length);
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
@media (max-width:500px) {
  .carousel-caption, .carousel-indicators {
    display: none;
  }
}
.carousel-caption > h3 {
  font-weight: bolder;
}
</style>
