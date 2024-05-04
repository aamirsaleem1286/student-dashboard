/** @type {import('next').NextConfig} */
const nextConfig = {
// next.config.js

    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.alias = {
          antd: '@ant-design/antd/es',
        };
      }
      return config;
    },
  


};

export default nextConfig;



  