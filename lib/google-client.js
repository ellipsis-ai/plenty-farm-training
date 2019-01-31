/*
@exportId OAXO920eS82KSVP2m4S9-Q
*/
module.exports = (function() {
return (ellipsis) => {
  const { JWT } = ellipsis.require('google-auth-library@2.0.1');
  return new JWT({
    email: ellipsis.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: ellipsis.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/drive'],
    subject: ellipsis.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  });  
};
})()
     