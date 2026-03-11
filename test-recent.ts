import http from "http";

http.get("http://localhost:3000/api/recent-videos?channel=@Gooaye", (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log(data.substring(0, 500)));
});
