const { createApp } = require('./src/app');

const port = process.env.PORT || 3000;

createApp().listen(port, () => {
  console.log(`Task API listening on port ${port}`);
});
