const IMAGE_1 = "https://raw.githubusercontent.com/mtsang9578/cloudflare-images/master/headshot.jpg"
const IMAGE_2 = "https://raw.githubusercontent.com/mtsang9578/cloudflare-images/master/georgiatech.jpg"
const IMAGE_3 = "https://raw.githubusercontent.com/mtsang9578/cloudflare-images/master/dog2.jpeg"
const IMAGE_4 = "https://raw.githubusercontent.com/mtsang9578/cloudflare-images/master/cloudflarelogo.png"
const IMAGE_5 = "https://raw.githubusercontent.com/mtsang9578/cloudflare-images/master/dog1.jpg"
const DESC_1 = "Hi, I'm Mya! I don't have a personal website so I made this mini profile here instead. Click Next to learn more about me!"
const DESC_2 = "This is my school, Georgia Tech. It's in the beautiful city of Atlanta! I'm a third year in computer science student here with concentrations in AI and Networking."
const DESC_3 = "My technical interests are in web development and mobile development. Some of my personal interests right now are spending time with my dog, Lucky, and playing video games with my brothers. I also like to bake!"
const DESC_4 = "That's about it! Thanks for the Cloudflare coding challenge!"
const DESC_5 = "Bonus Picture!"


addEventListener('fetch', event => {
  // event.respondWith(fetchData());
  console.log(IMAGE_1)
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request){
  let variants = await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
  let data = await variants.json()
  let urls = data["variants"]
  let index = 0
  let cookie = request.headers.get('Cookie')

  //Check for cookie before redirecting to a new variant
  if(cookie && cookie.includes('variant=0')) {
    index = 0
  } else if(cookie && cookie.includes('variant=1')) {
    index = 1
  } else {
     index = Math.floor(Math.random() * 2)
  }

  //Add a new cookie to track which variant the user visited
  let response = await fetch(urls[index])
  response = new Response(response.body, response)
  response.headers.set('Set-Cookie', `variants=${index}`)

  //
  let newResponse = new HTMLRewriter()
  .on('title', {
    element(element) {
      element.setInnerContent("Mya's Cloudflare Challenge")
    },
  })
  .on('h1#title', {
    element(element) {
      element.setInnerContent("Mya's Mini Profile");
      element.setAttribute("class", element.getAttribute("class") + " font-black m-4");
    }
  })
  .on('p#description', {
    element(element) {
      element.before(
        `<script>
          var i = 0;
          descriptions = [\"${DESC_1}\", \"${DESC_2}\", \"${DESC_3}\", \"${DESC_4}\", \"${DESC_5}\"]
          images = [\"${IMAGE_1}\", \"${IMAGE_2}\", \"${IMAGE_3}\", \"${IMAGE_4}\", \"${IMAGE_5}\"]
          function next() {
            i = i+1;
            document.getElementById('slide').setAttribute('src', images[i%images.length]);
            document.getElementById('description').innerHTML = descriptions[i%descriptions.length];
          }
        </script>
        <div class="p-4 mb-6 bg-gray-200">
              <img height="300px" id="slide" src=\"${IMAGE_1}\">
        </div>`, {html:true})
      element.setInnerContent(DESC_1)
      element.setAttribute("class", element.getAttribute("class") + " p-1")
    }
  })
  .on('a#url', {
    element(element) {
      element.setAttribute('onclick', 'next()')
      element.setAttribute('href', '#')
      element.setInnerContent('Next')
    }
  })
  .transform(response);

  return newResponse;
}
