const mongoose = require('mongoose');
const validUrl = require('valid-url');
const UrlShorten = mongoose.model("UrlShorten");
const shortid = require('shortid');
const errorUrl = 'http://localhost/error';
var port = process.env.PORT || 3000; 

module.exports = app => {
  // get the website and redirect
  app.get('/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode }); // find item in database
    if (item) {
      return res.redirect(item.originalUrl); // redirect to the original url given in the database
    } else {
      return res.redirect(errorUrl); // error 
    }
  });

  // new shortened url
  app.post("/api/website", async (req, res) => {
    // generate a shortened id with shortid.generate();
    // CHANGE ON BACKEND SO THAT IT CAN BE PASSED IN AS A FORM AND NOT JSON
    const { originalUrl } = req.body; // shortBaseURl = base of the url
    const shortBaseUrl = 'ryan-url-shortener.herokuapp.com/';
    if (!validUrl.isUri(shortBaseUrl)) { // error
      return res.status(401).json("Invalid Base Url");
    }
    const urlCode = shortid.generate();
    const updatedAt = new Date(); 
    if(validUrl.isUri(originalUrl)) {
      // validate the url
      try {
        const item = await UrlShorten.findOne({ originalUrl: originalUrl }); // get the item
        if (item) {
          res.status(200).json(item);
        } else {
          shortUrl = shortBaseUrl + "/" + urlCode;
          const item = new UrlShorten({
            originalUrl, 
            shortUrl,
            urlCode,
            updatedAt
          });
          await item.save();
          res.status(200).json(item);
        }
      } catch (err) {
        // invalid id
        res.status(401).json('Invalid User ID');
      }
    } else {
      return res.status(401).json("Invalid Original URL");
    }
  })
}