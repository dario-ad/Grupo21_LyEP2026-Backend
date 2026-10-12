import axios from 'axios'

const URL = 'http://localhost:3001/api/auth'

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

const login = async (email, password, sector) => {
  const respuesta = await axios.post(`${URL}/login`, { email, password, sector })
  const { token, usuario } = respuesta.data
  sessionStorage.setItem('token', token)
  return {
    nombre: usuario.nombre,
    email: usuario.email,
    sector: capitalizar(usuario.rol)
  }
}

export default {
  login
}