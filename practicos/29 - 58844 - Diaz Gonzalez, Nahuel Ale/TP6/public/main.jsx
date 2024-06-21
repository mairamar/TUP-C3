function App() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [modo, setModo] = useState('registrar');
    const [estaLogueado, setEstaLogueado] = useState(false);
    const [mostrarInfo, setMostrarInfo] = useState(false);

    useEffect(() => {
        const valorCookie = getCookie('usuario');

        if (valorCookie) {
            setEstaLogueado(true);
            setNombreUsuario(valorCookie);
        }
    }, []);

    const getCookie = (nombre) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === nombre) {
                return cookieValue;
            }
        }
        return null;
    };

    const manejarRegistro = async (e) => {
        e.preventDefault();
        if (!nombreUsuario || !contraseña) {
            setMensaje('Por favor, complete todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombreUsuario, contraseña }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje(data.message);
                setNombreUsuario('');
                setContraseña('');
            } else {
                setMensaje(data.error);
            }
        } catch (error) {
            console.error('Error en la solicitud de registro:', error);
            setMensaje('Error en la solicitud de registro, por favor intenta nuevamente.');
        }
    };

    const manejarInicioSesion = async (e) => {
        e.preventDefault();
        if (!nombreUsuario || !contraseña) {
            setMensaje('Por favor, complete todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombreUsuario, contraseña }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('Usuario logueado correctamente');
                setEstaLogueado(true);
                setModo('logueado');
            } else {
                setMensaje(data.error || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en la solicitud de inicio de sesión:', error);
            setMensaje('Error en la solicitud de inicio de sesión, por favor intenta nuevamente.');
        }
    };

    const manejarCierreSesion = async () => {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('Usuario deslogueado correctamente');
                setEstaLogueado(false);
                setModo('registrar');
                setNombreUsuario('');
                setContraseña('');
                setMostrarInfo(false);
            } else {
                setMensaje(data.error || 'Error al intentar desloguear');
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre de sesión:', error);
            setMensaje('Error en la solicitud de cierre de sesión, por favor intenta nuevamente.');
        }
    };

    const cambiarModo = (nuevoModo) => {
        setModo(nuevoModo);
        setMensaje('');
        setNombreUsuario('');
        setContraseña('');
    };

    const manejarVerInfo = () => {
        setMostrarInfo(!mostrarInfo);
    };

    return (
        <div className="card">
            <div className="container">
                <h2>{modo === 'registrar' ? 'Registro de Usuario' : 'Login de Usuario'}</h2>
                {!estaLogueado ? (
                    <form onSubmit={modo === 'registrar' ? manejarRegistro : manejarInicioSesion}>
                        <div>
                            <label>Usuario:</label>
                            <input
                                type="text"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </div>
                        <button type="submit">{modo === 'registrar' ? 'Registrar' : 'Iniciar Sesión'}</button>
                    </form>
                ) : (
                    <>
                        <button onClick={manejarCierreSesion}>Cerrar Sesión</button>
                        <button onClick={manejarVerInfo}>Ver Info</button>
                    </>
                )}
                {!estaLogueado && (
                    <>
                        {modo === 'registrar' ? (
                            <button onClick={() => cambiarModo('login')}>Iniciar Sesión</button>
                        ) : (
                            <button onClick={() => cambiarModo('registrar')}>Registrar</button>
                        )}
                    </>
                )}
                {mostrarInfo && estaLogueado && (
                    <div>
                        <p>Usuario: {nombreUsuario}</p>
                        <p>Contraseña: {contraseña}</p>
                    </div>
                )}
                <p>{mensaje}</p>
            </div>
        </div>
    );
}

export default App;