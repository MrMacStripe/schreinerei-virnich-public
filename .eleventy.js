const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

const now = String(Date.now())

module.exports = function (eleventyConfig) {



  /* === START, add Assets to the bundle === */ 
  eleventyConfig.addPassthroughCopy("src/assets/meta");
  
  eleventyConfig.addWatchTarget('./src/tailwind.css')
  eleventyConfig.addWatchTarget('./src/main.js')
  eleventyConfig.addWatchTarget('./src/**/*.js')

  /* === START, add different image shortcodes to the bundle === */ 
  // eleventyConfig.setUseGitIgnore(false)
  eleventyConfig.addShortcode('version', function () { return now })
  eleventyConfig.addNunjucksAsyncShortcode("picture", picture);
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


  // generate responsive PICTURE element
  async function picture(src, classes, alt, sizes = "100vw", loading="lazy") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [160,320,640,960,1280,1600,1920,2560,null],
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
          title="${alt}"
          decoding="async" />
      </picture>`;
  }

  // generate responsive IMG element
  async function img(src, classes, alt, sizes = "100vw", loading="lazy") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [160,320,640,960,1280,1600,1920,2560,null],
      formats: ["jpeg"],
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
        title="${alt}"
        decoding="async" />`;
  }


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