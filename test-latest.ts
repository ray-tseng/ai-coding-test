import https from "https";

function fetchLatestVideo(channelId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const tabName = channelId === '@yutinghaofinance' ? 'streams' : 'videos';
    https.get(`https://www.youtube.com/${channelId}/${tabName}`, (ytRes) => {
      let data = '';
      ytRes.on('data', (chunk) => data += chunk);
      ytRes.on('end', () => {
        try {
          const match = data.match(/var ytInitialData = (\{.*?\});<\/script>/);
          if (match) {
            const json = JSON.parse(match[1]);
            const tabs = json.contents.twoColumnBrowseResultsRenderer.tabs;
            const videosTab = tabs.find((t: any) => t.tabRenderer && t.tabRenderer.content && t.tabRenderer.content.richGridRenderer);
            const items = videosTab.tabRenderer.content.richGridRenderer.contents;
            const latestItem = items.find((i: any) => i.richItemRenderer);
            
            if (latestItem) {
              const v = latestItem.richItemRenderer.content.videoRenderer;
              resolve({
                title: v.title.runs[0].text,
                videoId: v.videoId,
                url: 'https://www.youtube.com/watch?v=' + v.videoId,
                date: v.publishedTimeText?.simpleText
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

fetchLatestVideo('@Gooaye').then(console.log).catch(console.error);
