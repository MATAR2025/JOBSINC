import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/hero_banner.dart';
import '../../candidate/home/data/home_repository.dart';
import '../providers/applications_provider.dart';

class ApplicationsScreen extends ConsumerWidget {
  const ApplicationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final applicationsAsync = ref.watch(applicationsProvider);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(applicationsProvider);
        await ref.read(applicationsProvider.future);
      },
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
        children: [
          const Text(
            'Mes candidatures',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Suivez chaque étape de votre parcours professionnel.',
            style: TextStyle(color: AppColors.secondaryText),
          ),
          const SizedBox(height: 22),
          applicationsAsync.when(
            loading: () => const _SkeletonList(),
            error: (error, _) => _ErrorState(
              onRetry: () => ref.invalidate(applicationsProvider),
            ),
            data: (applications) {
              if (applications.isEmpty) {
                return const _EmptyState();
              }
              return Column(
                children: [
                  ...applications.map(
                    (app) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: _ApplicationCard(application: app),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

// ============================================================
// APPLICATION CARD
// ============================================================

class _ApplicationCard extends StatelessWidget {
  const _ApplicationCard({required this.application});
  final HomeApplication application;

  static const _statusColors = <String, Color>{
    'PENDING': AppColors.warning,
    'SUBMITTED': AppColors.warning,
    'VIEWED': AppColors.primary,
    'INTERVIEW': AppColors.primary,
    'ACCEPTED': AppColors.green,
    'REJECTED': AppColors.error,
    'CANCELLED': AppColors.secondaryText,
  };

  Color get _statusColor =>
      _statusColors[application.status.toUpperCase()] ?? AppColors.secondaryText;

  int get _activeStep {
    switch (application.status.toUpperCase()) {
      case 'PENDING':
      case 'SUBMITTED':
        return 0;
      case 'VIEWED':
        return 1;
      case 'INTERVIEW':
        return 2;
      case 'ACCEPTED':
      case 'REJECTED':
        return 3;
      default:
        return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final date = application.createdAt;
    final dateLabel = date != null
        ? '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}'
        : '';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.background),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: .025),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.navy.withValues(alpha: .10),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.business_rounded,
                  color: AppColors.navy,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      application.jobTitle ?? 'Offre',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      application.companyName ?? 'Entreprise',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.secondaryText,
                      ),
                    ),
                  ],
                ),
              ),
              _StatusBadge(label: application.statusLabel, color: _statusColor),
            ],
          ),
          if (dateLabel.isNotEmpty) ...[
            const SizedBox(height: 14),
            Text(
              'Candidature envoyée le $dateLabel',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.secondaryText,
              ),
            ),
          ],
          const SizedBox(height: 14),
          _ApplicationTimeline(activeStep: _activeStep),
        ],
      ),
    );
  }
}

// ============================================================
// TIMELINE
// ============================================================

class _ApplicationTimeline extends StatelessWidget {
  const _ApplicationTimeline({required this.activeStep});
  final int activeStep;

  @override
  Widget build(BuildContext context) {
    const labels = ['Envoyée', 'Vue', 'Entretien', 'Décision'];

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(labels.length, (index) {
        final isActive = index <= activeStep;
        return Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: isActive ? AppColors.primary : AppColors.border,
                      shape: BoxShape.circle,
                    ),
                    child: isActive
                        ? const Icon(Icons.check, size: 14, color: Colors.white)
                        : null,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    labels[index],
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 10,
                      color: isActive ? AppColors.primary : AppColors.secondaryText,
                      fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
                    ),
                  ),
                ],
              ),
              if (index < labels.length - 1)
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.only(top: 10),
                    height: 2,
                    color: index < activeStep ? AppColors.primary : AppColors.border,
                  ),
                ),
            ],
          ),
        );
      }),
    );
  }
}

// ============================================================
// STATUS BADGE
// ============================================================

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.label, required this.color});
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: .3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

// ============================================================
// EMPTY STATE
// ============================================================

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: .08),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.send_outlined,
              size: 30,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Aucune candidature pour le moment',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Postulez à une offre pour suivre\nvotre progression ici.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.secondaryText,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// SKELETON
// ============================================================

class _SkeletonList extends StatelessWidget {
  const _SkeletonList();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        3,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Container(
            height: 140,
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(18),
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// ERROR
// ============================================================

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.onRetry});
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        children: [
          const Icon(
            Icons.cloud_off_rounded,
            size: 48,
            color: AppColors.secondaryText,
          ),
          const SizedBox(height: 12),
          const Text(
            'Impossible de charger vos candidatures.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.secondaryText),
          ),
          const SizedBox(height: 14),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded, size: 18),
            label: const Text('Réessayer'),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// SUCCESS SCREENS (used by router)
// ============================================================

class ApplicationSuccessScreen extends StatelessWidget {
  const ApplicationSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          children: [
            const HeroBanner(
              assetPath: AppAssets.heroRecruitment,
              title: 'Candidature envoyée !',
              subtitle: 'Votre candidature a bien été transmise à l\'entreprise.',
              height: 270,
              semanticLabel: 'Poignée de main lors d\'un entretien professionnel',
            ),
            const SizedBox(height: 22),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.background),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: .1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mark_email_read_outlined,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'La prochaine étape ?',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Vous recevrez une notification dès que l\'entreprise aura consulté votre candidature.',
                          style: TextStyle(
                            color: AppColors.secondaryText,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Suivre ma candidature'),
            ),
            const SizedBox(height: 10),
            OutlinedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Voir mes candidatures'),
            ),
          ],
        ),
      ),
    );
  }
}

class RecruitmentConfirmedScreen extends StatelessWidget {
  const RecruitmentConfirmedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          children: [
            HeroBanner(
              assetPath: AppAssets.heroRecruitment,
              title: 'Félicitations !',
              subtitle: 'Votre parcours professionnel évolue avec JOBSINC.',
              buttonLabel: 'Accéder à mon espace employé',
              onPressed: () => Navigator.of(context).pop(),
              height: 286,
              semanticLabel: 'Poignée de main après une réussite professionnelle',
            ),
            const SizedBox(height: 22),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.background),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: .1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.verified_outlined,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Recrutement confirmé',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Votre statut est mis à jour par le système après confirmation de l\'entreprise. Vous conservez votre compte et l\'historique de vos candidatures.',
                          style: TextStyle(
                            color: AppColors.secondaryText,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
