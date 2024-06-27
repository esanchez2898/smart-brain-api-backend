const { Resend } = require('resend');

const resend = new Resend('re_BApQRRS6_9GauoRvjJCKih91BtuTXdcZR');

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
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          // Enviar correo electrónico después de un registro exitoso
          resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Hello World',
            html: `<p>Congrats ${name} on sending your <strong>first email</strong>!</p>`
          })
          .then(() => {
            res.json(user[0]);
          })
          .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json('Error sending email');
          });
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
  handleRegister: handleRegister
};
