import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_section_screen.dart';
import '../../../core/widgets/app_shell.dart';
import '../../../core/widgets/hero_banner.dart';
import '../../auth/providers/auth_provider.dart';
import '../../profile/presentation/profile_screen.dart';
import '../employment/employment_overview_screen.dart';

class EmployeeDashboardScreen extends ConsumerStatefulWidget {
  const EmployeeDashboardScreen({super.key});

  @override
  ConsumerState<EmployeeDashboardScreen> createState() => _EmployeeDashboardScreenState();
}

class _EmployeeDashboardScreenState extends ConsumerState<EmployeeDashboardScreen> {
  int tab = 0;

  @override
  Widget build(BuildContext context) {
    final firstName = ref.watch(authProvider).user?.firstName.trim();
    final displayName = firstName == null || firstName.isEmpty ? 'Utilisateur' : firstName;

    return AppShell(currentIndex: tab, onDestinationSelected: (value) => setState(() => tab = value), employee: true, body: _buildBody(displayName));
  }

  Widget _buildBody(String displayName) {
    if (tab == 1) return const EmploymentOverviewScreen();
    if (tab == 2) return const AppSectionScreen(title: 'Documents professionnels', description: 'Retrouvez vos contrats et vos documents de travail.', icon: Icons.folder_outlined);
    if (tab == 3) return const AppSectionScreen(title: 'Messages', description: 'Échangez avec votre entreprise et vos interlocuteurs.', icon: Icons.chat_bubble_outline);
    if (tab == 4) return const ProfileScreen(employee: true);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
      children: [
        Text('Bonjour $displayName 👋', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.text)),
        const SizedBox(height: 6),
        const Text('Voici votre espace professionnel JOBSINC.', style: TextStyle(color: AppColors.secondaryText)),
        const SizedBox(height: 18),
        HeroBanner(assetPath: AppAssets.heroRecruitment, title: 'Félicitations pour cette nouvelle étape', subtitle: 'Votre compte conserve votre parcours et s’adapte à votre expérience professionnelle.', buttonLabel: 'Voir mon emploi', onPressed: () => setState(() => tab = 1), height: 250, semanticLabel: 'Poignée de main lors d’un recrutement'),
        const SizedBox(height: 18),
        const Card(child: Padding(padding: EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Emploi actuel', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.text)), _ActiveBadge()]), SizedBox(height: 14), Text('Product Designer', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700, color: AppColors.text)), SizedBox(height: 4), Text('Studio Nova · Paris · Hybride', style: TextStyle(color: AppColors.secondaryText)), SizedBox(height: 16), Text('Vos candidatures historiques restent accessibles dans votre compte JOBSINC.', style: TextStyle(color: AppColors.secondaryText, height: 1.4))]))),
      ],
    );
  }
}

class _ActiveBadge extends StatelessWidget {
  const _ActiveBadge();

  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6), decoration: BoxDecoration(color: AppColors.green.withValues(alpha: .1), borderRadius: BorderRadius.circular(20)), child: const Text('ACTIF', style: TextStyle(color: AppColors.green, fontSize: 11, fontWeight: FontWeight.w800)));
}
