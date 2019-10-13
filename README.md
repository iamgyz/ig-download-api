# Quick IG download micro service
[![Build Status](https://travis-ci.org/iamgyz/ig-download-api.svg?branch=master)](https://travis-ci.org/iamgyz/ig-download-api)

A simple serverless function host on now.sh, support both picture and video.

# Usage
Request(A single picture)
```
https://ig.now.sh/?url=https://www.instagram.com/p/B3Z4FWLBZ_i
```
Response 
```json
{"status":"ok","response":{"data":[{"src":"https://scontent-sjc3-1.cdninstagram.com/vp/81534df76a2f43d36c1d9b2487339553/5E1B1A1F/t51.2885-15/e35/70938374_215112916142986_8631580776312001448_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=1&se=7","config_width":1080,"config_height":1036}],"is_video":false},"msg":""}
```

If you need all resolutions of pics:

Request
```
https://ig.now.sh/?url=https://www.instagram.com/p/B3Z4FWLBZ_i&all=1
```
Response
```json
{"status":"ok","response":{"data":[[{"src":"https://scontent-sjc3-1.cdninstagram.com/vp/6a23f047b6f269c4ab8debda6ec73e8d/5E2AC9FA/t51.2885-15/sh0.08/e35/s640x640/70938374_215112916142986_8631580776312001448_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=1","config_width":640,"config_height":613},{"src":"https://scontent-sjc3-1.cdninstagram.com/vp/ee33c45c314014ca38c504f01b174c72/5E26EFFA/t51.2885-15/sh0.08/e35/s750x750/70938374_215112916142986_8631580776312001448_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=1","config_width":750,"config_height":719},{"src":"https://scontent-sjc3-1.cdninstagram.com/vp/81534df76a2f43d36c1d9b2487339553/5E1B1A1F/t51.2885-15/e35/70938374_215112916142986_8631580776312001448_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=1&se=7","config_width":1080,"config_height":1036}]],"is_video":false},"msg":""}
```


Request(Video)
```
https://ig.now.sh/?url=https://www.instagram.com/p/B3fBsJQgMKQ/
```
Response
```json
{"status":"ok","response":{"data":[{"src":"https://scontent-sjc3-1.cdninstagram.com/v/t50.2886-16/72967625_769950157157529_7377479541705321888_n.mp4?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=109&oe=5DA552BF&oh=b9f763afc13c40db33cdffb78937b24d"}],"is_video":true},"msg":""}
```


# Install
```
npm install
```

# Publish
```
now
```

# Local test
```
now dev
```

# How to deploy with Zeit Now
https://github.com/zeit/now/blob/canary/README.md
