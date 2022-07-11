<!-- HTTP STATUS CODE -->

- 200 OK
- 201 Created

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

- 500 Internal Server Error

- Jika ingin mejalankan query di lebih dari satu table, dan ingin memastikan bahwa mereka akan berhasil dan gagal bersama. Gunakanlan :

connection = await pool.promise().getConnection()
await connection.beginTransaction()

- running connection.commit() di akhir proses pada 'try'
- running connection.roolback() pada catch

Dan jangan lupa untuk memulangkan connection ke pool dengan cara :

connection.release()
