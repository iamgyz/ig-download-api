const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const url = require("url");

async function handleQuery(url, need_all) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
  };
  const res = await fetch(url, { method: "GET", headers: headers });
  const html = await res.text();
  const json = html2json(html, need_all);
  return json;
}

function validateURL(_url) {
  const { hostname } = url.parse(_url);
  return hostname && hostname.includes("instagram.com");
}

async function lambda(url, need_all) {
  let result = {
    status: "",
    data: [],
    msg: ""
  };
  if (validateURL(url)) {
    let data = await handleQuery(url, need_all);
    if (data.length > 0) {
      result.status = "ok";
      result.data = data;
    } else {
      result.status = "err";
      result.msg = "No response from server, maybe private";
    }
  } else {
    result.msg = "invalid url";
    result.status = "err";
  }
  return result;
}

function html2json(html, need_all) {
  let results = [];
  const dom = new JSDOM(html);
  /*
    1. dom.window.document.getElementsByTagName return NodeList (Not array)
    2. need to convert to array
    Solution:
      1. Array.from(xxx)
      2. [...xxx] //Destructing
  */
  let scripts = [...dom.window.document.getElementsByTagName("script")];
  try {
    const script = scripts
      .map(item => {
        const { textContent = "" } = item;
        return textContent;
      })
      .filter(textContext => {
        return textContext.includes("window._sharedData");
      })[0];
    let start = script.indexOf("=") + 1;
    let len = script.lastIndexOf(";") - start;
    json = JSON.parse(script.substr(start, len));
    //check if multiple
    const { shortcode_media } = json.entry_data.PostPage[0].graphql;
    const { edge_sidecar_to_children } = shortcode_media;
    if (
      edge_sidecar_to_children &&
      edge_sidecar_to_children.edges &&
      edge_sidecar_to_children.edges.length
    ) {
      let edges = edge_sidecar_to_children.edges;
      if (need_all) {
        results = edges.map(item => item.node.display_resources);
      }
      //assume last element is highest resolution
      else {
        results = edges.map(
          item =>
            item.node.display_resources[item.node.display_resources.length - 1]
        );
      }
    }
    //else, not multiple
    else {
      if (need_all) {
        results = [shortcode_media.display_resources];
      }
      //assume last element is highest resolution
      else {
        results = [
          shortcode_media.display_resources[
            shortcode_media.display_resources.length - 1
          ]
        ];
      }
    }
  } catch (e) {
    console.log(e);
  }
  return results;
}

module.exports = async (req, res) => {
  const { all, url } = req.query;
  const options = {
    need_all: Number(all) === 1
  };
  // Set CORS headers for now.sh
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (!url) {
    res.status(400).send({});
    return;
  }
  try {
    let data = await lambda(url, options.need_all);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
};

/*
(async function() {
  //let url = "https://www.instagram.com/p/B3Z4FWLBZ_i/"; //single
  let url = "https://www.instagram.com/p/B2znCG_gUt-/"; //multi
  const a = await lambda(url, true);
  console.log(a);
})();
*/