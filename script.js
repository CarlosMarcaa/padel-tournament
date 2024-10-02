// Clases de Jugador y Partido
class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
    }
}

class Match {
    constructor(pair1, pair2) {
        this.pair1 = pair1;
        this.pair2 = pair2;
        this.score1 = 0;
        this.score2 = 0;
    }
}

// Variables Globales
let players = [];
let pairs = [];
let matches = [];
let history = [];
let numPlayers = 0;

// Elemento Principal
const app = document.getElementById('app');

// Función para Mostrar el Menú Principal
function showMainMenu() {
    app.innerHTML = `
        <header>
            <h1>Gestor de Torneos de Pádel</h1>
            <p>Selecciona la cantidad de jugadores:</p>
        </header>
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary mx-2" onclick="setupPlayers(8)">8 Jugadores</button>
            <button class="btn btn-primary mx-2" onclick="setupPlayers(12)">12 Jugadores</button>
            <button class="btn btn-primary mx-2" onclick="setupPlayers(16)">16 Jugadores</button>
        </div>
        <footer>© 2023 Torneos de Pádel</footer>
    `;
}

// Función para Configurar Jugadores
function setupPlayers(n) {
    numPlayers = n;
    players = [];
    app.innerHTML = `
        <header>
            <h1>Ingresa los Nombres de los Jugadores</h1>
        </header>
        <form id="playerForm">
            ${[...Array(n)].map((_, i) => `
                <div class="form-group">
                    <label>Jugador ${i + 1}:</label>
                    <input type="text" class="form-control" name="player${i}" required>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-success">Iniciar Torneo</button>
        </form>
    `;
    document.getElementById('playerForm').addEventListener('submit', getPlayerNames);
}

// Función para Obtener Nombres de Jugadores
function getPlayerNames(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    for (let i = 0; i < numPlayers; i++) {
        const name = formData.get(`player${i}`);
        if (name) {
            players.push(new Player(name));
        } else {
            alert('Todos los nombres de los jugadores deben ser ingresados.');
            return;
        }
    }
    startTournament();
}

// Función para Iniciar el Torneo
function startTournament() {
    formPairs();
    createMatches();
    enterScores();
}

// Función para Formar Parejas
function formPairs() {
    players.sort((a, b) => b.points - a.points);
    pairs = [];
    const numPairs = players.length / 2;
    for (let i = 0; i < numPairs; i++) {
        pairs.push([players[i], players[players.length - 1 - i]]);
    }
}

// Función para Crear Partidos
function createMatches() {
    pairs.sort((a, b) => Math.max(b[0].points, b[1].points) - Math.max(a[0].points, a[1].points));
    matches = [];
    for (let i = 0; i < pairs.length; i += 2) {
        if (pairs[i + 1]) {
            matches.push(new Match(pairs[i], pairs[i + 1]));
        } else {
            alert(`La pareja ${pairs[i][0].name} & ${pairs[i][1].name} pasa a la siguiente ronda automáticamente.`);
        }
    }
}

// Variables para Controlar el Índice del Partido Actual
let matchIndex = 0;

// Función para Ingresar Puntajes
function enterScores() {
    if (matchIndex < matches.length) {
        const match = matches[matchIndex];
        app.innerHTML = `
            <header>
                <h2>Partido ${matchIndex + 1}</h2>
            </header>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${match.pair1[0].name} & ${match.pair1[1].name}</h5>
                    <input type="number" class="form-control mb-3" id="score1" placeholder="Puntaje" min="0" max="3">
                    <h5 class="card-title">vs</h5>
                    <h5 class="card-title">${match.pair2[0].name} & ${match.pair2[1].name}</h5>
                    <input type="number" class="form-control mb-3" id="score2" placeholder="Puntaje" min="0" max="3">
                    <button class="btn btn-success" onclick="submitScore()">Ingresar Resultado</button>
                </div>
            </div>
        `;
    } else {
        updateScores();
    }
}

// Función para Enviar Puntajes
function submitScore() {
    const score1 = parseInt(document.getElementById('score1').value);
    const score2 = parseInt(document.getElementById('score2').value);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score1 > 3 || score2 < 0 || score2 > 3) {
        alert('Por favor, ingrese puntajes válidos entre 0 y 3.');
        return;
    }
    const match = matches[matchIndex];
    match.score1 = score1;
    match.score2 = score2;
    history.push(match);
    matchIndex++;
    enterScores();
}

// Función para Actualizar Puntajes
function updateScores() {
    matches.forEach(match => {
        match.pair1.forEach(player => player.points += match.score1);
        match.pair2.forEach(player => player.points += match.score2);
    });
    showScoreboard();
}

// Función para Mostrar el Scoreboard
function showScoreboard() {
    players.sort((a, b) => b.points - a.points);
    app.innerHTML = `
        <header>
            <h2>Clasificación Actual</h2>
        </header>
        <ul class="list-group">
            ${players.map(player => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${player.name}
                    <span class="badge badge-primary badge-pill">${player.points} puntos</span>
                </li>
            `).join('')}
        </ul>
        <div class="mt-4">
            <button class="btn btn-primary mx-2" onclick="resetTournament()">Iniciar Otra Ronda</button>
            <button class="btn btn-danger mx-2" onclick="showMainMenu()">Terminar Juego</button>
        </div>
        <div class="mt-4">
            <button class="btn btn-secondary mx-2" onclick="editPlayers()">Editar Jugadores</button>
            <button class="btn btn-secondary mx-2" onclick="showHistory()">Historial de Partidos</button>
            <button class="btn btn-secondary mx-2" onclick="editMatches()">Editar Partidos</button>
        </div>
    `;
}

// Función para Reiniciar el Torneo
function resetTournament() {
    matchIndex = 0;
    matches = [];
    startTournament();
}

// Función para Editar Jugadores
function editPlayers() {
    app.innerHTML = `
        <header>
            <h2>Editar Nombres de Jugadores</h2>
        </header>
        <form id="editPlayerForm">
            ${players.map((player, index) => `
                <div class="form-group">
                    <label>Jugador ${index + 1}:</label>
                    <input type="text" class="form-control" name="player${index}" value="${player.name}" required>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-success">Actualizar Nombres</button>
        </form>
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
    document.getElementById('editPlayerForm').addEventListener('submit', updatePlayerNames);
}

// Función para Actualizar Nombres de Jugadores
function updatePlayerNames(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    for (let i = 0; i < players.length; i++) {
        const newName = formData.get(`player${i}`);
        if (newName) {
            players[i].name = newName;
        } else {
            alert('El nombre del jugador no puede estar vacío.');
            return;
        }
    }
    alert('Nombres de jugadores actualizados.');
    showScoreboard();
}

// Función para Mostrar Historial de Partidos
function showHistory() {
    app.innerHTML = `
        <header>
            <h2>Historial de Partidos</h2>
        </header>
        <ul class="list-group">
            ${history.map((match, index) => `
                <li class="list-group-item">
                    Partido ${index + 1}: ${match.pair1[0].name} & ${match.pair1[1].name} (${match.score1}) vs ${match.pair2[0].name} & ${match.pair2[1].name} (${match.score2})
                </li>
            `).join('')}
        </ul>
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
}

// Función para Editar Partidos
function editMatches() {
    app.innerHTML = `
        <header>
            <h2>Editar Partidos</h2>
        </header>
        ${history.map((match, index) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Partido ${index + 1}</h5>
                    <p>${match.pair1[0].name} & ${match.pair1[1].name} vs ${match.pair2[0].name} & ${match.pair2[1].name}</p>
                    <button class="btn btn-warning" onclick="editMatchScore(${index})">Editar Resultado</button>
                </div>
            </div>
        `).join('')}
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
}

// Función para Editar Resultado de un Partido
function editMatchScore(index) {
    const match = history[index];
    app.innerHTML = `
        <header>
            <h2>Editar Resultado del Partido ${index + 1}</h2>
        </header>
        <div class="card">
            <div class="card-body">
                <h5>${match.pair1[0].name} & ${match.pair1[1].name}</h5>
                <input type="number" class="form-control mb-3" id="editScore1" value="${match.score1}" min="0" max="3">
                <h5>vs</h5>
                <h5>${match.pair2[0].name} & ${match.pair2[1].name}</h5>
                <input type="number" class="form-control mb-3" id="editScore2" value="${match.score2}" min="0" max="3">
                <button class="btn btn-success" onclick="updateMatchScore(${index})">Actualizar Resultado</button>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" onclick="editMatches()">Volver</button>
    `;
}

// Función para Actualizar Resultado de un Partido
function updateMatchScore(index) {
    const score1 = parseInt(document.getElementById('editScore1').value);
    const score2 = parseInt(document.getElementById('editScore2').value);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score1 > 3 || score2 < 0 || score2 > 3) {
        alert('Por favor, ingrese puntajes válidos entre 0 y 3.');
        return;
    }
    const match = history[index];
    // Restar puntos anteriores
    match.pair1.forEach(player => player.points -= match.score1);
    match.pair2.forEach(player => player.points -= match.score2);
    // Actualizar puntajes
    match.score1 = score1;
    match.score2 = score2;
    // Sumar nuevos puntos
    match.pair1.forEach(player => player.points += score1);
    match.pair2.forEach(player => player.points += score2);
    alert('Resultado actualizado correctamente.');
    editMatches();
}

// Iniciar la Aplicación
showMainMenu();
    // Clases de Jugador y Partido
class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
    }
}

class Match {
    constructor(pair1, pair2) {
        this.pair1 = pair1;
        this.pair2 = pair2;
        this.score1 = 0;
        this.score2 = 0;
    }
}

// Variables Globales
let players = [];
let pairs = [];
let matches = [];
let history = [];
let numPlayers = 0;

// Elemento Principal
const app = document.getElementById('app');

// Función para Mostrar el Menú Principal
function showMainMenu() {
    app.innerHTML = `
        <header>
            <h1>Gestor de Torneos de Pádel</h1>
            <p>Selecciona la cantidad de jugadores:</p>
        </header>
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary mx-2" onclick="setupPlayers(8)">8 Jugadores</button>
            <button class="btn btn-primary mx-2" onclick="setupPlayers(12)">12 Jugadores</button>
            <button class="btn btn-primary mx-2" onclick="setupPlayers(16)">16 Jugadores</button>
        </div>
        <footer>© 2023 Torneos de Pádel</footer>
    `;
}

// Función para Configurar Jugadores
function setupPlayers(n) {
    numPlayers = n;
    players = [];
    app.innerHTML = `
        <header>
            <h1>Ingresa los Nombres de los Jugadores</h1>
        </header>
        <form id="playerForm">
            ${[...Array(n)].map((_, i) => `
                <div class="form-group">
                    <label>Jugador ${i + 1}:</label>
                    <input type="text" class="form-control" name="player${i}" required>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-success">Iniciar Torneo</button>
        </form>
    `;
    document.getElementById('playerForm').addEventListener('submit', getPlayerNames);
}

// Función para Obtener Nombres de Jugadores
function getPlayerNames(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    for (let i = 0; i < numPlayers; i++) {
        const name = formData.get(`player${i}`);
        if (name) {
            players.push(new Player(name));
        } else {
            alert('Todos los nombres de los jugadores deben ser ingresados.');
            return;
        }
    }
    startTournament();
}

// Función para Iniciar el Torneo
function startTournament() {
    formPairs();
    createMatches();
    enterScores();
}

// Función para Formar Parejas
function formPairs() {
    players.sort((a, b) => b.points - a.points);
    pairs = [];
    const numPairs = players.length / 2;
    for (let i = 0; i < numPairs; i++) {
        pairs.push([players[i], players[players.length - 1 - i]]);
    }
}

// Función para Crear Partidos
function createMatches() {
    pairs.sort((a, b) => Math.max(b[0].points, b[1].points) - Math.max(a[0].points, a[1].points));
    matches = [];
    for (let i = 0; i < pairs.length; i += 2) {
        if (pairs[i + 1]) {
            matches.push(new Match(pairs[i], pairs[i + 1]));
        } else {
            alert(`La pareja ${pairs[i][0].name} & ${pairs[i][1].name} pasa a la siguiente ronda automáticamente.`);
        }
    }
}

// Variables para Controlar el Índice del Partido Actual
let matchIndex = 0;

// Función para Ingresar Puntajes
function enterScores() {
    if (matchIndex < matches.length) {
        const match = matches[matchIndex];
        app.innerHTML = `
            <header>
                <h2>Partido ${matchIndex + 1}</h2>
            </header>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${match.pair1[0].name} & ${match.pair1[1].name}</h5>
                    <input type="number" class="form-control mb-3" id="score1" placeholder="Puntaje" min="0" max="3">
                    <h5 class="card-title">vs</h5>
                    <h5 class="card-title">${match.pair2[0].name} & ${match.pair2[1].name}</h5>
                    <input type="number" class="form-control mb-3" id="score2" placeholder="Puntaje" min="0" max="3">
                    <button class="btn btn-success" onclick="submitScore()">Ingresar Resultado</button>
                </div>
            </div>
        `;
    } else {
        updateScores();
    }
}

// Función para Enviar Puntajes
function submitScore() {
    const score1 = parseInt(document.getElementById('score1').value);
    const score2 = parseInt(document.getElementById('score2').value);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score1 > 3 || score2 < 0 || score2 > 3) {
        alert('Por favor, ingrese puntajes válidos entre 0 y 3.');
        return;
    }
    const match = matches[matchIndex];
    match.score1 = score1;
    match.score2 = score2;
    history.push(match);
    matchIndex++;
    enterScores();
}

// Función para Actualizar Puntajes
function updateScores() {
    matches.forEach(match => {
        match.pair1.forEach(player => player.points += match.score1);
        match.pair2.forEach(player => player.points += match.score2);
    });
    showScoreboard();
}

// Función para Mostrar el Scoreboard
function showScoreboard() {
    players.sort((a, b) => b.points - a.points);
    app.innerHTML = `
        <header>
            <h2>Clasificación Actual</h2>
        </header>
        <ul class="list-group">
            ${players.map(player => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${player.name}
                    <span class="badge badge-primary badge-pill">${player.points} puntos</span>
                </li>
            `).join('')}
        </ul>
        <div class="mt-4">
            <button class="btn btn-primary mx-2" onclick="resetTournament()">Iniciar Otra Ronda</button>
            <button class="btn btn-danger mx-2" onclick="showMainMenu()">Terminar Juego</button>
        </div>
        <div class="mt-4">
            <button class="btn btn-secondary mx-2" onclick="editPlayers()">Editar Jugadores</button>
            <button class="btn btn-secondary mx-2" onclick="showHistory()">Historial de Partidos</button>
            <button class="btn btn-secondary mx-2" onclick="editMatches()">Editar Partidos</button>
        </div>
    `;
}

// Función para Reiniciar el Torneo
function resetTournament() {
    matchIndex = 0;
    matches = [];
    startTournament();
}

// Función para Editar Jugadores
function editPlayers() {
    app.innerHTML = `
        <header>
            <h2>Editar Nombres de Jugadores</h2>
        </header>
        <form id="editPlayerForm">
            ${players.map((player, index) => `
                <div class="form-group">
                    <label>Jugador ${index + 1}:</label>
                    <input type="text" class="form-control" name="player${index}" value="${player.name}" required>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-success">Actualizar Nombres</button>
        </form>
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
    document.getElementById('editPlayerForm').addEventListener('submit', updatePlayerNames);
}

// Función para Actualizar Nombres de Jugadores
function updatePlayerNames(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    for (let i = 0; i < players.length; i++) {
        const newName = formData.get(`player${i}`);
        if (newName) {
            players[i].name = newName;
        } else {
            alert('El nombre del jugador no puede estar vacío.');
            return;
        }
    }
    alert('Nombres de jugadores actualizados.');
    showScoreboard();
}

// Función para Mostrar Historial de Partidos
function showHistory() {
    app.innerHTML = `
        <header>
            <h2>Historial de Partidos</h2>
        </header>
        <ul class="list-group">
            ${history.map((match, index) => `
                <li class="list-group-item">
                    Partido ${index + 1}: ${match.pair1[0].name} & ${match.pair1[1].name} (${match.score1}) vs ${match.pair2[0].name} & ${match.pair2[1].name} (${match.score2})
                </li>
            `).join('')}
        </ul>
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
}

// Función para Editar Partidos
function editMatches() {
    app.innerHTML = `
        <header>
            <h2>Editar Partidos</h2>
        </header>
        ${history.map((match, index) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Partido ${index + 1}</h5>
                    <p>${match.pair1[0].name} & ${match.pair1[1].name} vs ${match.pair2[0].name} & ${match.pair2[1].name}</p>
                    <button class="btn btn-warning" onclick="editMatchScore(${index})">Editar Resultado</button>
                </div>
            </div>
        `).join('')}
        <button class="btn btn-secondary mt-3" onclick="showScoreboard()">Volver</button>
    `;
}

// Función para Editar Resultado de un Partido
function editMatchScore(index) {
    const match = history[index];
    app.innerHTML = `
        <header>
            <h2>Editar Resultado del Partido ${index + 1}</h2>
        </header>
        <div class="card">
            <div class="card-body">
                <h5>${match.pair1[0].name} & ${match.pair1[1].name}</h5>
                <input type="number" class="form-control mb-3" id="editScore1" value="${match.score1}" min="0" max="3">
                <h5>vs</h5>
                <h5>${match.pair2[0].name} & ${match.pair2[1].name}</h5>
                <input type="number" class="form-control mb-3" id="editScore2" value="${match.score2}" min="0" max="3">
                <button class="btn btn-success" onclick="updateMatchScore(${index})">Actualizar Resultado</button>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" onclick="editMatches()">Volver</button>
    `;
}

// Función para Actualizar Resultado de un Partido
function updateMatchScore(index) {
    const score1 = parseInt(document.getElementById('editScore1').value);
    const score2 = parseInt(document.getElementById('editScore2').value);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score1 > 3 || score2 < 0 || score2 > 3) {
        alert('Por favor, ingrese puntajes válidos entre 0 y 3.');
        return;
    }
    const match = history[index];
    // Restar puntos anteriores
    match.pair1.forEach(player => player.points -= match.score1);
    match.pair2.forEach(player => player.points -= match.score2);
    // Actualizar puntajes
    match.score1 = score1;
    match.score2 = score2;
    // Sumar nuevos puntos
    match.pair1.forEach(player => player.points += score1);
    match.pair2.forEach(player => player.points += score2);
    alert('Resultado actualizado correctamente.');
    editMatches();
}

// Iniciar la Aplicación
showMainMenu();
