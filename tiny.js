import fs from "node:fs";

async function tinyImage(fileName) {
  const fileData = await Bun.file(`./media/${fileName}`).arrayBuffer();

  const response = await fetch("https://tinypng.com/backend/opt/store", {
    method: "POST",
    body: fileData,
    headers: {
      "Host": "tinypng.com",
      "Connection": "keep-alive",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
      "sec-ch-ua-platform": '"macOS"',
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "Content-Type": "application/octet-stream",
      "sec-ch-ua-mobile": "?0",
      "Origin": "https://tinypng.com",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": "https://tinypng.com/",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cookie": "__stripe_mid=cade9417-8692-4067-94e2-943e26af83bad0b76c; sess=eyJpZCI6IjBiZjA2YzEwLWU0YzQtNGQ4ZS04ODU4LWEwMDllN2NiZjc0MyIsInRva2VuIjoiMFA0R2JwTTR5UXRmTFlUS3N5MXZQd0piVlZYUW1iOXY4eXRQQzVyV3ZNTlozYzhzIiwibm93IjoyMDI3MH0=; sess.sig=7bMkMZV2e3RU8TFhc0ADEYTzeiI",
      "dnt": "1",
      "sec-gpc": "1"
    },
  });

  const result = await response.json();

  const processRes = await fetch("https://tinypng.com/backend/opt/process", {
    method: "POST",
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1"
    },
    body: JSON.stringify({
      key: result.key,
      originalSize: result.size,
      originalType: "image/png",
    }),
  });
  const processJson = await processRes.json();
  const downloadUrl = processJson.url;

  const downloadRes = await fetch(downloadUrl);
  const arrayBuffer = await downloadRes.arrayBuffer();

  fs.mkdirSync("./media_tmp", { recursive: true });

  await Bun.write(`./media_tmp/${fileName}`, arrayBuffer);

  console.log(`已保存压缩图片: ./media_tmp/${fileName}`);
}


fs.readdirSync("./media").forEach(async (fileName) => {
  await tinyImage(fileName);
});