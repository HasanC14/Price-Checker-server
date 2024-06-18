const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const startScraping = async (product) => {
  const results = {};
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const scrapeStarTech = async (page) => {
    await page.goto("https://www.startech.com.bd/");

    try {
      await page.waitForSelector("#search input[name=search]", {
        visible: true,
      });
      await page.type("#search input[name=search]", product);

      await page.waitForSelector("#search button", { visible: true });
      await page.click("#search button");

      await page.waitForSelector(".main-content", { visible: true });

      const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".p-item"));
        return items.map((item) => {
          const name = item.querySelector(".p-item-name")
            ? item.querySelector(".p-item-name").innerText
            : "Name not found";
          const price = item.querySelector(".p-item-price")
            ? item.querySelector(".p-item-price").innerText
            : "Out Of Stock";
          const img = item.querySelector(".p-item-img img")
            ? item.querySelector(".p-item-img img").src
            : "Image not found";
          const link = item.querySelector(".p-item-img a")
            ? item.querySelector(".p-item-img a").href
            : "Link not found";
          return { name, price, img, link };
        });
      });

      results["StarTech"] = products;
    } catch (error) {
      console.error("Error scraping StarTech:", error);
    }
  };

  const scrapeTechLand = async (page) => {
    await page.goto("https://www.techlandbd.com/");

    try {
      const popupButton = await page.$(".popup-container button");
      if (popupButton) {
        await popupButton.click();
        console.log("Popup closed.");
      } else {
        console.log("No popup found.");
      }

      await page.waitForSelector(".header-search input[name=search]", {
        visible: true,
      });
      await page.type(".header-search input[name=search]", product);

      await page.waitForSelector(".header-search button", {
        visible: true,
      });
      await page.evaluate(() => {
        document.querySelector(".header-search button").click();
      });

      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
      });

      const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".product-layout"));
        return items.map((item) => {
          const name = item.querySelector(".name")
            ? item.querySelector(".name").innerText
            : "Name not found";
          const price = item.querySelector(".price-new")
            ? item.querySelector(".price-new").innerText
            : "Out Of Stock";
          const img = item.querySelector(".image img")
            ? item.querySelector(".image img").src
            : "Image not found";
          const link = item.querySelector(".product-img")
            ? item.querySelector(".product-img").href
            : "Link not found";
          return { name, price, img, link };
        });
      });

      results["TechLand"] = products;
    } catch (error) {
      console.error("Error scraping TechLand:", error);
    }
  };

  const scrapeRyans = async (page) => {
    await page.goto("https://www.ryans.com/");

    try {
      await page.waitForSelector(".search-input", {
        visible: true,
      });
      await page.type(".search-input", product);

      await page.waitForSelector(".search-btn", { visible: true });
      await page.click(".search-btn");

      // await page.waitForSelector("#search-box-html", { visible: true });
      await page.waitForSelector(".recent-view-section", { visible: true });

      const products = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll(".category-single-product")
        );
        return items.map((item) => {
          const name = item.querySelector(".p-item-name")
            ? item.querySelector(".p-item-name").innerText
            : "Name not found";
          const price = item.querySelector(".pr-text")
            ? item.querySelector(".pr-text").innerText
            : "Out Of Stock";
          const img = item.querySelector(".image-box img")
            ? item.querySelector(".image-box img").src
            : "Image not found";
          const link = item.querySelector(".image-box a")
            ? item.querySelector(".image-box a").href
            : "Link not found";
          return { name, price, img, link };
        });
      });

      results["Ryans"] = products;
    } catch (error) {
      console.error("Error scraping Ryans:", error);
    }
  };

  const scrapeBinary = async (page) => {
    await page.goto("https://www.binarylogic.com.bd/");

    try {
      await page.waitForSelector("#searchInput", {
        visible: true,
      });
      await page.type("#searchInput", product);

      await page.waitForSelector(".new_m_searchbox button", { visible: true });
      await page.click(".new_m_searchbox button");

      await page.waitForSelector(".product_column", { visible: true });

      const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".single_product"));
        return items.map((item) => {
          const name = item.querySelector(".p-item-name")
            ? item.querySelector(".p-item-name").innerText
            : "Name not found";
          const price = item.querySelector(".current_price")
            ? item.querySelector(".current_price").innerText
            : "Out Of Stock";
          const img = item.querySelector(".p-item-img img")
            ? item.querySelector(".p-item-img img").src
            : "Image not found";
          const link = item.querySelector(".p-item-img a")
            ? item.querySelector(".p-item-img a").href
            : "Link not found";
          return { price, img, link };
        });
      });

      results["Binary"] = products;
    } catch (error) {
      console.error("Error scraping Binary:", error);
    }
  };

  const scrapeUltraTech = async (page) => {
    await page.goto("https://www.ultratech.com.bd/");

    try {
      const popupButton = await page.$(".popup-container button");
      if (popupButton) {
        await popupButton.click();
        console.log("Popup closed.");
      } else {
        console.log("No popup found.");
      }

      await page.waitForSelector(".header-search input[name=search]", {
        visible: true,
      });
      await page.type(".header-search input[name=search]", product);

      await page.waitForSelector(".header-search button", { visible: true });
      await page.click(".header-search button");

      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
      });

      const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".product-layout"));
        return items.map((item) => {
          const name = item.querySelector(".name")
            ? item.querySelector(".name").innerText
            : "Name not found";
          const price = item.querySelector(".price-new")
            ? item.querySelector(".price-new").innerText
            : "Out Of Stock";
          const img = item.querySelector(".image img")
            ? item.querySelector(".image img").src
            : "Image not found";
          const link = item.querySelector(".product-img")
            ? item.querySelector(".product-img").href
            : "Link not found";
          return { name, price, img, link };
        });
      });

      results["Ultra Technology"] = products;
    } catch (error) {
      console.error("Error scraping Ultra Technology", error);
    }
  };

  const scrapePcHouse = async (page) => {
    await page.goto("https://www.pchouse.com.bd/");

    try {
      const popupButton = await page.$(".popup-container button");
      if (popupButton) {
        await popupButton.click();
        console.log("Popup closed.");
      } else {
        console.log("No popup found.");
      }

      await page.waitForSelector(".header-search input[name=search]", {
        visible: true,
      });
      await page.type(".header-search input[name=search]", product);

      await page.waitForSelector(".header-search button", { visible: true });
      await page.click(".header-search button");

      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
      });

      const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".product-layout"));
        return items.map((item) => {
          const name = item.querySelector(".name")
            ? item.querySelector(".name").innerText
            : "Name not found";
          const price = item.querySelector(".price-new")
            ? item.querySelector(".price-new").innerText
            : "Out Of Stock";
          const img = item.querySelector(".image img")
            ? item.querySelector(".image img").src
            : "Image not found";
          const link = item.querySelector(".product-img")
            ? item.querySelector(".product-img").href
            : "Link not found";
          return { name, price, img, link };
        });
      });

      results["PC House"] = products;
    } catch (error) {
      console.error("Error scraping PC House", error);
    }
  };

  const page = await browser.newPage();
  await scrapeStarTech(page);
  await scrapeTechLand(page);
  await scrapeRyans(page);
  await scrapePcHouse(page);
  await scrapeUltraTech(page);
  await scrapeBinary(page);

  await browser.close();
  return results;
};

app.get("/scrape", async (req, res) => {
  const { product } = req.query;

  if (!product) {
    return res
      .status(400)
      .send({ error: "Product query parameter is required" });
  }

  try {
    const results = await startScraping(product);
    res.json(results);
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).send({ error: "Error during scraping" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
