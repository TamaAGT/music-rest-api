/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'varchar(50)',
            notNull: true,
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
        }
    })

    pgm.createTable('songs', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
            notNull: true,
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
        performer: {
            type: 'varchar(50)',
            notNull: true,
        },
        genre: {
            type: 'varchar(50)',
            notNull: true,
        },
        duration: {
            type: 'integer',
        },
        album_id: {
            type: 'varchar(50)',
            references: '"albums"',
            onDelete: 'cascade',
        },
    })

};

exports.down = pgm => {
    pgm.dropTable('albums');
    pgm.dropTable('songs');
};
