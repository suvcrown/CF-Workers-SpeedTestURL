export default {
  async fetch(request) {
    // 创建一个新的 URL 对象
    let url = new URL(request.url);
    let path = url.pathname.substring(1);
    let isSecure = url.protocol.startsWith("https");
    
    if (!path) {
      // 路径为空，将 bytes 赋值为 200MB（此部分将被忽略，因为我们不再使用 bytes）
      path = "200M";
    } else if (path === "locations") {
      let targetUrl = `http${isSecure ? 's' : ''}://speed.cloudflare.com/locations`;
      let cfRequest = new Request(targetUrl, request);
      let response = await fetch(cfRequest);
      return response;
    } else {
      // 其他路径，进行正常的处理
      const regex = /^(\d+)([a-z]?)$/i;
      const match = path.match(regex);
      if (!match) {
        // 路径格式不正确，返回错误
        return new Response("路径格式不正确", {
          status: 400,
        });
      }

      const bytesStr = match[1];
      const unit = match[2].toLowerCase();

      // 转换单位
      let bytes = parseInt(bytesStr, 10);
      if (unit === "k") {
        bytes *= 1000;
      } else if (unit === "m") {
        bytes *= 1000000;
      } else if (unit === "g") {
        bytes *= 1000000000;
      }
    }

    // 使用固定的测速地址
    let targetUrl = "https://speedtest.poorhub.pro/cf.7z";
    let cfRequest = new Request(targetUrl, request);
    let response = await fetch(cfRequest);

    // 将测试结果反馈给用户
    return response;
  }
};
