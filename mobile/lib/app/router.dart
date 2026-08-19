import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/widgets/app_section_screen.dart';
import '../features/applications/presentation/applications_screen.dart';
import '../features/auth/models/auth_user.dart';
import '../features/auth/presentation/auth_screens.dart';
import '../features/auth/providers/auth_provider.dart';
import '../features/candidate/home/candidate_home_screen.dart';
import '../features/employee/dashboard/employee_dashboard_screen.dart';

/// Permet à GoRouter de se rafraîchir lorsque l'état
/// d'authentification change, sans recréer le GoRouter.
class AuthRouterNotifier extends ChangeNotifier {
  AuthRouterNotifier(this._authState);

  AuthState _authState;

  AuthState get authState => _authState;

  void update(AuthState newState) {
    if (_authState == newState) return;

    _authState = newState;
    notifyListeners();
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  // IMPORTANT :
  // On utilise read() et non watch().
  // Le GoRouter ne sera donc créé qu'une seule fois.
  final authNotifier = AuthRouterNotifier(
    ref.read(authProvider),
  );

  // On écoute uniquement les changements d'authentification
  // pour demander à GoRouter de réévaluer redirect().
  final subscription = ref.listen<AuthState>(
    authProvider,
    (_, next) {
      authNotifier.update(next);
    },
  );

  // Nettoyage lorsque le provider est détruit.
  ref.onDispose(() {
    subscription.close();
    authNotifier.dispose();
  });

  return GoRouter(
    initialLocation: '/splash',

    // GoRouter réévalue redirect() lorsque l'authentification change.
    refreshListenable: authNotifier,

    redirect: (context, state) {
      final auth = authNotifier.authState;
      final location = state.uri.path;

      const publicRoutes = {
        '/splash',
        '/onboarding',
        '/login',
        '/register',
        '/forgot-password',
      };

      final isPublicRoute = publicRoutes.contains(location);

      // ---------------------------------------------------------
      // 1. AUTHENTIFICATION EN COURS
      // ---------------------------------------------------------
      if (auth.status == AuthStatus.loading) {
        // Pendant l'initialisation ou la connexion, on reste sur la page publique actuelle (splash, login, etc.).
        if (isPublicRoute) {
          return null;
        }

        return '/splash';
      }

      // ---------------------------------------------------------
      // 2. UTILISATEUR NON CONNECTÉ
      // ---------------------------------------------------------
      if (auth.status != AuthStatus.authenticated) {
        // Les pages publiques restent accessibles.
        if (isPublicRoute) {
          return null;
        }

        // Toute page privée renvoie vers la connexion.
        return '/login';
      }

      // ---------------------------------------------------------
      // 3. UTILISATEUR CONNECTÉ
      // ---------------------------------------------------------
      final user = auth.user;

      // Sécurité supplémentaire.
      if (user == null) {
        return '/login';
      }

      final accountStatus = user.status;

      // ---------------------------------------------------------
      // 4. EMPÊCHER UN UTILISATEUR CONNECTÉ DE RETOURNER
      //    SUR LOGIN / REGISTER / SPLASH / ONBOARDING
      // ---------------------------------------------------------
      final isAuthRoute = location == '/splash' ||
          location == '/login' ||
          location == '/register' ||
          location == '/onboarding' ||
          location == '/forgot-password';

      if (isAuthRoute) {
        if (accountStatus == AccountStatus.candidate) {
          return '/candidate/home';
        }

        return '/employee/dashboard';
      }

      // ---------------------------------------------------------
      // 5. PROTECTION DE L'ESPACE CANDIDAT
      // ---------------------------------------------------------
      if (location.startsWith('/candidate') &&
          accountStatus != AccountStatus.candidate) {
        return '/employee/dashboard';
      }

      // ---------------------------------------------------------
      // 6. PROTECTION DE L'ESPACE EMPLOYÉ
      // ---------------------------------------------------------
      if (location.startsWith('/employee') &&
          accountStatus != AccountStatus.employee) {
        return '/candidate/home';
      }

      // ---------------------------------------------------------
      // 7. ROUTE AUTORISÉE
      // ---------------------------------------------------------
      return null;
    },

    routes: [
      // ---------------------------------------------------------
      // ROOT
      // ---------------------------------------------------------
      GoRoute(
        path: '/',
        redirect: (_, __) => '/splash',
      ),

      // ---------------------------------------------------------
      // AUTHENTIFICATION
      // ---------------------------------------------------------
      GoRoute(
        path: '/splash',
        builder: (_, __) => const SplashScreen(),
      ),

      GoRoute(
        path: '/onboarding',
        builder: (_, __) => const OnboardingScreen(),
      ),

      GoRoute(
        path: '/login',
        builder: (_, __) => const LoginScreen(),
      ),

      GoRoute(
        path: '/register',
        builder: (_, __) => const RegisterScreen(),
      ),

      GoRoute(
        path: '/forgot-password',
        builder: (_, __) => const ForgotPasswordScreen(),
      ),

      // ---------------------------------------------------------
      // CANDIDAT
      // ---------------------------------------------------------
      GoRoute(
        path: '/candidate/home',
        builder: (_, __) => const CandidateHomeScreen(),
      ),

      GoRoute(
        path: '/candidate/notifications',
        builder: (_, __) => const AppSectionScreen(
          title: 'Notifications',
          description:
              'Vos notifications apparaîtront ici lorsqu’elles seront disponibles.',
          icon: Icons.notifications_none_rounded,
        ),
      ),

      // ---------------------------------------------------------
      // EMPLOYÉ / ENTREPRISE
      // ---------------------------------------------------------
      GoRoute(
        path: '/employee/dashboard',
        builder: (_, __) => const EmployeeDashboardScreen(),
      ),

      // ---------------------------------------------------------
      // APPLICATIONS
      // ---------------------------------------------------------
      GoRoute(
        path: '/application/success',
        builder: (_, __) => const ApplicationSuccessScreen(),
      ),

      GoRoute(
        path: '/recruitment/confirmed',
        builder: (_, __) => const RecruitmentConfirmedScreen(),
      ),
    ],
  );
});
