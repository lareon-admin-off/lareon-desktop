// Lareon's own screens in six languages, plus the rolling "Hello" and the language menu.
(function () {
  var D = {
    en: {
      'err.region': 'Lareon is not available in your region.', 'err.maint': 'Lareon is down for maintenance. Try again soon.', 'off.t': '{a} can’t connect', 'off.p': 'Check your internet connection. Nothing is lost, and the app picks up where you left off when you try again.', 'off.b': 'Try again',
      'btn.start': 'Get started', 'btn.cont': 'Continue', 'btn.back': 'Back', 'btn.skip': 'Skip for now', 'btn.open': 'Open Lareon', 'lang': 'Language',
      'si.title': 'Sign in to Lareon', 'si.tag': 'One account for Fledge, Ember and everything else in Larsonia.', 'si.user': 'Username', 'si.userph': 'Your username', 'si.pass': 'Password', 'si.passph': 'Your password', 'si.btn': 'Sign in',
      'si.forgot': 'Forgot password?', 'si.new': 'New to Lareon?', 'si.create': 'Create an account', 'si.err.empty': 'Enter your username and password.', 'si.err.fail': 'Could not sign in. Try again.',
      'cd.title': 'Check your code', 'cd.app': 'Enter your sign-in code. Use the code from your authenticator app{m}, or a backup code.', 'cd.appmail': ', the code we emailed to {c}', 'cd.mail': 'We sent a code to {c}. Enter it below.',
      'cd.label': 'Verification code', 'cd.btn': 'Verify', 'cd.trust': 'Don’t ask again on this computer for 30 days', 'cd.lost': 'Lost your phone? Use one of your backup codes in the same box.', 'cd.err': 'That code did not work. Try again.',
      'su.title': 'Create your account', 'su.tag': 'One account for Dusk, Fledge and Aster. Free.', 'su.name': 'Your name', 'su.nameph': 'What should we call you?', 'su.user': 'Choose a username', 'su.pass': 'Password', 'su.passph': 'At least 6 characters',
      'su.next': 'Continue', 'su.have': 'Already have an account?', 'su.signin': 'Sign in', 'su.dob': 'Date of birth', 'su.month': 'Month', 'su.year': 'Year', 'su.dobwhy': 'We only use this to check your age.',
      'su.email': 'Recovery email', 'su.emailph': 'you@example.com', 'su.emailwhy': 'Used to reset your password and send sign-in codes. We’ll email you a code to confirm it.', 'su.noemail': 'I don’t want to add an email', 'su.useemail': 'Add an email instead',
      'su.noemailnote': 'Without a recovery email, a lost password can’t be reset. Keep it safe.', 'su.terms': 'Terms of Service', 'su.agree': 'I agree to the Terms of Service', 'su.readall': 'Scroll to the end to continue.', 'su.create': 'Create account',
      'su.vtitle': 'Confirm your email', 'su.vmsg': 'We sent a code to {e}. Enter it to create your account.', 'su.under': 'Lareon is for people 13 and older.', 'su.err.short': 'Password must be at least 6 characters.', 'su.err.fill': 'Fill in every field.', 'su.err.dob': 'Enter your birth month and year.', 'su.err.email': 'Enter an email address.', 'su.err.taken': 'That username is not available.',
      'rs.title': 'Reset your password', 'rs.tag': 'Enter your username and we’ll send a code to your recovery email.', 'rs.send': 'Send code', 'rs.sent': 'We sent a code to {c}.', 'rs.code': 'Reset code', 'rs.new': 'New password', 'rs.btn': 'Reset password', 'rs.backup': 'Use a backup code instead', 'rs.back': 'Back to sign in', 'rs.err.fill': 'Fill in every field.',
      'greet.m': 'Good morning', 'greet.a': 'Good afternoon', 'greet.e': 'Good evening', 'jump': 'Jump to…', 'jump.ph': 'Jump to an app or action', 'jump.none': 'Nothing found',
      'today': 'Today', 'events': 'Events', 'tasks': 'Tasks', 'ev.none': 'Nothing scheduled today.', 'tk.none': 'You are all caught up.', 'tk.add': 'Add', 'tk.ph': 'Add a task for today', 'tk.fail': 'Could not add the task. Try again.', 'tk.late': 'Overdue', 'tk.pri': 'Priority', 'allday': 'All day',
      'inbox': 'Inbox', 'unread1': 'unread message', 'unreadn': 'unread messages', 'inbox.none': 'Your inbox is empty.', 'nosubj': '(no subject)', 'now': 'now',
      'open.dusk': 'Open Dusk', 'open.fledge': 'Open Fledge', 'open.x': 'Open {a}', 'apps': 'Your apps', 'home': 'Home', 'signedas': 'Signed in as', 'store': '{s} of storage used',
      'acct': 'Account settings', 'upd': 'Check for updates', 'out': 'Sign out', 'signin': 'Sign in', 'offline': 'Can’t reach Lareon right now.', 'opening': 'Opening {a}…', 'sess': 'Your session ended. Sign in again.', 'signto': 'Sign in to open {a}.',
      'd.dusk': 'Calendar, tasks and notes', 'd.fledge': 'Private email', 'd.aster': 'Your assistant',
      'wl.h': 'Everything you use. One account.', 'wl.p': 'Mail, calendar, tasks, notes and an assistant that works for you. Private, and free.',
      'wl.f1': 'Dusk plans your day', 'wl.f2': 'Fledge keeps mail calm', 'wl.f3': 'Aster helps you think', 'wl.f4': 'One sign-in, nothing to install twice',
      'hello.h': 'Welcome to Lareon', 'hello.p': 'Dusk, Fledge and Aster, together in one app. Let’s set it up. It takes about a minute.',
      'one.h': 'Lareon is one', 'one.p': 'One window, one account. Everything you use stays connected, so you never sign in twice.', 'one.t1': 'Switch apps from the tabs at the top of the window. Home shows them all.', 'one.t2': 'One Lareon account signs you in to all three.', 'one.t3': 'Nothing extra to install. It’s all in this app.',
      'apps.h': 'Choose your apps', 'apps.p': 'Pick the ones you want in your window. You can change this later.', 'apps.err': 'Pick at least one app.',
      'td.h': 'Plan your day in Dusk', 'td.p': 'Your calendar, tasks and notes in one place.', 'td.t1': 'Events remind you before they start.', 'td.t2': 'Tasks and notes sit beside your calendar.',
      'tf.h': 'Email, made calm', 'tf.p': 'Fledge is your inbox, with your Lareon address.', 'tf.t1': 'Compose and reply right in the window.', 'tf.t2': 'Notifications tell you when new mail arrives.',
      'ta.h': 'Ask Aster anything', 'ta.p': 'Your assistant for questions, writing and ideas.', 'ta.t1': 'Ask in plain words. No special commands.', 'ta.t2': 'Start a new chat any time for a fresh topic.',
      'look.h': 'Choose a look', 'look.p': 'Match your computer, or pick light or dark.', 'look.auto': 'Automatic', 'look.light': 'Light', 'look.dark': 'Dark',
      'nt.h': 'Stay in the loop', 'nt.p': 'Get a notification when an event starts in Dusk or new mail arrives in Fledge.', 'nt.row': 'Notifications', 'nt.small': 'Shown while Lareon is open', 'nt.test': 'Send a test notification',
      'st.h': 'Always at hand', 'st.p': 'Open Lareon when you turn on your computer, so reminders are never missed.', 'st.row': 'Open Lareon at startup', 'st.small': 'You can turn this off any time in your computer’s settings',
      'pv.h': 'Your account, your data', 'pv.p': 'A few things worth knowing before you sign in.', 'pv.t1': 'Lareon only opens lareon.org pages inside the app. Other links open in your browser.', 'pv.t2': 'Your password goes to Lareon directly. This app never stores it.', 'pv.t3': 'You stay signed in on this computer until you choose Sign out.',
      'sg.h': 'Make it yours', 'sg.p': 'Sign in or create your account. Your password goes straight to Lareon.',
      'ks.h': 'Handy shortcuts', 'ks.p': 'Get around without lifting your hands.', 'ks.home': 'Open Home', 'ks.reload': 'Reload the current app', 'ks.zin': 'Zoom in', 'ks.zout': 'Zoom out', 'ks.zreset': 'Reset zoom', 'ks.jump': 'Jump to anything',
      'dn.h': 'You’re all set', 'dn.hw': 'Welcome, {n}', 'dn.in': 'You’re signed in.', 'dn.out': 'You can sign in when Lareon opens.', 'dn.ready': 'Your apps are ready.', 'dn.t1': '{k} + 1 opens Home, and 2, 3, 4 switch between your apps.', 'dn.t2': 'Need help? Open Help in the menu bar, or write to help@lareon.org.', 'dn.t3': 'You can run this setup again from the account menu.'
    },
    es: {
      'err.region': 'Lareon no está disponible en tu región.', 'err.maint': 'Lareon está en mantenimiento. Inténtalo de nuevo pronto.', 'off.t': '{a} no puede conectarse', 'off.p': 'Revisa tu conexión a internet. No se pierde nada y la app continúa donde lo dejaste al reintentar.', 'off.b': 'Reintentar',
      'btn.start': 'Empezar', 'btn.cont': 'Continuar', 'btn.back': 'Atrás', 'btn.skip': 'Omitir por ahora', 'btn.open': 'Abrir Lareon', 'lang': 'Idioma',
      'si.title': 'Inicia sesión en Lareon', 'si.tag': 'Una cuenta para Dusk, Fledge y Aster.', 'si.user': 'Usuario', 'si.userph': 'Tu usuario', 'si.pass': 'Contraseña', 'si.passph': 'Tu contraseña', 'si.btn': 'Iniciar sesión',
      'si.forgot': '¿Olvidaste la contraseña?', 'si.new': '¿Nuevo en Lareon?', 'si.create': 'Crear una cuenta', 'si.err.empty': 'Escribe tu usuario y contraseña.', 'si.err.fail': 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      'cd.title': 'Revisa tu código', 'cd.app': 'Escribe tu código de acceso. Usa el código de tu app de autenticación{m} o un código de respaldo.', 'cd.appmail': ', el código que enviamos a {c}', 'cd.mail': 'Enviamos un código a {c}. Escríbelo abajo.',
      'cd.label': 'Código de verificación', 'cd.btn': 'Verificar', 'cd.trust': 'No volver a preguntar en este equipo durante 30 días', 'cd.lost': '¿Perdiste el teléfono? Usa un código de respaldo en la misma casilla.', 'cd.err': 'Ese código no funcionó. Inténtalo de nuevo.',
      'su.title': 'Crea tu cuenta', 'su.tag': 'Una cuenta para Dusk, Fledge y Aster. Gratis.', 'su.name': 'Tu nombre', 'su.nameph': '¿Cómo te llamamos?', 'su.user': 'Elige un usuario', 'su.pass': 'Contraseña', 'su.passph': 'Al menos 6 caracteres',
      'su.next': 'Continuar', 'su.have': '¿Ya tienes una cuenta?', 'su.signin': 'Iniciar sesión', 'su.dob': 'Fecha de nacimiento', 'su.month': 'Mes', 'su.year': 'Año', 'su.dobwhy': 'Solo lo usamos para comprobar tu edad.',
      'su.email': 'Correo de recuperación', 'su.emailph': 'tu@ejemplo.com', 'su.emailwhy': 'Sirve para restablecer tu contraseña y enviar códigos. Te enviaremos un código para confirmarlo.', 'su.noemail': 'No quiero añadir un correo', 'su.useemail': 'Añadir un correo',
      'su.noemailnote': 'Sin correo de recuperación, una contraseña perdida no se puede restablecer. Guárdala bien.', 'su.terms': 'Términos del servicio', 'su.agree': 'Acepto los Términos del servicio', 'su.readall': 'Desplázate hasta el final para continuar.', 'su.create': 'Crear cuenta',
      'su.vtitle': 'Confirma tu correo', 'su.vmsg': 'Enviamos un código a {e}. Escríbelo para crear tu cuenta.', 'su.under': 'Lareon es para mayores de 13 años.', 'su.err.short': 'La contraseña debe tener al menos 6 caracteres.', 'su.err.fill': 'Completa todos los campos.', 'su.err.dob': 'Indica tu mes y año de nacimiento.', 'su.err.email': 'Escribe un correo.', 'su.err.taken': 'Ese usuario no está disponible.',
      'rs.title': 'Restablece tu contraseña', 'rs.tag': 'Escribe tu usuario y enviaremos un código a tu correo de recuperación.', 'rs.send': 'Enviar código', 'rs.sent': 'Enviamos un código a {c}.', 'rs.code': 'Código', 'rs.new': 'Nueva contraseña', 'rs.btn': 'Restablecer contraseña', 'rs.backup': 'Usar un código de respaldo', 'rs.back': 'Volver a iniciar sesión', 'rs.err.fill': 'Completa todos los campos.',
      'greet.m': 'Buenos días', 'greet.a': 'Buenas tardes', 'greet.e': 'Buenas noches', 'jump': 'Ir a…', 'jump.ph': 'Ir a una app o acción', 'jump.none': 'Sin resultados',
      'today': 'Hoy', 'events': 'Eventos', 'tasks': 'Tareas', 'ev.none': 'Nada programado para hoy.', 'tk.none': 'Estás al día.', 'tk.add': 'Añadir', 'tk.ph': 'Añade una tarea para hoy', 'tk.fail': 'No se pudo añadir la tarea. Inténtalo de nuevo.', 'tk.late': 'Vencida', 'tk.pri': 'Prioridad', 'allday': 'Todo el día',
      'inbox': 'Bandeja de entrada', 'unread1': 'mensaje sin leer', 'unreadn': 'mensajes sin leer', 'inbox.none': 'Tu bandeja está vacía.', 'nosubj': '(sin asunto)', 'now': 'ahora',
      'open.dusk': 'Abrir Dusk', 'open.fledge': 'Abrir Fledge', 'open.x': 'Abrir {a}', 'apps': 'Tus apps', 'home': 'Inicio', 'signedas': 'Sesión iniciada como', 'store': '{s} de almacenamiento usado',
      'acct': 'Ajustes de la cuenta', 'upd': 'Buscar actualizaciones', 'out': 'Cerrar sesión', 'signin': 'Iniciar sesión', 'offline': 'No se puede conectar con Lareon ahora.', 'opening': 'Abriendo {a}…', 'sess': 'Tu sesión terminó. Inicia sesión de nuevo.', 'signto': 'Inicia sesión para abrir {a}.',
      'd.dusk': 'Calendario, tareas y notas', 'd.fledge': 'Correo privado', 'd.aster': 'Tu asistente',
      'wl.h': 'Todo lo que usas. Una cuenta.', 'wl.p': 'Correo, calendario, tareas, notas y un asistente que trabaja para ti. Privado y gratis.',
      'wl.f1': 'Dusk organiza tu día', 'wl.f2': 'Fledge mantiene el correo en calma', 'wl.f3': 'Aster te ayuda a pensar', 'wl.f4': 'Un solo acceso, nada que instalar dos veces',
      'hello.h': 'Te damos la bienvenida a Lareon', 'hello.p': 'Dusk, Fledge y Aster, juntos en una sola app. Vamos a configurarla. Lleva alrededor de un minuto.',
      'one.h': 'Lareon es uno', 'one.p': 'Una ventana, una cuenta. Todo lo que usas está conectado, así que nunca inicias sesión dos veces.', 'one.t1': 'Cambia de app desde las pestañas de la parte superior. Inicio las muestra todas.', 'one.t2': 'Una cuenta de Lareon te conecta a las tres.', 'one.t3': 'No hay nada más que instalar. Todo está en esta app.',
      'apps.h': 'Elige tus apps', 'apps.p': 'Elige las que quieras en tu ventana. Puedes cambiarlo después.', 'apps.err': 'Elige al menos una app.',
      'td.h': 'Organiza tu día en Dusk', 'td.p': 'Tu calendario, tareas y notas en un solo lugar.', 'td.t1': 'Los eventos te avisan antes de empezar.', 'td.t2': 'Las tareas y notas están junto a tu calendario.',
      'tf.h': 'Correo en calma', 'tf.p': 'Fledge es tu bandeja de entrada, con tu dirección de Lareon.', 'tf.t1': 'Escribe y responde sin salir de la ventana.', 'tf.t2': 'Las notificaciones te avisan cuando llega correo nuevo.',
      'ta.h': 'Pregúntale lo que quieras a Aster', 'ta.p': 'Tu asistente para preguntas, textos e ideas.', 'ta.t1': 'Pregunta con tus palabras. Sin comandos especiales.', 'ta.t2': 'Empieza un chat nuevo cuando quieras cambiar de tema.',
      'look.h': 'Elige un aspecto', 'look.p': 'Igual que tu equipo, o elige claro u oscuro.', 'look.auto': 'Automático', 'look.light': 'Claro', 'look.dark': 'Oscuro',
      'nt.h': 'Mantente al día', 'nt.p': 'Recibe una notificación cuando empiece un evento en Dusk o llegue correo a Fledge.', 'nt.row': 'Notificaciones', 'nt.small': 'Se muestran mientras Lareon está abierto', 'nt.test': 'Enviar una notificación de prueba',
      'st.h': 'Siempre a mano', 'st.p': 'Abre Lareon al encender el equipo para no perderte ningún aviso.', 'st.row': 'Abrir Lareon al iniciar', 'st.small': 'Puedes desactivarlo cuando quieras en los ajustes del equipo',
      'pv.h': 'Tu cuenta, tus datos', 'pv.p': 'Algunas cosas que conviene saber antes de iniciar sesión.', 'pv.t1': 'Lareon solo abre páginas de lareon.org dentro de la app. Los demás enlaces se abren en tu navegador.', 'pv.t2': 'Tu contraseña va directamente a Lareon. La app nunca la guarda.', 'pv.t3': 'Sigues con la sesión iniciada en este equipo hasta que elijas Cerrar sesión.',
      'sg.h': 'Hazlo tuyo', 'sg.p': 'Inicia sesión o crea tu cuenta. Tu contraseña va directa a Lareon.',
      'ks.h': 'Atajos útiles', 'ks.p': 'Muévete sin separar las manos del teclado.', 'ks.home': 'Abrir Inicio', 'ks.reload': 'Recargar la app actual', 'ks.zin': 'Acercar', 'ks.zout': 'Alejar', 'ks.zreset': 'Restablecer zoom', 'ks.jump': 'Ir a cualquier cosa',
      'dn.h': 'Todo listo', 'dn.hw': 'Te damos la bienvenida, {n}', 'dn.in': 'Has iniciado sesión.', 'dn.out': 'Podrás iniciar sesión cuando se abra Lareon.', 'dn.ready': 'Tus apps están listas.', 'dn.t1': '{k} + 1 abre Inicio, y 2, 3, 4 cambian entre tus apps.', 'dn.t2': '¿Necesitas ayuda? Abre Ayuda en la barra de menús o escribe a help@lareon.org.', 'dn.t3': 'Puedes repetir esta configuración desde el menú de la cuenta.'
    },
    fr: {
      'err.region': 'Lareon n’est pas disponible dans votre région.', 'err.maint': 'Lareon est en maintenance. Réessayez bientôt.', 'off.t': '{a} ne parvient pas à se connecter', 'off.p': 'Vérifiez votre connexion internet. Rien n’est perdu, et l’app reprend là où vous en étiez.', 'off.b': 'Réessayer',
      'btn.start': 'Commencer', 'btn.cont': 'Continuer', 'btn.back': 'Retour', 'btn.skip': 'Passer pour l’instant', 'btn.open': 'Ouvrir Lareon', 'lang': 'Langue',
      'si.title': 'Connectez-vous à Lareon', 'si.tag': 'Un seul compte pour Dusk, Fledge et Aster.', 'si.user': 'Nom d’utilisateur', 'si.userph': 'Votre nom d’utilisateur', 'si.pass': 'Mot de passe', 'si.passph': 'Votre mot de passe', 'si.btn': 'Se connecter',
      'si.forgot': 'Mot de passe oublié ?', 'si.new': 'Nouveau sur Lareon ?', 'si.create': 'Créer un compte', 'si.err.empty': 'Saisissez votre nom d’utilisateur et votre mot de passe.', 'si.err.fail': 'Connexion impossible. Réessayez.',
      'cd.title': 'Vérifiez votre code', 'cd.app': 'Saisissez votre code de connexion. Utilisez le code de votre application d’authentification{m}, ou un code de secours.', 'cd.appmail': ', le code envoyé à {c}', 'cd.mail': 'Nous avons envoyé un code à {c}. Saisissez-le ci-dessous.',
      'cd.label': 'Code de vérification', 'cd.btn': 'Vérifier', 'cd.trust': 'Ne plus demander sur cet ordinateur pendant 30 jours', 'cd.lost': 'Téléphone perdu ? Utilisez un code de secours dans la même case.', 'cd.err': 'Ce code n’a pas fonctionné. Réessayez.',
      'su.title': 'Créez votre compte', 'su.tag': 'Un seul compte pour Dusk, Fledge et Aster. Gratuit.', 'su.name': 'Votre nom', 'su.nameph': 'Comment vous appeler ?', 'su.user': 'Choisissez un nom d’utilisateur', 'su.pass': 'Mot de passe', 'su.passph': 'Au moins 6 caractères',
      'su.next': 'Continuer', 'su.have': 'Vous avez déjà un compte ?', 'su.signin': 'Se connecter', 'su.dob': 'Date de naissance', 'su.month': 'Mois', 'su.year': 'Année', 'su.dobwhy': 'Utilisée uniquement pour vérifier votre âge.',
      'su.email': 'E-mail de récupération', 'su.emailph': 'vous@exemple.com', 'su.emailwhy': 'Sert à réinitialiser votre mot de passe et à envoyer des codes. Nous vous enverrons un code pour le confirmer.', 'su.noemail': 'Je ne veux pas ajouter d’e-mail', 'su.useemail': 'Ajouter un e-mail',
      'su.noemailnote': 'Sans e-mail de récupération, un mot de passe perdu ne peut pas être réinitialisé. Conservez-le bien.', 'su.terms': 'Conditions d’utilisation', 'su.agree': 'J’accepte les Conditions d’utilisation', 'su.readall': 'Faites défiler jusqu’au bout pour continuer.', 'su.create': 'Créer le compte',
      'su.vtitle': 'Confirmez votre e-mail', 'su.vmsg': 'Nous avons envoyé un code à {e}. Saisissez-le pour créer votre compte.', 'su.under': 'Lareon est réservé aux personnes de 13 ans et plus.', 'su.err.short': 'Le mot de passe doit comporter au moins 6 caractères.', 'su.err.fill': 'Remplissez tous les champs.', 'su.err.dob': 'Indiquez votre mois et année de naissance.', 'su.err.email': 'Saisissez une adresse e-mail.', 'su.err.taken': 'Ce nom d’utilisateur n’est pas disponible.',
      'rs.title': 'Réinitialisez votre mot de passe', 'rs.tag': 'Saisissez votre nom d’utilisateur et nous enverrons un code à votre e-mail de récupération.', 'rs.send': 'Envoyer le code', 'rs.sent': 'Nous avons envoyé un code à {c}.', 'rs.code': 'Code', 'rs.new': 'Nouveau mot de passe', 'rs.btn': 'Réinitialiser', 'rs.backup': 'Utiliser un code de secours', 'rs.back': 'Retour à la connexion', 'rs.err.fill': 'Remplissez tous les champs.',
      'greet.m': 'Bonjour', 'greet.a': 'Bon après-midi', 'greet.e': 'Bonsoir', 'jump': 'Aller à…', 'jump.ph': 'Aller à une app ou une action', 'jump.none': 'Aucun résultat',
      'today': 'Aujourd’hui', 'events': 'Événements', 'tasks': 'Tâches', 'ev.none': 'Rien de prévu aujourd’hui.', 'tk.none': 'Vous êtes à jour.', 'tk.add': 'Ajouter', 'tk.ph': 'Ajouter une tâche pour aujourd’hui', 'tk.fail': 'Impossible d’ajouter la tâche. Réessayez.', 'tk.late': 'En retard', 'tk.pri': 'Prioritaire', 'allday': 'Toute la journée',
      'inbox': 'Boîte de réception', 'unread1': 'message non lu', 'unreadn': 'messages non lus', 'inbox.none': 'Votre boîte est vide.', 'nosubj': '(sans objet)', 'now': 'à l’instant',
      'open.dusk': 'Ouvrir Dusk', 'open.fledge': 'Ouvrir Fledge', 'open.x': 'Ouvrir {a}', 'apps': 'Vos apps', 'home': 'Accueil', 'signedas': 'Connecté en tant que', 'store': '{s} de stockage utilisé',
      'acct': 'Réglages du compte', 'upd': 'Rechercher des mises à jour', 'out': 'Se déconnecter', 'signin': 'Se connecter', 'offline': 'Impossible de joindre Lareon pour le moment.', 'opening': 'Ouverture de {a}…', 'sess': 'Votre session a expiré. Reconnectez-vous.', 'signto': 'Connectez-vous pour ouvrir {a}.',
      'd.dusk': 'Agenda, tâches et notes', 'd.fledge': 'E-mail privé', 'd.aster': 'Votre assistant',
      'wl.h': 'Tout ce que vous utilisez. Un seul compte.', 'wl.p': 'Messagerie, agenda, tâches, notes et un assistant qui travaille pour vous. Privé et gratuit.',
      'wl.f1': 'Dusk organise votre journée', 'wl.f2': 'Fledge apaise votre messagerie', 'wl.f3': 'Aster vous aide à réfléchir', 'wl.f4': 'Une seule connexion, rien à installer deux fois',
      'hello.h': 'Bienvenue sur Lareon', 'hello.p': 'Dusk, Fledge et Aster, réunis dans une seule app. Configurons-la. Cela prend environ une minute.',
      'one.h': 'Lareon ne fait qu’un', 'one.p': 'Une fenêtre, un compte. Tout reste connecté, vous ne vous connectez jamais deux fois.', 'one.t1': 'Changez d’app avec les onglets en haut de la fenêtre. Accueil les affiche toutes.', 'one.t2': 'Un seul compte Lareon vous connecte aux trois.', 'one.t3': 'Rien d’autre à installer. Tout est dans cette app.',
      'apps.h': 'Choisissez vos apps', 'apps.p': 'Choisissez celles que vous voulez dans votre fenêtre. Vous pourrez changer plus tard.', 'apps.err': 'Choisissez au moins une app.',
      'td.h': 'Organisez votre journée avec Dusk', 'td.p': 'Votre agenda, vos tâches et vos notes au même endroit.', 'td.t1': 'Les événements vous rappellent avant leur début.', 'td.t2': 'Tâches et notes sont à côté de votre agenda.',
      'tf.h': 'Un e-mail serein', 'tf.p': 'Fledge est votre boîte de réception, avec votre adresse Lareon.', 'tf.t1': 'Écrivez et répondez directement dans la fenêtre.', 'tf.t2': 'Les notifications vous préviennent des nouveaux messages.',
      'ta.h': 'Demandez tout à Aster', 'ta.p': 'Votre assistant pour les questions, l’écriture et les idées.', 'ta.t1': 'Parlez naturellement. Aucune commande spéciale.', 'ta.t2': 'Lancez une nouvelle discussion à tout moment.',
      'look.h': 'Choisissez un style', 'look.p': 'Comme votre ordinateur, ou clair ou sombre.', 'look.auto': 'Automatique', 'look.light': 'Clair', 'look.dark': 'Sombre',
      'nt.h': 'Restez informé', 'nt.p': 'Recevez une notification au début d’un événement Dusk ou à l’arrivée d’un e-mail Fledge.', 'nt.row': 'Notifications', 'nt.small': 'Affichées pendant que Lareon est ouvert', 'nt.test': 'Envoyer une notification de test',
      'st.h': 'Toujours à portée de main', 'st.p': 'Ouvrez Lareon au démarrage de l’ordinateur pour ne rien manquer.', 'st.row': 'Ouvrir Lareon au démarrage', 'st.small': 'Désactivable à tout moment dans les réglages de l’ordinateur',
      'pv.h': 'Votre compte, vos données', 'pv.p': 'Quelques points utiles avant de vous connecter.', 'pv.t1': 'Lareon n’ouvre que des pages lareon.org dans l’app. Les autres liens s’ouvrent dans votre navigateur.', 'pv.t2': 'Votre mot de passe va directement à Lareon. L’app ne le conserve jamais.', 'pv.t3': 'Vous restez connecté sur cet ordinateur jusqu’à ce que vous choisissiez Se déconnecter.',
      'sg.h': 'Personnalisez-le', 'sg.p': 'Connectez-vous ou créez votre compte. Votre mot de passe va directement à Lareon.',
      'ks.h': 'Raccourcis utiles', 'ks.p': 'Naviguez sans quitter le clavier.', 'ks.home': 'Ouvrir Accueil', 'ks.reload': 'Recharger l’app actuelle', 'ks.zin': 'Zoom avant', 'ks.zout': 'Zoom arrière', 'ks.zreset': 'Réinitialiser le zoom', 'ks.jump': 'Aller à tout',
      'dn.h': 'Tout est prêt', 'dn.hw': 'Bienvenue, {n}', 'dn.in': 'Vous êtes connecté.', 'dn.out': 'Vous pourrez vous connecter à l’ouverture de Lareon.', 'dn.ready': 'Vos apps sont prêtes.', 'dn.t1': '{k} + 1 ouvre Accueil, et 2, 3, 4 passent d’une app à l’autre.', 'dn.t2': 'Besoin d’aide ? Ouvrez Aide dans la barre de menus ou écrivez à help@lareon.org.', 'dn.t3': 'Vous pouvez relancer cette configuration depuis le menu du compte.'
    },
    de: {
      'err.region': 'Lareon ist in deiner Region nicht verfügbar.', 'err.maint': 'Lareon wird gerade gewartet. Versuch es bald erneut.', 'off.t': '{a} kann keine Verbindung herstellen', 'off.p': 'Prüfe deine Internetverbindung. Nichts geht verloren, die App macht danach dort weiter, wo du aufgehört hast.', 'off.b': 'Erneut versuchen',
      'btn.start': 'Los geht’s', 'btn.cont': 'Weiter', 'btn.back': 'Zurück', 'btn.skip': 'Vorerst überspringen', 'btn.open': 'Lareon öffnen', 'lang': 'Sprache',
      'si.title': 'Bei Lareon anmelden', 'si.tag': 'Ein Konto für Dusk, Fledge und Aster.', 'si.user': 'Benutzername', 'si.userph': 'Dein Benutzername', 'si.pass': 'Passwort', 'si.passph': 'Dein Passwort', 'si.btn': 'Anmelden',
      'si.forgot': 'Passwort vergessen?', 'si.new': 'Neu bei Lareon?', 'si.create': 'Konto erstellen', 'si.err.empty': 'Gib Benutzername und Passwort ein.', 'si.err.fail': 'Anmeldung nicht möglich. Versuch es erneut.',
      'cd.title': 'Code prüfen', 'cd.app': 'Gib deinen Anmeldecode ein. Verwende den Code deiner Authenticator-App{m} oder einen Backup-Code.', 'cd.appmail': ', den Code, den wir an {c} geschickt haben', 'cd.mail': 'Wir haben einen Code an {c} geschickt. Gib ihn unten ein.',
      'cd.label': 'Bestätigungscode', 'cd.btn': 'Bestätigen', 'cd.trust': 'Auf diesem Computer 30 Tage lang nicht mehr fragen', 'cd.lost': 'Handy verloren? Nutze einen Backup-Code im selben Feld.', 'cd.err': 'Dieser Code hat nicht funktioniert. Versuch es erneut.',
      'su.title': 'Konto erstellen', 'su.tag': 'Ein Konto für Dusk, Fledge und Aster. Kostenlos.', 'su.name': 'Dein Name', 'su.nameph': 'Wie sollen wir dich nennen?', 'su.user': 'Wähle einen Benutzernamen', 'su.pass': 'Passwort', 'su.passph': 'Mindestens 6 Zeichen',
      'su.next': 'Weiter', 'su.have': 'Du hast schon ein Konto?', 'su.signin': 'Anmelden', 'su.dob': 'Geburtsdatum', 'su.month': 'Monat', 'su.year': 'Jahr', 'su.dobwhy': 'Wir nutzen das nur, um dein Alter zu prüfen.',
      'su.email': 'Wiederherstellungs-E-Mail', 'su.emailph': 'du@beispiel.de', 'su.emailwhy': 'Zum Zurücksetzen deines Passworts und für Anmeldecodes. Wir schicken dir einen Code zur Bestätigung.', 'su.noemail': 'Ich möchte keine E-Mail angeben', 'su.useemail': 'Stattdessen E-Mail hinzufügen',
      'su.noemailnote': 'Ohne Wiederherstellungs-E-Mail lässt sich ein verlorenes Passwort nicht zurücksetzen. Bewahre es gut auf.', 'su.terms': 'Nutzungsbedingungen', 'su.agree': 'Ich stimme den Nutzungsbedingungen zu', 'su.readall': 'Scrolle bis zum Ende, um fortzufahren.', 'su.create': 'Konto erstellen',
      'su.vtitle': 'E-Mail bestätigen', 'su.vmsg': 'Wir haben einen Code an {e} geschickt. Gib ihn ein, um dein Konto zu erstellen.', 'su.under': 'Lareon ist für Personen ab 13 Jahren.', 'su.err.short': 'Das Passwort muss mindestens 6 Zeichen haben.', 'su.err.fill': 'Fülle alle Felder aus.', 'su.err.dob': 'Gib Geburtsmonat und -jahr an.', 'su.err.email': 'Gib eine E-Mail-Adresse ein.', 'su.err.taken': 'Dieser Benutzername ist nicht verfügbar.',
      'rs.title': 'Passwort zurücksetzen', 'rs.tag': 'Gib deinen Benutzernamen ein, wir schicken einen Code an deine Wiederherstellungs-E-Mail.', 'rs.send': 'Code senden', 'rs.sent': 'Wir haben einen Code an {c} geschickt.', 'rs.code': 'Code', 'rs.new': 'Neues Passwort', 'rs.btn': 'Passwort zurücksetzen', 'rs.backup': 'Stattdessen Backup-Code nutzen', 'rs.back': 'Zurück zur Anmeldung', 'rs.err.fill': 'Fülle alle Felder aus.',
      'greet.m': 'Guten Morgen', 'greet.a': 'Guten Tag', 'greet.e': 'Guten Abend', 'jump': 'Gehe zu…', 'jump.ph': 'Zu einer App oder Aktion springen', 'jump.none': 'Nichts gefunden',
      'today': 'Heute', 'events': 'Termine', 'tasks': 'Aufgaben', 'ev.none': 'Heute ist nichts geplant.', 'tk.none': 'Alles erledigt.', 'tk.add': 'Hinzufügen', 'tk.ph': 'Aufgabe für heute hinzufügen', 'tk.fail': 'Aufgabe konnte nicht hinzugefügt werden. Versuch es erneut.', 'tk.late': 'Überfällig', 'tk.pri': 'Wichtig', 'allday': 'Ganztägig',
      'inbox': 'Posteingang', 'unread1': 'ungelesene Nachricht', 'unreadn': 'ungelesene Nachrichten', 'inbox.none': 'Dein Posteingang ist leer.', 'nosubj': '(kein Betreff)', 'now': 'jetzt',
      'open.dusk': 'Dusk öffnen', 'open.fledge': 'Fledge öffnen', 'open.x': '{a} öffnen', 'apps': 'Deine Apps', 'home': 'Start', 'signedas': 'Angemeldet als', 'store': '{s} Speicher belegt',
      'acct': 'Kontoeinstellungen', 'upd': 'Nach Updates suchen', 'out': 'Abmelden', 'signin': 'Anmelden', 'offline': 'Lareon ist gerade nicht erreichbar.', 'opening': '{a} wird geöffnet…', 'sess': 'Deine Sitzung ist abgelaufen. Melde dich erneut an.', 'signto': 'Melde dich an, um {a} zu öffnen.',
      'd.dusk': 'Kalender, Aufgaben und Notizen', 'd.fledge': 'Private E-Mail', 'd.aster': 'Dein Assistent',
      'wl.h': 'Alles, was du nutzt. Ein Konto.', 'wl.p': 'E-Mail, Kalender, Aufgaben, Notizen und ein Assistent, der für dich arbeitet. Privat und kostenlos.',
      'wl.f1': 'Dusk plant deinen Tag', 'wl.f2': 'Fledge bringt Ruhe in dein Postfach', 'wl.f3': 'Aster hilft dir beim Denken', 'wl.f4': 'Eine Anmeldung, nichts doppelt installieren',
      'hello.h': 'Willkommen bei Lareon', 'hello.p': 'Dusk, Fledge und Aster zusammen in einer App. Richten wir sie ein. Das dauert etwa eine Minute.',
      'one.h': 'Lareon ist eins', 'one.p': 'Ein Fenster, ein Konto. Alles bleibt verbunden, du meldest dich nie zweimal an.', 'one.t1': 'Wechsle die Apps über die Tabs oben im Fenster. Start zeigt alle.', 'one.t2': 'Ein Lareon-Konto meldet dich bei allen dreien an.', 'one.t3': 'Nichts weiter zu installieren. Alles steckt in dieser App.',
      'apps.h': 'Wähle deine Apps', 'apps.p': 'Wähle, was in deinem Fenster sein soll. Du kannst das später ändern.', 'apps.err': 'Wähle mindestens eine App.',
      'td.h': 'Plane deinen Tag in Dusk', 'td.p': 'Kalender, Aufgaben und Notizen an einem Ort.', 'td.t1': 'Termine erinnern dich, bevor sie beginnen.', 'td.t2': 'Aufgaben und Notizen stehen neben deinem Kalender.',
      'tf.h': 'E-Mail mit Ruhe', 'tf.p': 'Fledge ist dein Postfach mit deiner Lareon-Adresse.', 'tf.t1': 'Schreibe und antworte direkt im Fenster.', 'tf.t2': 'Benachrichtigungen melden neue Nachrichten.',
      'ta.h': 'Frag Aster, was du willst', 'ta.p': 'Dein Assistent für Fragen, Texte und Ideen.', 'ta.t1': 'Frag in normalen Worten. Keine Spezialbefehle.', 'ta.t2': 'Starte jederzeit einen neuen Chat für ein neues Thema.',
      'look.h': 'Wähle ein Aussehen', 'look.p': 'Wie dein Computer, oder hell oder dunkel.', 'look.auto': 'Automatisch', 'look.light': 'Hell', 'look.dark': 'Dunkel',
      'nt.h': 'Immer auf dem Laufenden', 'nt.p': 'Erhalte eine Benachrichtigung, wenn ein Dusk-Termin beginnt oder neue Fledge-Post eintrifft.', 'nt.row': 'Benachrichtigungen', 'nt.small': 'Werden angezeigt, solange Lareon geöffnet ist', 'nt.test': 'Testbenachrichtigung senden',
      'st.h': 'Immer griffbereit', 'st.p': 'Öffne Lareon beim Einschalten des Computers, damit du nichts verpasst.', 'st.row': 'Lareon beim Start öffnen', 'st.small': 'Lässt sich jederzeit in den Computereinstellungen ausschalten',
      'pv.h': 'Dein Konto, deine Daten', 'pv.p': 'Ein paar Dinge, die du vor der Anmeldung wissen solltest.', 'pv.t1': 'Lareon öffnet in der App nur Seiten von lareon.org. Andere Links öffnen sich im Browser.', 'pv.t2': 'Dein Passwort geht direkt an Lareon. Die App speichert es nie.', 'pv.t3': 'Du bleibst auf diesem Computer angemeldet, bis du Abmelden wählst.',
      'sg.h': 'Mach es zu deinem', 'sg.p': 'Melde dich an oder erstelle dein Konto. Dein Passwort geht direkt an Lareon.',
      'ks.h': 'Praktische Kurzbefehle', 'ks.p': 'Navigiere, ohne die Hände von der Tastatur zu nehmen.', 'ks.home': 'Start öffnen', 'ks.reload': 'Aktuelle App neu laden', 'ks.zin': 'Vergrößern', 'ks.zout': 'Verkleinern', 'ks.zreset': 'Zoom zurücksetzen', 'ks.jump': 'Zu allem springen',
      'dn.h': 'Alles bereit', 'dn.hw': 'Willkommen, {n}', 'dn.in': 'Du bist angemeldet.', 'dn.out': 'Du kannst dich anmelden, wenn Lareon startet.', 'dn.ready': 'Deine Apps sind bereit.', 'dn.t1': '{k} + 1 öffnet Start, mit 2, 3, 4 wechselst du zwischen den Apps.', 'dn.t2': 'Hilfe nötig? Öffne Hilfe in der Menüleiste oder schreibe an help@lareon.org.', 'dn.t3': 'Du kannst diese Einrichtung jederzeit im Kontomenü wiederholen.'
    },
    pt: {
      'err.region': 'O Lareon não está disponível na sua região.', 'err.maint': 'O Lareon está em manutenção. Tente novamente em breve.', 'off.t': '{a} não consegue se conectar', 'off.p': 'Verifique sua conexão com a internet. Nada se perde, e o app continua de onde você parou.', 'off.b': 'Tentar novamente',
      'btn.start': 'Começar', 'btn.cont': 'Continuar', 'btn.back': 'Voltar', 'btn.skip': 'Pular por enquanto', 'btn.open': 'Abrir o Lareon', 'lang': 'Idioma',
      'si.title': 'Entre no Lareon', 'si.tag': 'Uma conta para Dusk, Fledge e Aster.', 'si.user': 'Usuário', 'si.userph': 'Seu usuário', 'si.pass': 'Senha', 'si.passph': 'Sua senha', 'si.btn': 'Entrar',
      'si.forgot': 'Esqueceu a senha?', 'si.new': 'Novo no Lareon?', 'si.create': 'Criar uma conta', 'si.err.empty': 'Digite seu usuário e senha.', 'si.err.fail': 'Não foi possível entrar. Tente novamente.',
      'cd.title': 'Confira seu código', 'cd.app': 'Digite seu código de acesso. Use o código do seu app autenticador{m} ou um código de backup.', 'cd.appmail': ', o código que enviamos para {c}', 'cd.mail': 'Enviamos um código para {c}. Digite-o abaixo.',
      'cd.label': 'Código de verificação', 'cd.btn': 'Verificar', 'cd.trust': 'Não perguntar de novo neste computador por 30 dias', 'cd.lost': 'Perdeu o celular? Use um código de backup no mesmo campo.', 'cd.err': 'Esse código não funcionou. Tente novamente.',
      'su.title': 'Crie sua conta', 'su.tag': 'Uma conta para Dusk, Fledge e Aster. Grátis.', 'su.name': 'Seu nome', 'su.nameph': 'Como devemos chamar você?', 'su.user': 'Escolha um usuário', 'su.pass': 'Senha', 'su.passph': 'Pelo menos 6 caracteres',
      'su.next': 'Continuar', 'su.have': 'Já tem uma conta?', 'su.signin': 'Entrar', 'su.dob': 'Data de nascimento', 'su.month': 'Mês', 'su.year': 'Ano', 'su.dobwhy': 'Usamos apenas para verificar sua idade.',
      'su.email': 'E-mail de recuperação', 'su.emailph': 'voce@exemplo.com', 'su.emailwhy': 'Serve para redefinir sua senha e enviar códigos. Vamos enviar um código para confirmar.', 'su.noemail': 'Não quero adicionar um e-mail', 'su.useemail': 'Adicionar um e-mail',
      'su.noemailnote': 'Sem e-mail de recuperação, uma senha perdida não pode ser redefinida. Guarde-a bem.', 'su.terms': 'Termos de Serviço', 'su.agree': 'Concordo com os Termos de Serviço', 'su.readall': 'Role até o fim para continuar.', 'su.create': 'Criar conta',
      'su.vtitle': 'Confirme seu e-mail', 'su.vmsg': 'Enviamos um código para {e}. Digite-o para criar sua conta.', 'su.under': 'O Lareon é para maiores de 13 anos.', 'su.err.short': 'A senha deve ter pelo menos 6 caracteres.', 'su.err.fill': 'Preencha todos os campos.', 'su.err.dob': 'Informe o mês e o ano de nascimento.', 'su.err.email': 'Digite um e-mail.', 'su.err.taken': 'Esse usuário não está disponível.',
      'rs.title': 'Redefina sua senha', 'rs.tag': 'Digite seu usuário e enviaremos um código para seu e-mail de recuperação.', 'rs.send': 'Enviar código', 'rs.sent': 'Enviamos um código para {c}.', 'rs.code': 'Código', 'rs.new': 'Nova senha', 'rs.btn': 'Redefinir senha', 'rs.backup': 'Usar um código de backup', 'rs.back': 'Voltar para entrar', 'rs.err.fill': 'Preencha todos os campos.',
      'greet.m': 'Bom dia', 'greet.a': 'Boa tarde', 'greet.e': 'Boa noite', 'jump': 'Ir para…', 'jump.ph': 'Ir para um app ou ação', 'jump.none': 'Nada encontrado',
      'today': 'Hoje', 'events': 'Eventos', 'tasks': 'Tarefas', 'ev.none': 'Nada agendado para hoje.', 'tk.none': 'Tudo em dia.', 'tk.add': 'Adicionar', 'tk.ph': 'Adicione uma tarefa para hoje', 'tk.fail': 'Não foi possível adicionar a tarefa. Tente novamente.', 'tk.late': 'Atrasada', 'tk.pri': 'Prioridade', 'allday': 'Dia todo',
      'inbox': 'Caixa de entrada', 'unread1': 'mensagem não lida', 'unreadn': 'mensagens não lidas', 'inbox.none': 'Sua caixa de entrada está vazia.', 'nosubj': '(sem assunto)', 'now': 'agora',
      'open.dusk': 'Abrir Dusk', 'open.fledge': 'Abrir Fledge', 'open.x': 'Abrir {a}', 'apps': 'Seus apps', 'home': 'Início', 'signedas': 'Conectado como', 'store': '{s} de armazenamento usado',
      'acct': 'Configurações da conta', 'upd': 'Verificar atualizações', 'out': 'Sair', 'signin': 'Entrar', 'offline': 'Não foi possível conectar ao Lareon agora.', 'opening': 'Abrindo {a}…', 'sess': 'Sua sessão terminou. Entre novamente.', 'signto': 'Entre para abrir {a}.',
      'd.dusk': 'Agenda, tarefas e notas', 'd.fledge': 'E-mail privado', 'd.aster': 'Seu assistente',
      'wl.h': 'Tudo o que você usa. Uma conta.', 'wl.p': 'E-mail, agenda, tarefas, notas e um assistente que trabalha para você. Privado e grátis.',
      'wl.f1': 'O Dusk organiza seu dia', 'wl.f2': 'O Fledge deixa o e-mail tranquilo', 'wl.f3': 'A Aster ajuda você a pensar', 'wl.f4': 'Um só login, nada para instalar duas vezes',
      'hello.h': 'Boas-vindas ao Lareon', 'hello.p': 'Dusk, Fledge e Aster juntos em um só app. Vamos configurar. Leva cerca de um minuto.',
      'one.h': 'O Lareon é um só', 'one.p': 'Uma janela, uma conta. Tudo fica conectado, então você nunca entra duas vezes.', 'one.t1': 'Troque de app pelas abas no topo da janela. O Início mostra todos.', 'one.t2': 'Uma conta Lareon conecta você aos três.', 'one.t3': 'Nada mais para instalar. Está tudo neste app.',
      'apps.h': 'Escolha seus apps', 'apps.p': 'Escolha os que quer na sua janela. Você pode mudar depois.', 'apps.err': 'Escolha pelo menos um app.',
      'td.h': 'Organize seu dia no Dusk', 'td.p': 'Sua agenda, tarefas e notas em um só lugar.', 'td.t1': 'Os eventos avisam antes de começar.', 'td.t2': 'Tarefas e notas ficam ao lado da agenda.',
      'tf.h': 'E-mail sem estresse', 'tf.p': 'O Fledge é sua caixa de entrada, com seu endereço Lareon.', 'tf.t1': 'Escreva e responda direto na janela.', 'tf.t2': 'As notificações avisam quando chega e-mail novo.',
      'ta.h': 'Pergunte qualquer coisa à Aster', 'ta.p': 'Seu assistente para perguntas, textos e ideias.', 'ta.t1': 'Pergunte com suas palavras. Sem comandos especiais.', 'ta.t2': 'Comece um novo chat quando quiser mudar de assunto.',
      'look.h': 'Escolha um visual', 'look.p': 'Igual ao seu computador, ou claro ou escuro.', 'look.auto': 'Automático', 'look.light': 'Claro', 'look.dark': 'Escuro',
      'nt.h': 'Fique por dentro', 'nt.p': 'Receba uma notificação quando um evento do Dusk começar ou chegar e-mail no Fledge.', 'nt.row': 'Notificações', 'nt.small': 'Mostradas enquanto o Lareon está aberto', 'nt.test': 'Enviar notificação de teste',
      'st.h': 'Sempre à mão', 'st.p': 'Abra o Lareon ao ligar o computador para não perder nenhum lembrete.', 'st.row': 'Abrir o Lareon ao iniciar', 'st.small': 'Você pode desativar quando quiser nas configurações do computador',
      'pv.h': 'Sua conta, seus dados', 'pv.p': 'Algumas coisas que vale saber antes de entrar.', 'pv.t1': 'O Lareon só abre páginas do lareon.org dentro do app. Outros links abrem no navegador.', 'pv.t2': 'Sua senha vai direto para o Lareon. O app nunca a guarda.', 'pv.t3': 'Você continua conectado neste computador até escolher Sair.',
      'sg.h': 'Deixe com a sua cara', 'sg.p': 'Entre ou crie sua conta. Sua senha vai direto para o Lareon.',
      'ks.h': 'Atalhos úteis', 'ks.p': 'Navegue sem tirar as mãos do teclado.', 'ks.home': 'Abrir Início', 'ks.reload': 'Recarregar o app atual', 'ks.zin': 'Aumentar zoom', 'ks.zout': 'Diminuir zoom', 'ks.zreset': 'Redefinir zoom', 'ks.jump': 'Ir para qualquer coisa',
      'dn.h': 'Tudo pronto', 'dn.hw': 'Boas-vindas, {n}', 'dn.in': 'Você está conectado.', 'dn.out': 'Você poderá entrar quando o Lareon abrir.', 'dn.ready': 'Seus apps estão prontos.', 'dn.t1': '{k} + 1 abre o Início, e 2, 3, 4 alternam entre os apps.', 'dn.t2': 'Precisa de ajuda? Abra Ajuda na barra de menus ou escreva para help@lareon.org.', 'dn.t3': 'Você pode repetir esta configuração pelo menu da conta.'
    },
    ja: {
      'err.region': 'お住まいの地域ではLareonをご利用いただけません。', 'err.maint': 'Lareonはメンテナンス中です。しばらくしてからお試しください。', 'off.t': '{a}に接続できません', 'off.p': 'インターネット接続を確認してください。作業内容は失われません。もう一度試すと続きから再開します。', 'off.b': 'もう一度試す',
      'btn.start': '始める', 'btn.cont': '続ける', 'btn.back': '戻る', 'btn.skip': '今はスキップ', 'btn.open': 'Lareonを開く', 'lang': '言語',
      'si.title': 'Lareonにサインイン', 'si.tag': 'Dusk、Fledge、Asterを1つのアカウントで。', 'si.user': 'ユーザー名', 'si.userph': 'ユーザー名', 'si.pass': 'パスワード', 'si.passph': 'パスワード', 'si.btn': 'サインイン',
      'si.forgot': 'パスワードをお忘れですか？', 'si.new': 'Lareonは初めてですか？', 'si.create': 'アカウントを作成', 'si.err.empty': 'ユーザー名とパスワードを入力してください。', 'si.err.fail': 'サインインできませんでした。もう一度お試しください。',
      'cd.title': 'コードを確認', 'cd.app': 'サインインコードを入力してください。認証アプリのコード{m}、またはバックアップコードを使えます。', 'cd.appmail': '、{c}に送ったコード', 'cd.mail': '{c}にコードを送信しました。下に入力してください。',
      'cd.label': '確認コード', 'cd.btn': '確認', 'cd.trust': 'このコンピュータでは30日間確認しない', 'cd.lost': 'スマートフォンを紛失しましたか？同じ欄にバックアップコードを入力できます。', 'cd.err': 'コードが正しくありません。もう一度お試しください。',
      'su.title': 'アカウントを作成', 'su.tag': 'Dusk、Fledge、Asterを1つのアカウントで。無料です。', 'su.name': 'お名前', 'su.nameph': 'お呼びする名前', 'su.user': 'ユーザー名を決める', 'su.pass': 'パスワード', 'su.passph': '6文字以上',
      'su.next': '続ける', 'su.have': 'アカウントをお持ちですか？', 'su.signin': 'サインイン', 'su.dob': '生年月日', 'su.month': '月', 'su.year': '年', 'su.dobwhy': '年齢の確認のみに使います。',
      'su.email': '復旧用メール', 'su.emailph': 'you@example.com', 'su.emailwhy': 'パスワードの再設定とサインインコードの送信に使います。確認用のコードをお送りします。', 'su.noemail': 'メールは追加しない', 'su.useemail': 'メールを追加する',
      'su.noemailnote': '復旧用メールがないと、パスワードを忘れた場合に再設定できません。大切に保管してください。', 'su.terms': '利用規約', 'su.agree': '利用規約に同意します', 'su.readall': '最後までスクロールすると続けられます。', 'su.create': 'アカウントを作成',
      'su.vtitle': 'メールを確認', 'su.vmsg': '{e}にコードを送信しました。入力してアカウントを作成します。', 'su.under': 'Lareonは13歳以上の方がご利用いただけます。', 'su.err.short': 'パスワードは6文字以上にしてください。', 'su.err.fill': 'すべての項目を入力してください。', 'su.err.dob': '生まれた月と年を入力してください。', 'su.err.email': 'メールアドレスを入力してください。', 'su.err.taken': 'このユーザー名は使えません。',
      'rs.title': 'パスワードを再設定', 'rs.tag': 'ユーザー名を入力すると、復旧用メールにコードを送ります。', 'rs.send': 'コードを送信', 'rs.sent': '{c}にコードを送信しました。', 'rs.code': 'コード', 'rs.new': '新しいパスワード', 'rs.btn': 'パスワードを再設定', 'rs.backup': 'バックアップコードを使う', 'rs.back': 'サインインに戻る', 'rs.err.fill': 'すべての項目を入力してください。',
      'greet.m': 'おはようございます', 'greet.a': 'こんにちは', 'greet.e': 'こんばんは', 'jump': '移動…', 'jump.ph': 'アプリや操作に移動', 'jump.none': '見つかりません',
      'today': '今日', 'events': '予定', 'tasks': 'タスク', 'ev.none': '今日の予定はありません。', 'tk.none': 'すべて完了しました。', 'tk.add': '追加', 'tk.ph': '今日のタスクを追加', 'tk.fail': 'タスクを追加できませんでした。もう一度お試しください。', 'tk.late': '期限切れ', 'tk.pri': '優先', 'allday': '終日',
      'inbox': '受信トレイ', 'unread1': '件の未読メッセージ', 'unreadn': '件の未読メッセージ', 'inbox.none': '受信トレイは空です。', 'nosubj': '（件名なし）', 'now': 'たった今',
      'open.dusk': 'Duskを開く', 'open.fledge': 'Fledgeを開く', 'open.x': '{a}を開く', 'apps': 'あなたのアプリ', 'home': 'ホーム', 'signedas': 'サインイン中', 'store': '{s}を使用中',
      'acct': 'アカウント設定', 'upd': 'アップデートを確認', 'out': 'サインアウト', 'signin': 'サインイン', 'offline': '現在Lareonに接続できません。', 'opening': '{a}を開いています…', 'sess': 'セッションが終了しました。もう一度サインインしてください。', 'signto': '{a}を開くにはサインインしてください。',
      'd.dusk': 'カレンダー、タスク、メモ', 'd.fledge': 'プライベートメール', 'd.aster': 'あなたのアシスタント',
      'wl.h': '使うものすべてを、ひとつのアカウントで。', 'wl.p': 'メール、カレンダー、タスク、メモ、そしてあなたのために働くアシスタント。プライベートで無料。',
      'wl.f1': 'Duskが1日を整える', 'wl.f2': 'Fledgeがメールを穏やかに', 'wl.f3': 'Asterが考えを手伝う', 'wl.f4': 'サインインは1回、インストールも1回',
      'hello.h': 'Lareonへようこそ', 'hello.p': 'Dusk、Fledge、Asterをひとつのアプリに。設定には1分ほどかかります。',
      'one.h': 'Lareonはひとつ', 'one.p': 'ひとつのウィンドウ、ひとつのアカウント。すべてがつながっているので、サインインは一度だけです。', 'one.t1': 'ウィンドウ上部のタブでアプリを切り替えます。ホームにはすべてが並びます。', 'one.t2': 'Lareonアカウントひとつで3つすべてにサインインできます。', 'one.t3': '追加のインストールは不要です。すべてこのアプリの中にあります。',
      'apps.h': 'アプリを選ぶ', 'apps.p': 'ウィンドウに表示するアプリを選びます。あとから変更できます。', 'apps.err': 'アプリを1つ以上選んでください。',
      'td.h': 'Duskで1日を計画', 'td.p': 'カレンダー、タスク、メモをひとつの場所に。', 'td.t1': '予定は始まる前にお知らせします。', 'td.t2': 'タスクとメモはカレンダーのすぐ隣にあります。',
      'tf.h': '穏やかなメール', 'tf.p': 'Fledgeは、あなたのLareonアドレスの受信トレイです。', 'tf.t1': 'ウィンドウの中で作成も返信もできます。', 'tf.t2': '新着メールは通知でお知らせします。',
      'ta.h': 'Asterに何でも聞く', 'ta.p': '質問、文章、アイデアのためのアシスタント。', 'ta.t1': '普通の言葉で聞くだけ。特別なコマンドは不要です。', 'ta.t2': '話題を変えたいときは新しいチャットを始めましょう。',
      'look.h': '外観を選ぶ', 'look.p': 'コンピュータに合わせるか、ライトかダークを選びます。', 'look.auto': '自動', 'look.light': 'ライト', 'look.dark': 'ダーク',
      'nt.h': '見逃さない', 'nt.p': 'Duskの予定の開始時や、Fledgeの新着メールを通知でお知らせします。', 'nt.row': '通知', 'nt.small': 'Lareonを開いている間に表示されます', 'nt.test': 'テスト通知を送る',
      'st.h': 'いつでも手元に', 'st.p': 'コンピュータの起動時にLareonを開いて、リマインダーを見逃しません。', 'st.row': '起動時にLareonを開く', 'st.small': 'コンピュータの設定からいつでもオフにできます',
      'pv.h': 'あなたのアカウント、あなたのデータ', 'pv.p': 'サインインの前に知っておきたいこと。', 'pv.t1': 'アプリ内ではlareon.orgのページだけを開きます。ほかのリンクはブラウザで開きます。', 'pv.t2': 'パスワードはLareonに直接送られ、アプリには保存されません。', 'pv.t3': 'サインアウトするまで、このコンピュータではサインインしたままです。',
      'sg.h': 'あなた仕様に', 'sg.p': 'サインインするか、アカウントを作成します。パスワードはLareonに直接送られます。',
      'ks.h': '便利なショートカット', 'ks.p': 'キーボードから手を離さずに移動できます。', 'ks.home': 'ホームを開く', 'ks.reload': '現在のアプリを再読み込み', 'ks.zin': '拡大', 'ks.zout': '縮小', 'ks.zreset': 'ズームをリセット', 'ks.jump': '何にでも移動',
      'dn.h': '準備ができました', 'dn.hw': 'ようこそ、{n}さん', 'dn.in': 'サインインしました。', 'dn.out': 'Lareonが開いたらサインインできます。', 'dn.ready': 'アプリの準備ができました。', 'dn.t1': '{k} + 1 でホーム、2・3・4 でアプリを切り替えます。', 'dn.t2': 'お困りですか？メニューバーのヘルプを開くか、help@lareon.org までご連絡ください。', 'dn.t3': 'この設定はアカウントメニューからやり直せます。'
    }
  };
  var NAMES = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', ja: '日本語' };
  var HELLO = ['Hello', 'Hola', 'Bonjour', 'こんにちは', 'Hallo', 'Olá', 'Ciao', '안녕하세요', 'مرحبا', 'नमस्ते', 'Привет', '你好', 'Merhaba', 'Hej', 'Salut'];
  var lang = 'en', subs = [], pick = null;
  function t(k, v) {
    var s = (D[lang] && D[lang][k]) || D.en[k] || k;
    if (v) for (var n in v) s = s.split('{' + n + '}').join(v[n]);
    return s;
  }
  function apply(root) {
    root = root || document;
    [].forEach.call(root.querySelectorAll('[data-i]'), function (e) { e.textContent = t(e.getAttribute('data-i')); });
    [].forEach.call(root.querySelectorAll('[data-ip]'), function (e) { e.setAttribute('placeholder', t(e.getAttribute('data-ip'))); });
    document.documentElement.lang = lang;
  }
  function set(l, silent) {
    if (!D[l]) l = 'en';
    lang = l; apply();
    if (!silent) { if (pick) pick(l); }
    subs.forEach(function (f) { try { f(l); } catch (e) {} });
  }
  function guess(loc) { var s = String(loc || (navigator.language || 'en')).toLowerCase().slice(0, 2); return D[s] ? s : 'en'; }

  var css = '.hw-wrap{position:relative;display:inline-block;height:1.25em;min-width:6ch}.hw{position:absolute;left:0;right:0;top:0;white-space:nowrap;text-align:center;opacity:0;transform:translateY(.45em) scale(.96);filter:blur(10px);transition:opacity 1s cubic-bezier(.2,.7,.2,1),transform 1.1s cubic-bezier(.2,.7,.2,1),filter 1s cubic-bezier(.2,.7,.2,1)}' +
    '.hw.in{opacity:1;transform:none;filter:none}.hw.out{opacity:0;transform:translateY(-.45em) scale(1.03);filter:blur(10px)}' +
    '.lm{position:fixed;z-index:60;min-width:180px;background:var(--solid);border:1px solid var(--line2);border-radius:12px;padding:6px;box-shadow:var(--shadow);animation:lmIn .18s cubic-bezier(.2,.7,.2,1) both;-webkit-app-region:no-drag}' +
    '@keyframes lmIn{from{opacity:0;transform:translateY(-4px) scale(.98)}}.lm button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;text-align:left;background:none;border:0;color:var(--fg);font:inherit;font-size:14px;padding:8px 10px;border-radius:8px;cursor:pointer}' +
    '.lm button:hover{background:var(--panel2)}.lm button[aria-checked=true]:after{content:"✓";color:var(--orange)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // A greeting that drifts from one language to the next.
  function hello(el, opts) {
    opts = opts || {};
    el.classList.add('hw-wrap'); el.setAttribute('aria-hidden', 'true'); el.innerHTML = '';
    var i = 0, cur = null, timer = null;
    function show() {
      var n = document.createElement('span'); n.className = 'hw'; n.textContent = HELLO[i % HELLO.length]; i++;
      el.appendChild(n); void n.offsetWidth;
      if (cur) { var o = cur; o.classList.remove('in'); o.classList.add('out'); setTimeout(function () { o.remove(); }, 1300); }
      n.classList.add('in'); cur = n;
    }
    show();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(show, opts.every || 2600);
    return { stop: function () { clearInterval(timer); } };
  }
  // A small menu to pick the language.
  function menu(anchor, dir) {
    var old = document.querySelector('.lm'); if (old) { old.remove(); return; }
    var m = document.createElement('div'); m.className = 'lm'; m.setAttribute('role', 'menu');
    Object.keys(NAMES).forEach(function (k) {
      var b = document.createElement('button'); b.setAttribute('role', 'menuitemradio'); b.setAttribute('aria-checked', k === lang ? 'true' : 'false'); b.textContent = NAMES[k];
      b.onclick = function () { m.remove(); set(k); }; m.appendChild(b);
    });
    document.body.appendChild(m);
    var r = anchor.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    var x = Math.min(Math.max(8, r.right - w), innerWidth - w - 8), y = dir === 'up' ? r.top - h - 8 : r.bottom + 8;
    m.style.left = x + 'px'; m.style.top = Math.max(8, y) + 'px';
    setTimeout(function () { document.addEventListener('mousedown', function off(e) { if (!m.contains(e.target) && e.target !== anchor) { m.remove(); document.removeEventListener('mousedown', off); } else if (!document.body.contains(m)) document.removeEventListener('mousedown', off); }); }, 0);
  }
  window.i18n = { t: t, set: set, apply: apply, guess: guess, hello: hello, menu: menu, names: NAMES, get lang() { return lang; }, onChange: function (f) { subs.push(f); }, onPick: function (f) { pick = f; } };
})();
