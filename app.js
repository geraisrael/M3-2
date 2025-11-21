const express = require('express');
const app = express();
const PORT = 3000;

// Importar modelos de Sequelize
const db = require('./models');
const { Movie, Director, Actor, MovieActor } = db;
const { Op } = require('sequelize');

// Middleware para parsear JSON
app.use(express.json());

// Función helper para generar IDs únicos
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== ENDPOINTS ====================

// Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: '¡Bienvenido a CineBase API con Sequelize!',
    database: 'MySQL',
    endpoints: {
      movies: '/api/movies',
      directors: '/api/directors',
      actors: '/api/actors'
    }
  });
});

// ==================== GESTIÓN DE PELÍCULAS ====================

// GET /api/movies - Obtener todas las películas con filtros
app.get('/api/movies', async (req, res) => {
  try {
    const { genre, minRating, minYear, maxYear } = req.query;
    
    let whereClause = {};
    
    // Filtro por género (usando JSON)
    if (genre) {
      whereClause.genre = {
        [Op.like]: `%${genre}%`
      };
    }
    
    // Filtro por rating mínimo
    if (minRating) {
      whereClause.rating = {
        [Op.gte]: parseFloat(minRating)
      };
    }
    
    // Filtro por año
    if (minYear || maxYear) {
      whereClause.releaseYear = {};
      if (minYear) whereClause.releaseYear[Op.gte] = parseInt(minYear);
      if (maxYear) whereClause.releaseYear[Op.lte] = parseInt(maxYear);
    }
    
    const movies = await Movie.findAll({
      where: whereClause,
      include: [{
        model: Director,
        as: 'director'
      }],
      order: [['releaseYear', 'DESC']]
    });
    
    res.json({
      count: movies.length,
      movies
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener películas',
      details: error.message 
    });
  }
});

// GET /api/movies/:id - Obtener una película específica
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Director,
          as: 'director'
        },
        {
          model: Actor,
          as: 'actors',
          through: {
            attributes: ['characterName']
          }
        }
      ]
    });
    
    if (!movie) {
      return res.status(404).json({ 
        error: 'Película no encontrada',
        id: req.params.id
      });
    }
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener película',
      details: error.message 
    });
  }
});

// POST /api/movies - Crear una nueva película
app.post('/api/movies', async (req, res) => {
  try {
    const { title, releaseYear, genre, duration, directorId, rating, language, country } = req.body;
    
    // Validar campos obligatorios
    if (!title || !releaseYear || !genre || !duration || !directorId) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        required: ['title', 'releaseYear', 'genre', 'duration', 'directorId']
      });
    }
    
    // Verificar que el director existe
    const director = await Director.findByPk(directorId);
    if (!director) {
      return res.status(422).json({ 
        error: 'El director especificado no existe',
        directorId
      });
    }
    
    // Verificar si ya existe una película con el mismo título y año
    const existingMovie = await Movie.findOne({
      where: {
        title: {
          [Op.like]: title
        },
        releaseYear
      }
    });
    
    if (existingMovie) {
      return res.status(409).json({ 
        error: 'Ya existe una película con ese título y año',
        existingMovie
      });
    }
    
    const newMovie = await Movie.create({
      id: generateId('movie'),
      title,
      releaseYear,
      genre: Array.isArray(genre) ? genre : [genre],
      duration,
      directorId,
      rating: rating || 0,
      language: language || 'Español',
      country: country || 'México'
    });
    
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear película',
      details: error.message 
    });
  }
});

// PUT /api/movies/:id - Actualizar una película
app.put('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ 
        error: 'Película no encontrada',
        id: req.params.id
      });
    }
    
    const { directorId } = req.body;
    
    // Si se actualiza el director, verificar que existe
    if (directorId && directorId !== movie.directorId) {
      const director = await Director.findByPk(directorId);
      if (!director) {
        return res.status(422).json({ 
          error: 'El director especificado no existe',
          directorId
        });
      }
    }
    
    await movie.update(req.body);
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar película',
      details: error.message 
    });
  }
});

// DELETE /api/movies/:id - Eliminar una película
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ 
        error: 'Película no encontrada',
        id: req.params.id
      });
    }
    
    const deletedMovie = movie.toJSON();
    
    // Sequelize eliminará automáticamente las relaciones por el CASCADE
    await movie.destroy();
    
    res.json({ 
      message: 'Película eliminada exitosamente',
      deletedMovie
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar película',
      details: error.message 
    });
  }
});

// ==================== GESTIÓN DE DIRECTORES ====================

// GET /api/directors - Obtener todos los directores con filtros
app.get('/api/directors', async (req, res) => {
  try {
    const { nationality, minBirthYear } = req.query;
    
    let whereClause = {};
    
    if (nationality) {
      whereClause.nationality = {
        [Op.like]: `%${nationality}%`
      };
    }
    
    if (minBirthYear) {
      whereClause.birthYear = {
        [Op.gte]: parseInt(minBirthYear)
      };
    }
    
    const directors = await Director.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.json({
      count: directors.length,
      directors
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener directores',
      details: error.message 
    });
  }
});

// GET /api/directors/:id/movies - Obtener todas las películas de un director
app.get('/api/directors/:id/movies', async (req, res) => {
  try {
    const director = await Director.findByPk(req.params.id, {
      include: [{
        model: Movie,
        as: 'movies'
      }]
    });
    
    if (!director) {
      return res.status(404).json({ 
        error: 'Director no encontrado',
        id: req.params.id
      });
    }
    
    res.json({
      director: {
        id: director.id,
        name: director.name,
        nationality: director.nationality
      },
      moviesCount: director.movies.length,
      movies: director.movies
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener películas del director',
      details: error.message 
    });
  }
});

