;(function() {
  let repos = JSON.parse(`{{ include.repos | jsonify }}`)

  for (let i = 0; i < repos.length; i++) {
    let item = repos[i]

    requestRepo(item.owner, item.repo)
      .then(function(response) {
        let descId = `${item.repo}-description`
        document.getElementById(descId).innerHTML = response.description
      })
      .catch(function(err) {
        console.error(err)
      })

    requestRepoLanguages(item.owner, item.repo)
      .then(function(response) {
        let langEl = document.getElementById(`${item.repo}-languages`)
        langEl.innerHTML = response
          .map(function(lang) {
            return `<span class="badge badge-secondary">${lang}</span>`
          })
          .join('\n')
      })
      .catch(function(err) {
        console.error(err)
      })
  }
})()

function requestRepo(owner, repo) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    let url = `https://api.github.com/repos/${owner}/${repo}`
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = function(event) {
      if (this.status < 200 || this.status > 299) {
        reject({ request: xhr })
      } else {
        let response = JSON.parse(this.responseText)
        resolve(response)
      }
    }
    xhr.onerror = function(error) {
      reject(error)
    }
    xhr.send()
  })
}

function requestRepoLanguages(owner, repo) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    let url = `https://api.github.com/repos/${owner}/${repo}/languages`
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = function(event) {
      if (this.status < 200 || this.status > 299) {
        reject({ request: xhr })
      } else {
        let response = JSON.parse(this.responseText)
        resolve(Object.keys(response))
      }
    }
    xhr.onerror = function(error) {
      reject(error)
    }
    xhr.send()
  })
}
