export const configuration = {
  port: Number(process.env.PORT ?? 3000),
  // Les clés de cet objet sont celles attendues par le driver `pg`
  bdd: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'lebonmedoc',
    password: process.env.DB_PASSWORD ?? 'lebonmedoc',
    database: process.env.DB_NAME ?? 'lebonmedoc',
  },
};