// POST /api/directors - Agregar un nuevo director
app.post('/api/directors', async (req, res) => {
  try {
    const { name, nationality, birthYear, birthPlace, notableAwards } = req.body;
    
    // Validar campos obligatorios
    if (!name || !nationality || !birthYear) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        required: ['name', 'nationality', 'birthYear']
      });
    }
    
    // Verificar si ya existe un director con el mismo nombre
    const existingDirector = await Director.findOne({
      where: {
        name: {
          [Op.like]: name
        }
      }
    });
    
    if (existingDirector) {
      return res.status(409).json({ 
        error: 'Ya existe un director con ese nombre',
        existingDirector
      });
    }
    
    const newDirector = await Director.create({
      id: generateId('dir'),
      name,
      nationality,
      birthYear,
      birthPlace: birthPlace || '',
      notableAwards: notableAwards || []
    });
    
    res.status(201).json(newDirector);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear director',
      details: error.message 
    });
  }
});

// ==================== GESTIÓN DE ACTORES ====================

// GET /api/actors - Obtener todos los actores con filtros
app.get('/api/actors', async (req, res) => {
  try {
    const { nationality, minBirthYear } = req.query;
    
    let whereClause = {};
    
    if (nationality) {
      whereClause.nationality = {
        [Op.like]: `%${nationality}%`
      };
    }
    
    if (minBirthYear) {
      whereClause.birthYear = {
        [Op.gte]: parseInt(minBirthYear)
      };
    }
    
    const actors = await Actor.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.json({
      count: actors.length,
      actors
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener actores',
      details: error.message 
    });
  }
});

// GET /api/actors/:id/movies - Obtener todas las películas de un actor
app.get('/api/actors/:id/movies', async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id, {
      include: [{
        model: Movie,
        as: 'movies',
        through: {
          attributes: ['characterName']
        }
      }]
    });
    
    if (!actor) {
      return res.status(404).json({ 
        error: 'Actor no encontrado',
        id: req.params.id
      });
    }
    
    res.json({
      actor: {
        id: actor.id,
        name: actor.name,
        nationality: actor.nationality
      },
      moviesCount: actor.movies.length,
      movies: actor.movies
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener películas del actor',
      details: error.message 
    });
  }
});

// POST /api/actors - Agregar un nuevo actor
app.post('/api/actors', async (req, res) => {
  try {
    const { name, nationality, birthYear, birthPlace, notableAwards } = req.body;
    
    // Validar campos obligatorios
    if (!name || !nationality || !birthYear) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        required: ['name', 'nationality', 'birthYear']
      });
    }
    
    // Verificar si ya existe un actor con el mismo nombre
    const existingActor = await Actor.findOne({
      where: {
        name: {
          [Op.like]: name
        }
      }
    });
    
    if (existingActor) {
      return res.status(409).json({ 
        error: 'Ya existe un actor con ese nombre',
        existingActor
      });
    }
    
    const newActor = await Actor.create({
      id: generateId('act'),
      name,
      nationality,
      birthYear,
      birthPlace: birthPlace || '',
      notableAwards: notableAwards || []
    });
    
    res.status(201).json(newActor);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear actor',
      details: error.message 
    });
  }
});

// ==================== RELACIONES PELÍCULAS-ACTORES ====================

// POST /api/movies/:movieId/actors - Agregar un actor a una película
app.post('/api/movies/:movieId/actors', async (req, res) => {
  try {
    const { actorId, characterName } = req.body;
    const { movieId } = req.params;
    
    // Validar campos obligatorios
    if (!actorId || !characterName) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        required: ['actorId', 'characterName']
      });
    }
    
    // Verificar que la película existe
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ 
        error: 'Película no encontrada',
        movieId
      });
    }
    
    // Verificar que el actor existe
    const actor = await Actor.findByPk(actorId);
    if (!actor) {
      return res.status(422).json({ 
        error: 'El actor especificado no existe',
        actorId
      });
    }
    
    // Verificar si la relación ya existe
    const existingRelation = await MovieActor.findOne({
      where: {
        movieId,
        actorId
      }
    });
    
    if (existingRelation) {
      return res.status(409).json({ 
        error: 'Este actor ya está asignado a esta película',
        existingRelation
      });
    }
    
    const newRelation = await MovieActor.create({
      movieId,
      actorId,
      characterName
    });
    
    res.status(201).json({
      message: 'Actor agregado a la película exitosamente',
      movie: movie.title,
      actor: actor.name,
      characterName,
      relation: newRelation
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al agregar actor a película',
      details: error.message 
    });
  }
});

// GET /api/movies/:movieId/actors - Obtener todos los actores de una película
app.get('/api/movies/:movieId/actors', async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Verificar que la película existe
    const movie = await Movie.findByPk(movieId, {
      include: [{
        model: Actor,
        as: 'actors',
        through: {
          attributes: ['characterName']
        }
      }]
    });
    
    if (!movie) {
      return res.status(404).json({ 
        error: 'Película no encontrada',
        movieId
      });
    }
    
    res.json({
      movie: movie.title,
      actorsCount: movie.actors.length,
      actors: movie.actors
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener actores de película',
      details: error.message 
    });
  }
});

// ==================== MANEJO DE RUTAS NO ENCONTRADAS ====================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// ==================== INICIAR SERVIDOR ====================
// Sincronizar con la base de datos y luego iniciar el servidor
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor CineBase con Sequelize ejecutándose en http://localhost:${PORT}`);
    console.log(`Base de datos: ${db.sequelize.config.database}`);
    console.log(`Conectado a: ${db.sequelize.config.host}`);
  });
}).catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err);
});