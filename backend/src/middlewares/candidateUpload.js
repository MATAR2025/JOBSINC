const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const uploadDirectory = path.resolve(__dirname, '../../uploads/candidates');

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function parseMultipart(buffer, boundary) {
  const separator = Buffer.from(`--${boundary}`);
  const nextSeparator = Buffer.from(`\r\n--${boundary}`);
  const fields = {};
  const files = [];

  let position = buffer.indexOf(separator);
  while (position >= 0) {
    position += separator.length;
    if (buffer.subarray(position, position + 2).toString() === '--') {
      break;
    }
    if (buffer.subarray(position, position + 2).toString() !== '\r\n') {
      throw badRequest('Corps multipart invalide.');
    }
    position += 2;

    const headersEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), position);
    if (headersEnd < 0) {
      throw badRequest('Corps multipart invalide.');
    }

    const headers = buffer.subarray(position, headersEnd).toString('utf8');
    const name = /name="([^"]+)"/i.exec(headers)?.[1];
    const filename = /filename="([^"]*)"/i.exec(headers)?.[1];
    const contentType = /content-type:\s*([^\r\n]+)/i.exec(headers)?.[1]?.trim().toLowerCase();

    const dataStart = headersEnd + 4;
    const dataEnd = buffer.indexOf(nextSeparator, dataStart);

    if (dataEnd < 0 || !name) {
      throw badRequest('Corps multipart invalide.');
    }

    const data = buffer.subarray(dataStart, dataEnd);

    if (filename) {
      files.push({
        fieldname: name,
        originalname: filename,
        mimetype: contentType,
        buffer: data,
      });
    } else {
      fields[name] = data.toString('utf8');
    }

    position = dataEnd + 2;
  }

  return { fields, files };
}

module.exports = async (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next();
  }

  try {
    const boundary = /boundary=(?:"([^"]+)"|([^;\s]+))/i
      .exec(req.headers['content-type'] || '')
      ?.slice(1)
      .find(Boolean);

    if (!boundary) {
      throw badRequest('Limite multipart manquante.');
    }

    const chunks = [];
    let size = 0;

    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_FILE_SIZE + 1024 * 1024) {
        throw badRequest('L’image ne doit pas dépasser 15 Mo.');
      }
      chunks.push(chunk);
    }

    const parsed = parseMultipart(Buffer.concat(chunks), boundary);

    const avatarFiles = parsed.files.filter((file) => file.fieldname === 'avatar');

    if (avatarFiles.length > 1) {
      throw badRequest('Vous ne pouvez envoyer qu\'une seule photo de profil.');
    }

    if (avatarFiles.length === 1) {
      const file = avatarFiles[0];
      if (!ACCEPTED_TYPES.has(file.mimetype) || file.buffer.length > MAX_FILE_SIZE) {
        throw badRequest('Utilisez des images JPG, PNG ou WEBP de 15 Mo maximum.');
      }

      await fs.mkdir(uploadDirectory, { recursive: true });

      const filename = `${crypto.randomUUID()}${ACCEPTED_TYPES.get(file.mimetype)}`;
      await fs.writeFile(path.join(uploadDirectory, filename), file.buffer, {
        flag: 'wx',
      });

      req.candidateImage = { url: `/uploads/candidates/${filename}` };
    }

    req.body = { ...req.body, ...parsed.fields };
    next();
  } catch (error) {
    next(error);
  }
};
