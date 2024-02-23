
## **Patrón Repository**

### **Introducción**

El Patrón Repository es una técnica utilizada en el desarrollo de software para separar la lógica que recupera los datos y los mapas de la base de datos a una entidad de negocio. Agrega una capa adicional de abstracción entre la lógica de negocio y la lógica de acceso a datos.

### **Ventajas del Patrón Repository**

1. **Desacoplamiento**: Si en el futuro decides cambiar tu ORM o incluso tu tipo de base de datos, tener una capa de repositorio permite minimizar el impacto en el resto del código.
2. **Reutilización**: Los métodos del repositorio pueden ser reutilizados en diferentes servicios sin necesidad de replicar código.
3. **Testeabilidad**: Facilita la escritura de pruebas unitarias para la lógica de negocio al poder simular o "mockear" la lógica de acceso a datos.

### **Implementación en el Proyecto**

#### 1. UBICACIÓN:
   

src/repositories/


#### 2. REPOSITORIOS: Lógica de acceso a datos.

Por ejemplo, `usuarioRepository.js` en la carpeta `repositories`:

`src/repositories/usuarioRepository.js`:
```javascript
const { Usuario } = require('../models')
const bcrypt = require('bcryptjs')

const usuarioRepository = {
    create: async (username, email, password) => {
        const nuevoUsuario = await Usuario.create({
            username,
            email,
            password,
        })
        return nuevoUsuario
    },
    findByUsername: async (username) => {
        return await Usuario.findOne({ where: { username } })
    },
}

module.exports = usuarioRepository
```

#### 3. Servicio usan el repositorio (en lugar de pegarle diractemente al modelo):

`src/services/usuarioService.js`:
```javascript
const usuarioRepository = require('../repositories/usuarioRepository')
const bcrypt = require('bcryptjs')

const usuarioService = {
    crearUsuario: async (username, email, password) => {
        return await usuarioRepository.create(username, email, password)
    },
    authenticate: async (username, password) => {
        const user = await usuarioRepository.findByUsername(username)
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return user
    },
}

module.exports = usuarioService
```

### **Conclusión**

Agregar una capa de repositorio puede parecer redundante en proyectos pequeños. Sin embargo, en proyectos de mayor envergadura o que se esperan que crezcan en el futuro, este patrón ofrece ventajas en términos de mantenibilidad, flexibilidad y testeabilidad. Es esencial ponderar la complejidad añadida contra los beneficios potenciales y decidir si se adapta a las necesidades del proyecto.

---

