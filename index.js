addEventListener('fetch', event => {
  // let callFetch = new Promise(
  //   function(resolve, reject) {
  //     console.log("inside the function")
  //     resolve(fetch("https://cfw-takehome.developers.workers.dev/api/variants"))
  //   });
  // let stuff = fetchData();
  event.respondWith(fetchData());
})

function fetchData() {
  console.log("fetching data");
  return fetch("https://cfw-takehome.developers.workers.dev/api/variants")
  .then(result => result.json())
  .then(data => {
    return new Promise(
      function(resolve, reject) {
        response = new Response(JSON.stringify(data));
        resolve(response);
    });
  })
  .catch(error => {
    console.log("there was an error", error);
  });
}
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request){
  return new Response('hello world', {
    headers: { 'content-type': 'text/plain' },
  })
}
