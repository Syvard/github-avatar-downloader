var request = require('request');
var requestToken = require('./Secret').GITHUB_TOKEN;
const repoOwner = process.argv[2];
const repoName = process.argv[3];
console.log('Welcome to the GitHub Avatar Downloader!');
var fs = require('fs')

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      token: requestToken,
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
         throw err;
       })
         .pipe(fs.createWriteStream(filePath).on('finish', function() {console.log('Image downloaded.')}));
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  var array = JSON.parse(result);
  makeFolder('./avatars');
  makeFolder('./avatars/' + repoOwner);

  var path = './avatars/' + repoOwner + '/';

  array.forEach((ele) => {
    var url = ele.avatar_url;
    downloadImageByURL(url, path + ele.login + '.jpg');
  });
});

function makeFolder(path){
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
}