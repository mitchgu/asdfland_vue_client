# asdfland URL Shortener - Vue.JS Frontend

## The only URL shortener you'll ever need.

* **3 link types** for 3 use cases
  * **Random** (like bit.ly)
    * Generates a **short, completely random** link (high entropy) (Ex: `asdf.land/wHRbxt`)
    * Good for **maximal shortness**, or making a long link that is astronomically **hard to guess** (effectively private)
    * Best for **sending electronically** in messages, email, documents to reduce clutter
  * **Readable** (like shoutkey.com)
    * Generates a **readable** link composed of common words (Ex: `asdf.land/ankle`)
    * Good for **sharing verbally** for an audience or nearby collaborators
  * **Custom** (like bit.ly, tinyurl.com)
    * choose a **custom** link (Ex: `asdf.land/XYZ.party.signup`)
    * Good for **memorable links** to put in publicity or to reinforce branding
    * Also good for creating a **personal library** of bookmarks that are named memorably (`asdf.land/my_resume`, `asdf.land/catgifs`)
* **Endlessly parametrizable** links. Change everything about your link to your liking: length, word dictionary, expiration, custom slug, password protection, analytics
* **Live preview** links before creating them
* **Manage links** in the dashboard (no account required)
  * **Edit** any existing link's slug or destination
  * **Associate** multiple shortlinks with one destination
  * **Annotate** links with descriptions
  * **Track** link visits over time
* **Open source** and **easily self-hostable** on a custom domain
* **Ludicrously fast**: powered by **Go** and **Redis**

## Getting Started
If you just want to get asdfland running, refer to the README for main repository (the go backend) at [mitchgu/asdfland](https://github.com/mitchgu/asdfland). This repository just hosts the sources for the default Vue.js frontend, which becomes embedded in the main repository. If you're interested in customizing the frontend by itself or in tandem with the backend, read on.

## Building the frontend


1. `git clone https://github.com/mitchgu/asdfland_vue_client.git && cd asdfland_vue_client`
2. `npm install`
3. `npm run dev` to run a liveupdating devserver at `localhost:8080` by default
4. `npm run build` to build production files to the `dist` folder

The frontend won't work if it's not pointed to a running backend. By default, it looks for a backend running at `localhost:9090`. You can change this by editing `config/index.js`. The `proxyTable` section of this file proxies all requests starting with `/api` to the address of the backend.