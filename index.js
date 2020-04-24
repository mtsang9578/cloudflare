addEventListener('fetch', event => {
  // event.respondWith(fetchData());
  event.respondWith(handleRequest(event.request))
})

function fetchData() {
  console.log("fetching data");
  return fetch("https://cfw-takehome.developers.workers.dev/api/variants")
  .then(result => result.json())
  .then(data => {
    return new Promise(
      function(resolve, reject) {
        urls = data["variants"]
        index = Math.floor(Math.random() * 2)
        console.log(urls[index]);
        res = fetch(urls[index])
        resolve(res);
    });
  })
  .catch(error => {
    console.log("there was an error", error);
  });
}

class ElementHandler {
  element(element) {
   console.log(`Incoming element: ${element.tagName}`);
  }
}




/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request){
  let response = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");
  let data = await response.json();
  let urls = data["variants"];
  index = Math.floor(Math.random() * 2);
  return fetch(urls[index]);
  let newResponse = new HTMLRewriter()
  .on('*', new ElementHandler())
  .transform(response);
  return newResponse;
}
