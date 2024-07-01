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
              subject: 'Thank you ${name} for sign up',
              html: `
                    With <strong>smart brain</strong>, you can detect people's faces in pictures by simply providing the image's URL, easy peasy :)
                    <br>              
                    Here are your user details:</p>
                    <br>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <br>
                    <p><strong>¡¡¡We store your password in an encrypted format in our database to ensure its security. Only you know your actual password, keeping it safe and private!!!</strong></p>`
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
