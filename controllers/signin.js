const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("empty")
    return res.status(400).json('empty');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(406).json('something wrong'))
      } else {
        console.log("wrong credentials")
        res.status(404).json('wrong credentials')
      }
    })
    .catch(err => res.status(406).json('something wrong'))
}

module.exports = {
  handleSignin: handleSignin
}
