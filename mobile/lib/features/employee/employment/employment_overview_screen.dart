import 'package:flutter/material.dart';

import '../../../core/constants/app_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/hero_banner.dart';

class EmploymentOverviewScreen extends StatelessWidget {
  const EmploymentOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
      children: const [
        Text('Mon emploi', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.text)),
        SizedBox(height: 8),
        Text('Retrouvez les informations liées à votre expérience professionnelle.', style: TextStyle(color: AppColors.secondaryText)),
        SizedBox(height: 20),
        HeroBanner(assetPath: AppAssets.heroRecruitment, title: 'Votre parcours professionnel évolue', subtitle: 'Conservez vos candidatures et retrouvez votre nouvelle expérience au même endroit.', height: 220, semanticLabel: 'Poignée de main lors d’un recrutement'),
        SizedBox(height: 18),
        Card(child: Padding(padding: EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Emploi actuel', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.text)), _EmploymentBadge()]), SizedBox(height: 16), Text('Product Designer', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700, color: AppColors.text)), SizedBox(height: 5), Text('Studio Nova', style: TextStyle(color: AppColors.secondaryText)), SizedBox(height: 14), Row(children: [Icon(Icons.calendar_today_outlined, size: 17, color: AppColors.secondaryText), SizedBox(width: 8), Text('Depuis le 01 juillet 2026', style: TextStyle(color: AppColors.secondaryText))]), SizedBox(height: 8), Row(children: [Icon(Icons.location_on_outlined, size: 17, color: AppColors.secondaryText), SizedBox(width: 8), Text('Paris · Hybride', style: TextStyle(color: AppColors.secondaryText))])]))),
        SizedBox(height: 14),
        Card(child: Padding(padding: EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Historique professionnel', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.text)), SizedBox(height: 14), _HistoryRow(title: 'Product Designer', company: 'Studio Nova', period: 'Expérience active', color: AppColors.green), Divider(height: 24), _HistoryRow(title: 'UX/UI Designer', company: 'JOBSINC Labs', period: 'Candidature conservée', color: AppColors.secondaryText)]))),
        SizedBox(height: 16),
        Text('Les informations d’emploi seront synchronisées après confirmation par l’entreprise.', style: TextStyle(fontSize: 12, color: AppColors.secondaryText)),
      ],
    );
  }
}

class _EmploymentBadge extends StatelessWidget {
  const _EmploymentBadge();

  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6), decoration: BoxDecoration(color: AppColors.green.withValues(alpha: .1), borderRadius: BorderRadius.circular(20)), child: const Text('ACTIF', style: TextStyle(color: AppColors.green, fontSize: 11, fontWeight: FontWeight.w800)));
}

class _HistoryRow extends StatelessWidget {
  const _HistoryRow({required this.title, required this.company, required this.period, required this.color});
  final String title;
  final String company;
  final String period;
  final Color color;

  @override
  Widget build(BuildContext context) => Row(children: [Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.text)), const SizedBox(height: 3), Text(company, style: const TextStyle(color: AppColors.secondaryText))])), Text(period, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600))]);
}
