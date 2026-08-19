import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class AppSectionScreen extends StatelessWidget {
  const AppSectionScreen({super.key, required this.title, required this.description, required this.icon});

  final String title;
  final String description;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
      children: [
        Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.text)),
        const SizedBox(height: 8),
        Text(description, style: const TextStyle(color: AppColors.secondaryText)),
        const SizedBox(height: 32),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              children: [
                Icon(icon, size: 52, color: AppColors.primary),
                const SizedBox(height: 16),
                Text('Votre espace $title', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.text)),
                const SizedBox(height: 8),
                const Text('Les données seront synchronisées avec votre compte JOBSINC.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.secondaryText)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
