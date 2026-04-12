module.exports={
  content:["./src/**/*.{js,jsx}"],
  theme:{
    extend:{}
  },
  plugins:[]
}
module.exports = {
  pwa: {
    dest: 'public',  // The folder where the PWA assets will be placed
    register: true,
    skipWaiting: true,
  },
  // Other Next.js configurations
};
