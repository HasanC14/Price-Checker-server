const express = require("express");
const puppeteer = require("puppeteer");
require("dotenv").config();

const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());

const startScraping = async (product) => {
  const results = {};

  const browser = await puppeteer.launch({
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    headless: true,
    // defaultViewport: null,
    args: [
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920x1080",
    ],
    // args: [
    //   "--disable-setuid-sandbox",
    //   "--no-sandbox",
    //   "--single-process",
    //   "--start-maximized",
    //   "--no-zygote",
    // ],
  });

  const scrapeStarTech = async (page) => {
    await page.goto("https://www.startech.com.bd/");

    try {
      await page.click(".search-toggler");
      await page.waitForSelector("#search input[name=search]", {
        visible: true,
        timeout: 60000,
      });
      await page.type("#search input[name=search]", product);

      await page.waitForSelector("#search button", {
        visible: true,
        timeout: 60000,
      });
      await page.click("#search button");

      await page.waitForSelector(".main-content", {
        visible: true,
        timeout: 60000,
      });

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
    try {
      await page.goto("https://www.techlandbd.com/");
      console.log("Page loaded.");

      // Close popup if it exists
      const popupButton = await page.$(".popup-container button");
      if (popupButton) {
        await popupButton.click();
        console.log("Popup closed.");
      } else {
        console.log("No popup found.");
      }

      // Ensure the page is fully loaded and ready
      await page.waitForSelector(".header-search", {
        visible: true,
        timeout: 60000,
      });
      console.log(".header-search found.");

      // Click on the search input to focus
      await page.click(".header-search");
      await page.waitForSelector(".header-search input[name=search]", {
        visible: true,
        timeout: 60000,
      });
      console.log("Search input focused.");

      // Type the product name into the search input
      await page.type(".header-search input[name=search]", product, {
        delay: 100,
      });
      console.log(`Typed product name: ${product}`);

      // Click the search button
      await page.waitForSelector(".header-search button.search-button", {
        visible: true,
        timeout: 60000,
      });
      await page.click(".header-search button.search-button");
      console.log("Search button clicked.");

      // Wait for the search results to load
      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
        timeout: 60000,
      });
      console.log("Search results loaded.");

      // Extract product details
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
      console.log("Products scraped:", products);
    } catch (error) {
      console.error("Error scraping TechLand:", error);
    }
  };

  const scrapeRyans = async (page) => {
    await page.goto("https://www.ryans.com/");

    try {
      await page.waitForSelector(".search-input", {
        visible: true,
        timeout: 60000,
      });
      await page.type(".search-input", product);

      await page.waitForSelector(".search-btn", {
        visible: true,
        timeout: 60000,
      });
      await page.click(".search-btn");

      // await page.waitForSelector("#search-box-html", { visible: true, timeout: 60000 });
      await page.waitForSelector(".recent-view-section", {
        visible: true,
        timeout: 60000,
      });

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
      await page.waitForSelector(".new_m_searchbox input[name=product_name]", {
        visible: true,
        timeout: 60000,
      });
      await page.type(".new_m_searchbox input[name=product_name]", product);

      await page.waitForSelector(".new_m_searchbox button", {
        visible: true,
        timeout: 60000,
      });
      await page.click(".new_m_searchbox button");

      await page.waitForSelector(".product_column", {
        visible: true,
        timeout: 60000,
      });

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
        timeout: 60000,
      });
      await page.type(".header-search input[name=search]", product);

      await page.waitForSelector(".header-search button", {
        visible: true,
        timeout: 60000,
      });
      await page.click(".header-search button");

      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
        timeout: 60000,
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
        timeout: 60000,
      });
      await page.type(".header-search input[name=search]", product);

      await page.waitForSelector(".header-search button", {
        visible: true,
        timeout: 60000,
      });
      await page.click(".header-search button");

      await page.waitForSelector(".main-products-wrapper", {
        visible: true,
        timeout: 60000,
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
  // await scrapeStarTech(page);
  await scrapeTechLand(page);
  // await scrapeRyans(page);
  // await scrapePcHouse(page);
  // await scrapeUltraTech(page);
  // await scrapeBinary(page);

  await browser.close();
  return results;
};

app.get("/", (req, res) => {
  res.send("Welcome to the Price Scraper API!");
});

app.get("/scrape", async (req, res) => {
  const { product } = req.query;
  // console.log(headless);
  if (!product) {
    return res
      .status(400)
      .send({ error: "Product query parameter is required" });
  }
  // const isHeadless = headless === "true";
  try {
    const results = await startScraping(product);
    res.json(results);
  } catch (error) {
    res.status(500).send({ error: "Error during scraping" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
