import { Resend } from 'resend';

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
            // loginEmail[0] --> this used to return the email
            // TO
            // loginEmail[0].email --> this now returns the email
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}


const resend = new Resend('re_BApQRRS6_9GauoRvjJCKih91BtuTXdcZR');
const name = "Erick"
resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'esanchez2898@outlook.com',
  subject: 'Hello World',
  html: `<p>Congrats ${name} on sending your <strong>first email</strong>!</p>`
});


module.exports = {
  handleRegister: handleRegister
};


