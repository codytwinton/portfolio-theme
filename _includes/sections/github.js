(function() {
  let repos = {{ include.repos | jsonify }};

  for (let i = 0; i < repos.length; i++) {
    let item = repos[i];

    requestRepo(item.owner, item.repo)
      .then(function(response) {
        let linkId = item.repo + "-link";
        document.getElementById(linkId).href = response.html_url;

        let descId = item.repo + "-description";
        document.getElementById(descId).innerHTML = response.description;

        //document.getElementById(item.repo + '-language').innerHTML = 'Built in ' + response.language + ' on GitHub';
      })
      .catch(function(err) {
        console.error(err);
      });

    requestRepoLanguages(item.owner, item.repo)
      .then(function(response) {
        let langId = item.repo + "-languages";
        let langEl = document.getElementById(langId);

        let innerData = "";

        for (let k = 0; k < response.length; k++) {
          innerData = innerData + "<span class=\"badge badge-secondary\">" + response[k] + "</span>\n";
        }

        langEl.innerHTML = innerData;
      })
      .catch(function(err) {
        console.error(err);
      });
  }
})();

function requestRepo(owner, repo) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/" + owner + "/" + repo, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function(event) {
      if (
        this.readyState < 4 ||
        this.responseText == null ||
        this.responseText == undefined
      ) {
        reject({ request: xhr });
      } else {
        let response = JSON.parse(this.responseText);
        resolve(response);
      }
    };
    xhr.onerror = function(error) {
      reject(error);
    };
    xhr.send();
  });
}

function requestRepoLanguages(owner, repo) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.github.com/repos/" + owner + "/" + repo + "/languages",
      true
    );
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function(event) {
      if (
        this.readyState < 4 ||
        this.responseText == null ||
        this.responseText == undefined
      ) {
        reject({ request: xhr });
      } else {
        let response = JSON.parse(this.responseText);
        resolve(Object.keys(response));
      }
    };
    xhr.onerror = function(error) {
      reject(error);
    };
    xhr.send();
  });
}
