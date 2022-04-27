module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '80f969c1ada78e735086627daac76c47'),
  },
});
