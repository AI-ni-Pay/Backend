# Chatbot de Transacciones Cripto

Un chatbot inteligente que utiliza AI (Deepseek) para facilitar transacciones de criptomonedas. El bot solicita automáticamente la dirección de destino, tipo de moneda y monto para procesar transacciones de forma conversacional.

## 🚀 Características

- **Chatbot con AI**: Utiliza la API de Deepseek para conversaciones naturales
- **Detección Automática**: Extrae automáticamente direcciones, monedas y montos del texto
- **Soporte Multi-Moneda**: BTC, ETH, USDT, USDC, BNB, ADA, SOL, XRP, DOT, DOGE
- **Integración Blockchain**: Smart contract en Solidity para gestión de transacciones
- **Validación de Direcciones**: Soporte para direcciones Ethereum y Bitcoin
- **Modo Simulación**: Testing seguro sin transacciones reales

## 📋 Requisitos

- Navegador web moderno con soporte para ES6
- MetaMask (opcional, para funcionalidad blockchain real)
- Conexión a internet para API de Deepseek

## 🛠️ Instalación

1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador web
3. ¡El chatbot está listo para usar!

## 🔧 Configuración

### API de Deepseek
- API Key ya configurada en `config.json`
- 2M tokens disponibles para testing
- Costo: $2 USD

### Smart Contract
- Contrato `TransactionManager.sol` incluido
- Dirección del contrato debe actualizarse en `config.json` después del despliegue
- Actualmente en modo simulación

## 💬 Uso del Chatbot

1. **Inicio**: El bot te saluda y explica qué información necesita
2. **Conversación**: Habla naturalmente, por ejemplo:
   - "Quiero enviar 0.5 ETH a 0x742d35Cc6634C0532925a3b8D39754d5B9b89eA5"
   - "Enviar 100 USDT"
   - "La dirección es bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
3. **Confirmación**: El bot extraerá los datos y mostrará un resumen
4. **Ejecución**: Confirma para procesar (simulación por ahora)

## 📁 Estructura del Proyecto

```
├── index.html              # Interfaz principal
├── app.js                  # Lógica del chatbot y API
├── web3-integration.js     # Integración blockchain
├── styles.css              # Estilos básicos
├── TransactionManager.sol  # Smart contract
├── config.json            # Configuraciones
└── README.md              # Este archivo
```

## 🔍 Funcionalidades Principales

### Detección Automática
- **Direcciones**: Ethereum (0x...), Bitcoin (1... 3... bc1...)
- **Monedas**: BTC, ETH, USDT, USDC, BNB, ADA, SOL, XRP, DOT, DOGE
- **Montos**: Números decimales con soporte para múltiples formatos

### Validación
- Verificación de formato de direcciones
- Validación de montos mínimos y máximos
- Confirmación de datos antes de procesar

### Smart Contract Features
- Creación de transacciones
- Ejecución segura con validaciones
- Historial de transacciones
- Eventos para seguimiento

## 🧪 Modo Testing

Actualmente configurado para testing seguro:
- `simulationMode: true` en `config.json`
- No se ejecutan transacciones reales
- Todas las validaciones funcionan
- API de Deepseek completamente funcional

## 🔐 Seguridad

- Validaciones de entrada estrictas
- No almacenamiento de claves privadas
- Confirmación requerida antes de transacciones
- Modo simulación por defecto

## 🚧 Próximas Funcionalidades

- [ ] Estilos y diseño mejorado
- [ ] Soporte para más criptomonedas
- [ ] Integración con exchanges
- [ ] Historial de conversaciones
- [ ] Notificaciones push
- [ ] Soporte multi-idioma

## 📞 Soporte

Este es un proyecto de testing para demostrar la integración de AI con blockchain. Para uso en producción, se requieren configuraciones adicionales de seguridad.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

**Nota**: Este proyecto está en fase de testing. No realizar transacciones reales hasta configurar correctamente el entorno de producción.