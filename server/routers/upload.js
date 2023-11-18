const { Router } = require('express');

const multer = require('multer');

const Upload = Router();
const { UserEventsPhotos } = require('../db/models');

const { uploadToCloudinary } = require('../cloudinary_helpers.js');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('uploaded_file');

const runMiddleware = (req, res, callback) => {
  return new Promise((resolve, reject) => {
    callback(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

Upload.post('/', async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    //console.log(b64);
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const cldRes = await uploadToCloudinary(dataUri);
    res.json(cldRes);
  } catch (err) {
    console.error('upload error upload.js', err);
    res.status(500).send({
      message: err.message
    });
  }
});

Upload.post('/photoUrl', (req, res) => {
  const { userId, eventId, photoUrl } = req.body;
  //console.log(userEventsId, photoUrl);
  UserEventsPhotos.create({ photoUrl, userId, eventId })
    .then((response) => {
      //console.log('post success server', response);
      res.status(200).send(response);
    })
    .catch((err) => {
      console.error('error posting to db server', err);
      res.sendStatus(500);
    });
});

Upload.get('/photos/:userId', (req, res) => {
  const { userId } = req.params;

  UserEventsPhotos.findAll({
    where: {
      userId
    }
  })
    .then((urls) => res.status(200).send(urls))
    .catch((err) => {
      console.error('get urls', err);
      res.sendStatus(500);
    });
});
module.exports = Upload;

