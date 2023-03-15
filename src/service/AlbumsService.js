/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const shortid = require('shortid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumId = `album-${shortid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [albumId, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].id.length < 1) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT a.id, a.name, a.year FROM albums a WHERE a.id=$1',
      values: [id],
    };

    const querySongs = {
      text: 'SELECT s.id, s.title, s.performer FROM albums a JOIN songs s ON a.id = s.album_id WHERE a.id=$1',
      values: [id],
    };

    const album = await this._pool.query(queryAlbum);
    const songs = await this._pool.query(querySongs);

    if (!album.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      id: album.rows[0].id,
      name: album.rows[0].name,
      year: album.rows[0].year,
      songs: songs.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id=$4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Album tidak ditemukan.');
    }
  }
}

module.exports = AlbumsService;
