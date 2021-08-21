const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

const now = String(Date.now())

module.exports = function (eleventyConfig) {


  /* === START, add Assets to the bundle === */ 
  eleventyConfig.addPassthroughCopy("src/assets");
  /* === END, add Assets to the bundle === */ 

  
  eleventyConfig.addWatchTarget('./src/tailwind.css')
  eleventyConfig.addWatchTarget('./src/main.js')
  eleventyConfig.addWatchTarget('./src/**/*.js')
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  /* === START, add different image shortcodes to the bundle === */ 
  // eleventyConfig.setUseGitIgnore(false)
  eleventyConfig.addShortcode('version', function () { return now })
  eleventyConfig.addNunjucksAsyncShortcode("imageNewsHero", imageNewsHero);
  eleventyConfig.addNunjucksAsyncShortcode("imageNewsGallery", imageNewsGallery);
  eleventyConfig.addNunjucksAsyncShortcode("imageHomeHero", imageHomeHero);
  eleventyConfig.addNunjucksAsyncShortcode("imageShowcase", imageShowcase);
  eleventyConfig.addNunjucksAsyncShortcode("imageProjektHero", imageProjektHero);
  eleventyConfig.addNunjucksAsyncShortcode("imageDefault", imageDefault);
  eleventyConfig.addNunjucksAsyncShortcode("img", img);
  /* === END, add different image shortcodes to the bundle === */ 


  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd.LL.yyyy");
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "==="
  });

  /* === START, minify HTML, CSS, JS === */ 
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
  /* === END, minify HTML === */ 


  /* === START, add a list of tags === */
  // https://github.com/11ty/eleventy/issues/927
  eleventyConfig.addFilter("keys", obj => Object.keys(obj)); 
  eleventyConfig.addFilter("except", (arr=[], ...values) => {
    const data = new Set(arr);
    for (const item of values) {
      data.delete(item);
    }
    return [...data].sort();
  });



  /* === START, prev/next posts stuff === */
  // https://github.com/11ty/eleventy/issues/529#issuecomment-568257426
  eleventyConfig.addCollection("posts", function(collection) {
    const coll = collection.getFilteredByTag("post")
    for(let i = 0; i < coll.length; i++) {
      const prevPost = coll[i-1]
      const nextPost = coll[i+1]
      coll[i].data["prevPost"] = prevPost
      coll[i].data["nextPost"] = nextPost
    }
    return coll
  })
  /* === END, prev/next posts stuff === */


  async function imageNewsHero(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [320,640,960,1280,1440,1920,2560],
      formats: ["jpeg","webp"],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });
  
    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
  
    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  }

 
  async function imageDefault(src, classes, alt, sizes = "100vw", loading="lazy") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [160,320,640,1280,1920,null],
      formats: ['webp', 'jpeg'],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });
  
    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  
    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          class="${classes}"
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          alt="${alt}"
          loading="${loading}"
          decoding="async" />
      </picture>`;
  }



  async function img(src, classes, alt, sizes = "100vw", loading="lazy") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [160,320,640,1280,1920,null],
      formats: ['jpeg'],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });
  
    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  
    return `<img
      ${Object.values(metadata).map(imageFormat => {
        return ` srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}" `;
      }).join("\n")}        
        class="${classes}"
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="${loading}"
        decoding="async" />`;
  }








  async function imageNewsGallery(src, classes, alt, sizes) {
    let metadata = await Image(src, {
      widths: [320,640,960,1280,1440,1920,2560],
      formats: ["jpeg","webp"],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });
  
    let imageAttributes = {
      alt,
      class: classes,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
  
    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  }

  
  async function imageShowcase(src, classes, alt, sizes) {
    let metadata = await Image(src, {
      widths: [320,640,960,1280, null],
      formats: ["webp","jpeg"],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });
  
    let imageAttributes = {
      alt,
      class: classes,
      sizes,
      loading: "lazy",
      decoding: "async",
    };
  
    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
    
  console.log( stats );
  }
  
  
  /* === START, HomeHeroImage Auto Resize Function === */
  async function imageHomeHero(src, classes, alt, sizes) {
    
    let metadata = await Image(src, {
      widths: [640,1280,1920,2560, null],
      formats: ["webp", "jpg"],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });

    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  
    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          class="${classes}"
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          alt="${alt}"
          loading="eager"
          decoding="async">
      </picture>`;
  }
  /* === END, HomeHeroImage Auto Resize Function === */

  /* === START, imageProjektHero Auto Resize Function === */
  async function imageProjektHero(src, classes, alt, sizes) {
  
    let metadata = await Image(src, {
      widths: [640,1280,1920,2560, null],
      formats: ["webp", "jpg"],
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
    });

    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  
    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          class="${classes}"
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          alt="${alt}"
          loading="eager"
          decoding="async">
      </picture>`;
  }
  /* === END, imageProjektHero Auto Resize Function === */


  /* === START, 11ty export configuration === */
  /* pathPrefix: "/"; */
  return {
    dir: {
      input: 'src', // <--- everything else in 'dir' is relative to this directory! https://www.11ty.dev/docs/config/#directory-for-includes
    },
    templateFormats: [
      'html',
      'md',
      'njk',
      '11ty.js'
    ],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  }
  /* === END, 11ty export configuration === */
}