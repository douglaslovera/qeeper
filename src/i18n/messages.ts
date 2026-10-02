export type Locale = 'en' | 'es'

export const LOCALE_COOKIE = 'qeeper-locale'

// Match every Spanish dialect, while falling back to English for other languages.
export function detectLocale(language?: string | null): Locale {
  return /^es(?:-|_|$)/i.test(language ?? '') ? 'es' : 'en'
}

export function resolveLocale(
  override: string | undefined,
  language?: string | null,
): Locale {
  return override === 'en' || override === 'es'
    ? override
    : detectLocale(language)
}

const en = {
  description:
    'QeepeR is a QR code keeper. It allows you to create, edit, and share QR codes.',
  myQrCodes: 'My QR Codes',
  login: 'Login',
  logout: 'Log out',
  generateAnd: 'Generate &',
  edit: 'Edit',
  heroDescription:
    'Quickly generate static or dynamic QR codes, personalize their design, and update their destinations at any time.',
  fastFlexible: 'Fast. Flexible.',
  yours: 'Yours.',
  generateQr: 'Generate a QR',
  qrPreview: 'QR Preview',
  qrPlaceholder: 'Your QR code will appear here',
  samplePreview: 'Sample QR preview',
  destinationUrl: 'Destination URL',
  urlPlaceholder: 'https://your-website.com',
  urlHelp: 'Enter the URL or link you want your QR code to open.',
  loginRequired: 'You need to log in',
  dynamicQr: 'Dynamic QR',
  dynamicHelp:
    'Dynamic QR lets you update the destination link anytime without reprinting.',
  generate: 'Generate',
  download: 'Download',
  qrList: 'Your QR List',
  listError: 'Unable to load your QR codes. Please try again.',
  alias: 'Alias:',
  disabled: 'Disabled',
  active: 'Active',
  views: 'Views',
  manageQr: 'Manage QR',
  confirmDisable: 'Are you sure you want to disable this QR?',
  confirmEnable: 'Are you sure you want to enable this QR?',
  confirmDelete: 'Are you sure you want to delete this QR?',
  backgroundColor: 'Background Color',
  squaresColor: 'Squares Color',
  disableLink: 'Disable Link',
  disableHelp: 'If this option is enabled, the QR will show a 404 page',
  visitorsCount: 'Visitors Count',
  visitorsHelp: 'Keep track of the number of people who visit your QR',
  delete: 'Delete',
  updateSuccess: 'Success.\nQR can take a few seconds to update.',
  updateError: 'Error',
  editDestination: 'Edit Destination URL',
  editableQrs: 'Your editable QRs',
  scanningAlt: 'Hand holding phone scanning a QR code',
  shareAnyone: 'Share with anyone!',
}

export type MessageKey = keyof typeof en

const es: Record<MessageKey, string> = {
  description: 'QeepeR te permite crear, editar y compartir códigos QR.',
  myQrCodes: 'Mis códigos QR',
  login: 'Iniciar sesión',
  logout: 'Cerrar sesión',
  generateAnd: 'Genera y',
  edit: 'Edita',
  heroDescription:
    'Genera códigos QR estáticos o dinámicos en segundos, personaliza su diseño y cambia su destino cuando quieras.',
  fastFlexible: 'Rápido. Flexible.',
  yours: 'Tuyo.',
  generateQr: 'Genera un QR',
  qrPreview: 'Vista previa del QR',
  qrPlaceholder: 'Tu código QR aparecerá aquí',
  samplePreview: 'Vista previa de un QR de ejemplo',
  destinationUrl: 'URL de destino',
  urlPlaceholder: 'https://tu-sitio-web.com',
  urlHelp: 'Ingresa la URL o el enlace que quieres abrir con tu código QR.',
  loginRequired: 'Debes iniciar sesión',
  dynamicQr: 'QR dinámico',
  dynamicHelp:
    'Un QR dinámico te permite cambiar el enlace de destino cuando quieras sin volver a imprimirlo.',
  generate: 'Generar',
  download: 'Descargar',
  qrList: 'Tus códigos QR',
  listError: 'No se pudieron cargar tus códigos QR. Inténtalo de nuevo.',
  alias: 'Alias:',
  disabled: 'Desactivado',
  active: 'Activo',
  views: 'Visitas',
  manageQr: 'Administrar QR',
  confirmDisable: '¿Seguro que quieres desactivar este QR?',
  confirmEnable: '¿Seguro que quieres activar este QR?',
  confirmDelete: '¿Seguro que quieres eliminar este QR?',
  backgroundColor: 'Color de fondo',
  squaresColor: 'Color de los cuadrados',
  disableLink: 'Desactivar enlace',
  disableHelp: 'Si activas esta opción, el QR mostrará una página de error 404',
  visitorsCount: 'Número de visitas',
  visitorsHelp: 'Lleva la cuenta de las personas que visitan tu QR',
  delete: 'Eliminar',
  updateSuccess: 'Listo.\nEl QR puede tardar unos segundos en actualizarse.',
  updateError: 'Error',
  editDestination: 'Editar URL de destino',
  editableQrs: 'Tus QR editables',
  scanningAlt: 'Una mano sostiene un teléfono que escanea un código QR',
  shareAnyone: '¡Compártelo con quien quieras!',
}

export const messages = { en, es }
