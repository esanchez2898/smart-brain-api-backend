const setUpClarifai = require('./Clarifai');

const handleApiCall = (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", setUpClarifai(req.body.input))
  .then(response => response.json())
  .then(data => {    
    res.json(data);
  })
    .catch(err => res.status(400).json('unable to work with API'))
}




const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
      // entries[0] --> this used to return the entries
      // TO
      // entries[0].entries --> this now returns the entries
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}