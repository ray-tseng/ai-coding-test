import ytdl from '@distube/ytdl-core';

async function test() {
  try {
    const info = await ytdl.getInfo('https://www.youtube.com/watch?v=Dlfe1OZ7Us8');
    console.log("Title:", info.videoDetails.title);
    console.log("Description:", info.videoDetails.description?.substring(0, 100));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
