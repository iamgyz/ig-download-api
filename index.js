const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const URL = require("url").URL;

async function handleQuery(url, need_all) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
    };
    const res = await fetch(url, { method: "GET", headers: headers });
    const html = await res.text();
    //console.log(html);
    const json = html2json(html, need_all);
    return json;
  } catch (e) {
    throw e;
  }
}

function validateURL(url) {
  try {
    _u = new URL(url);
    if (_u.hostname.indexOf("instagram.com") != -1) return true;
    else return false;
  } catch (err) {
    return false;
  }
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
      result.msg = "No response from server";
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
  let scripts = dom.window.document.getElementsByTagName("script");
  try {
    for (let i = 0; i < scripts.length; i++) {
      if (
        scripts[i].textContent &&
        scripts[i].textContent.indexOf("window._sharedData") != -1
      ) {
        let script = scripts[i].textContent;
        let start = script.indexOf("=") + 1;
        let len = script.lastIndexOf(";") - start;
        json = JSON.parse(script.substr(start, len));
        //check if multiple
        if (
          json.entry_data.PostPage[0].graphql.shortcode_media
            .edge_sidecar_to_children &&
          json.entry_data.PostPage[0].graphql.shortcode_media
            .edge_sidecar_to_children.edges &&
          json.entry_data.PostPage[0].graphql.shortcode_media
            .edge_sidecar_to_children.edges.length > 0
        ) {
          let edges =
            json.entry_data.PostPage[0].graphql.shortcode_media
              .edge_sidecar_to_children.edges;
          for (let j = 0; j < edges.length; j++) {
            if (need_all) {
              results.push(edges[j].node.display_resources);
            }
            //assume last element is highest resolution
            else {
              results.push(
                edges[j].node.display_resources[
                  edges[j].node.display_resources.length - 1
                ]
              );
            }
          }
        } else {
          if (need_all) {
            results.push(
              json.entry_data.PostPage[0].graphql.shortcode_media
                .display_resources
            );
          }
          //assume last element is highest resolution
          else {
            results.push(
              json.entry_data.PostPage[0].graphql.shortcode_media
                .display_resources[json.entry_data.PostPage[0].graphql.shortcode_media
                .display_resources.length-1]
            );
          }
        }
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return results;
}

module.exports = async (req, res) => {
  // Set CORS headers for now.sh
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.query.url) {
    try {
      let data = []
      if (req.query.all && Number(req.query.all) == 1) {
        data = await lambda(req.query.url, true);
      } else {
        data = await lambda(req.query.url, false);
      }
      res.status(200).send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(400).send({});
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