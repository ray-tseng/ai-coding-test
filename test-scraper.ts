import { getSubtitles } from 'youtube-captions-scraper';

async function test() {
  try {
    const videoId = 'Dlfe1OZ7Us8'; // Gooaye EP642
    const captions = await getSubtitles({
      videoID: videoId,
      lang: 'zh-TW' // default: `en`
    });
    console.log("Success, items:", captions.length);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
