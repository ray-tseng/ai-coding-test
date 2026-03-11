import https from "https";

function fetchVideoDetails(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (ytRes) => {
      let data = '';
      ytRes.on('data', (chunk) => data += chunk);
      ytRes.on('end', () => {
        try {
          const titleMatch = data.match(/<title>(.*?)<\/title>/);
          const descMatch = data.match(/<meta name="description" content="(.*?)">/);
          resolve({
            title: titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Unknown',
            description: descMatch ? descMatch[1] : 'No description'
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

fetchVideoDetails('https://www.youtube.com/watch?v=Dlfe1OZ7Us8').then(console.log).catch(console.error);
