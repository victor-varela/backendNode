El backend comienza conectando la DB- MONGO DB, etc.. obtener las credenciales y configurar en mongo db y atlas la conexion
Luego se empieza definiendo el modelo {Veterinario, Paciente}
Despues se crea el router y controlador del modelo. El router tiene una direccion base: '/api/veterinario' o '/api/pacientes'
Cuando tenemos una base de datos se debe 'PROTEGER' las rutas que pueden acceder los usuarios. El veterinario debe estar autenticado para ver SUS pacientes y registrarlos. Por ello se interpone un custom middelware en estas rutas. 


- Se configra CORS para permitir los dominios. Se hizo cuando se empezo a trabajar la comunicacion entre frontend y backend. La config de cors es en index.js

-Se instala y configura nodemailer para envio de emails- npm i nodemailer
- Creamos archivos de envio de mails en utils.js




//METODO PARA TOMAR NOTAS UDEMY
Replicar el video e ir escribiendo comentarios en el codigo sobre lo que se esta haciendo y por que