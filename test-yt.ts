import { YoutubeTranscript } from "youtube-transcript";

async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=jNQXAC9IVRw"; // Me at the zoo
    const transcriptItems = await YoutubeTranscript.fetchTranscript(url, { lang: 'en' })
      .catch(() => YoutubeTranscript.fetchTranscript(url));
    console.log("Success, items:", transcriptItems.length);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
