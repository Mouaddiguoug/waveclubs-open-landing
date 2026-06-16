/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/open/register/success",
        destination: "/register/success",
        permanent: false,
      },
      {
        source: "/open/register/cancel",
        destination: "/register/cancel",
        permanent: false,
      },
      {
        source: "/open/register",
        destination: "/register",
        permanent: false,
      },
      {
        source: "/open",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
