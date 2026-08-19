import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AppLoader extends StatelessWidget { const AppLoader({super.key}); @override Widget build(BuildContext context) => const Center(child: CircularProgressIndicator()); }
class AppEmptyState extends StatelessWidget { const AppEmptyState({super.key, required this.title, this.icon = Icons.inbox_outlined}); final String title; final IconData icon; @override Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(icon, size: 48, color: AppColors.secondaryText), const SizedBox(height: 12), Text(title, style: const TextStyle(color: AppColors.secondaryText))])); }
class AppErrorState extends StatelessWidget { const AppErrorState({super.key, this.onRetry}); final VoidCallback? onRetry; @override Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.error_outline, size: 48, color: AppColors.error), const SizedBox(height: 12), const Text('Une erreur est survenue'), if (onRetry != null) TextButton(onPressed: onRetry, child: const Text('Réessayer'))])); }
