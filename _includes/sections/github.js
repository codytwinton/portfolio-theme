(function () {
  let repos = JSON.parse('{{ include.repos | jsonify }}');

  for (let i = 0; i < repos.length; i++) {
    let item = repos[i];
    let repoAPIURL = 'https://api.github.com/repos/' + item.owner + '/' + item.repo;

    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', repoAPIURL, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = function (event) {

      if (this.readyState < 4) {
        return;
      }
      if (!this.responseText) {
        console.error('No response text');
        return;
      }

      let response = JSON.parse(this.responseText);

      document.getElementById(item.repo + '-link').href = response.html_url;
      document.getElementById(item.repo + '-description').innerHTML = response.description;
      document.getElementById(item.repo + '-language').innerHTML = 'Built in ' + response.language + ' on GitHub';
    };

    xhttp.onerror = function (error) {
      console.error(error);
    }

    xhttp.send();
  }
})();
